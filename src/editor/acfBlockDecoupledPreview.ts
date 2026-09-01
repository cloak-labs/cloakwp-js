import { ContentSourceRegistry } from "@cloakui/content-sources";

const debugEnabled =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_CLOAKWP_DEBUG_PREVIEW === "1";

const debugLog = (...args: unknown[]) => {
  if (debugEnabled) console.log(...args);
};

/**
 * ## Preview iframe auto-height and viewport-relative content
 *
 * The editor sizes this iframe to whatever height we report, which makes the
 * iframe's viewport a function of our own reports. Content sized in viewport
 * units (100vh, calc(100svh - X), 50vh, ...) then re-measures after every
 * resize, creating a feedback loop:
 *
 *   report C -> WP sets iframe height to C -> viewport = C -> content
 *   re-measures -> report again -> ...
 *
 * We can't read CSS to detect this (arbitrary project styles), but we don't
 * need to: when WP applies a height, only the iframe's HEIGHT changes — width
 * is untouched, so ordinary content cannot rewrap. Any content-height change
 * that coincides with a viewport-height change is therefore viewport-driven.
 * That lets us measure the coupling empirically as a local linear model:
 *
 *   content(V) ≈ r * V + b   where r = ΔC/ΔV across a viewport change
 *
 * - r ≈ 0 — content is independent of the viewport: report normally.
 * - 0 < r < 1 — partially tied (e.g. 50vh + fixed content): the naive loop
 *   converges geometrically to the fixed point H* = b / (1 - r), where the
 *   content exactly fits its own iframe. We jump straight there.
 * - r ≈ 1 — fully tied (100vh-style): content is always `b` away from the
 *   viewport, so NO self-consistent height exists. The only sensible height
 *   is an external reference for "one screen": the editor sends its canvas
 *   viewport height (`previewViewportHeight` message) and we pin to
 *   r * ref + b — i.e. what the block would measure at one editor-screen.
 *   Ratios above 1 (e.g. 150vh stretch heroes) use the same formula with
 *   the measured r (1.5, 2, …) uncapped.
 *
 * A rate-limit valve caps viewport-driven corrections as a last resort, so
 * even pathological non-linear content settles instead of looping.
 */

/**
 * "One screen" reference height posted by the WP editor (its canvas
 * viewport). Zero until the parent sends `previewViewportHeight`.
 */
let editorViewportHeight = 0;
const editorViewportListeners = new Set<(h: number) => void>();

/**
 * When fully viewport-tied content is pinned, raw measurements are
 * self-referential and must not be reported (e.g. in response to WP's
 * "getHeight" request) — report the pin instead.
 */
let pinnedHeight: number | null = null;

/** Last height actually posted to WP, shared so all senders agree. */
let lastSentHeight: number | null = null;

/**
 * While true, suppress unsolicited height posts until the editor sends its
 * canvas viewport reference (or the bootstrap timeout elapses).
 *
 * Start true so the empty `#root` (before the Server Action paints) cannot
 * report getDocumentHeight()'s 20px floor and collapse the iframe.
 */
let deferHeightUntilEditorViewport = true;

export type PreviewMessageContext = {
  previewKey: string;
  targetOrigin?: string;
};

export type HandlePreviewMessageOptions<BlockData = unknown> =
  PreviewMessageContext & {
    onBlockDataReceipt?: (blockData: BlockData) => void;
  };

/** Design-system viewport tokens overridden to px during block preview. */
export const PREVIEW_VIEWPORT_CSS_VARS = [
  "--100vh",
  "--100svh",
  "--100dvh",
] as const;

/** Anchor `--100vh` / `--100svh` / `--100dvh` to one editor-screen height (px). */
export const applyPreviewViewportTokens = (heightPx: number) => {
  if (typeof document === "undefined") return;
  const value = `${Math.round(heightPx)}px`;
  // Defaults live on #root in shared/styles/base.css — that wins over html for
  // block content, so preview overrides must target the same element.
  const target =
    document.getElementById("root") ?? document.documentElement;
  for (const name of PREVIEW_VIEWPORT_CSS_VARS) {
    target.style.setProperty(name, value);
  }
  window.dispatchEvent(new Event("resize"));
};

/**
 * True once the preview Server Action has committed block UI into `#root`.
 * Empty-shell measurements (minHeight 20, min-h-0 flex) must not be reported
 * — they collapse the iframe before viewport-tied heroes can bind.
 */
export const previewHasBlockContent = () => {
  if (typeof document === "undefined") return false;
  const root = document.getElementById("root");
  return !!root && root.childElementCount > 0;
};

// Sends the block preview page's height to WP via iFrame message posting
export const sendBlockHeightToWP = (
  h: number | null = null,
  context?: PreviewMessageContext,
) => {
  if (h == null && !previewHasBlockContent()) {
    return;
  }
  if (
    h == null &&
    deferHeightUntilEditorViewport &&
    editorViewportHeight <= 0
  ) {
    return;
  }
  const height = Math.round(h ?? pinnedHeight ?? getDocumentHeight());
  if (!Number.isFinite(height) || height <= 0) return;
  const resolved = resolvePreviewMessageContext(context);
  if (!resolved) return;
  lastSentHeight = height;
  debugLog("Sending height to WP Block Editor: ", height);
  postMessageToWpEditor(
    {
      type: "cloakwp-preview-height",
      previewKey: resolved.previewKey,
      height,
    },
    resolved.targetOrigin,
  );
};

/**
 * Lowest document-Y of `root` and its descendants, including content that
 * overflows a fixed/`100vh`/`position:absolute` box. `#root.scrollHeight`
 * only sees in-flow border boxes, so abspos hero copy (xl:absolute) or a
 * `h-[var(--100vh)]` section with taller type reports ~one viewport and the
 * editor iframe clips the rest.
 */
const getOverflowingContentBottom = (root: HTMLElement) => {
  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  const rootRect = root.getBoundingClientRect();
  let maxBottom = rootRect.bottom;
  let minTop = rootRect.top;

  const nodes = root.querySelectorAll("*");
  for (let i = 0; i < nodes.length; i++) {
    const rect = nodes[i].getBoundingClientRect();
    if (rect.width <= 0 && rect.height <= 0) continue;
    maxBottom = Math.max(maxBottom, rect.bottom);
    minTop = Math.min(minTop, rect.top);
  }

  // Paint above y=0 (centered abspos copy overflowing a 100vh box) still
  // needs iframe pixels — adding it to the bottom is the only lever we have.
  const topOverflow = Math.max(0, -minTop);
  return Math.ceil(maxBottom + scrollY + topOverflow);
};

/**
 * Content height for the preview iframe — must NOT use documentElement's
 * offset/client height. Those track the iframe viewport, so when WP sizes the
 * iframe to H (or H+1) the next report becomes H+1 and each edit grows by 1px.
 */
export const getDocumentHeight = () => {
  const minHeight = 20;
  if (typeof document === "undefined") return minHeight;

  const root = document.getElementById("root");
  if (root) {
    // offsetTop accounts for body/margins above #root; scrollHeight covers
    // in-flow overflow of the root's box. Descendant rects cover abspos /
    // specified-height overflow that scrollHeight misses.
    const top = root.offsetTop;
    const boxHeight = Math.max(root.scrollHeight, root.offsetHeight);
    const overflowing = getOverflowingContentBottom(root);
    return Math.max(minHeight, Math.ceil(top + boxHeight), overflowing);
  }

  const body = document.body;
  const html = document.documentElement;
  return Math.max(
    minHeight,
    body?.scrollHeight ?? 0,
    html?.scrollHeight ?? 0,
  );
};

export function getConfiguredWpOrigin(): string | null {
  try {
    return new URL(ContentSourceRegistry.get().getActiveUrl()).origin;
  } catch {
    return null;
  }
}

const TRUSTED_WP_HOSTS = new Set([
  "wp.localhost",
  "localhost",
  "staging.pillarlabs.co",
  "sites.cloaklabs.co",
]);

const TRUSTED_WP_HOST_SUFFIXES = [
  ".pillarlabs.co",
  ".cloaklabs.co",
  ".localhost",
] as const;

export function isTrustedWpOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    if (url.origin !== origin) return false;
    const host = url.hostname;
    if (TRUSTED_WP_HOSTS.has(host)) return true;
    return TRUSTED_WP_HOST_SUFFIXES.some(
      (suffix) => host.endsWith(suffix) && host.length > suffix.length,
    );
  } catch {
    return false;
  }
}

/**
 * Origin to target for preview iframe postMessage.
 *
 * Prefer the HMAC-bound `wpOrigin` from the preview token (the WP admin that
 * issued it). Fall back to the actual embedder (ancestorOrigins / referrer)
 * when that origin is an agency WP host — this covers local wp-admin pointed
 * at a staging DB while NEXT_PUBLIC_WP_ENVIRONMENT is still "staging".
 */
export function resolvePreviewTargetOrigin(
  preferred?: string | null,
): string | null {
  if (preferred) {
    try {
      const url = new URL(preferred);
      if (
        (url.protocol === "https:" || url.protocol === "http:") &&
        url.origin === preferred
      ) {
        return preferred;
      }
    } catch {
      /* ignore invalid preferred origin */
    }
  }

  if (typeof window !== "undefined") {
    const ancestors = window.location.ancestorOrigins;
    if (ancestors && ancestors.length > 0) {
      const topOrigin = ancestors[ancestors.length - 1];
      if (isTrustedWpOrigin(topOrigin)) return topOrigin;
    }
    if (document.referrer) {
      try {
        const referrerOrigin = new URL(document.referrer).origin;
        if (isTrustedWpOrigin(referrerOrigin)) return referrerOrigin;
      } catch {
        /* ignore */
      }
    }
  }

  return getConfiguredWpOrigin();
}

function resolvePreviewMessageContext(
  context?: PreviewMessageContext,
): Required<PreviewMessageContext> | null {
  const previewKey =
    context?.previewKey ??
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("previewKey") ?? ""
      : "");
  const targetOrigin = context?.targetOrigin ?? resolvePreviewTargetOrigin();
  return previewKey && targetOrigin ? { previewKey, targetOrigin } : null;
}

function postMessageToWpEditor(payload: unknown, targetOrigin: string): void {
  // Gutenberg canvas nesting can put the listener on parent or top.
  window.parent?.postMessage(payload, targetOrigin);
  if (window.top && window.top !== window.parent) {
    window.top.postMessage(payload, targetOrigin);
  }
}

function isMessageFromWpEditor(
  event: MessageEvent,
  targetOrigin: string,
): boolean {
  const fromEmbedder =
    event.source === window.parent ||
    (window.top != null && event.source === window.top);
  return fromEmbedder && event.origin === targetOrigin;
}

export function sendPreviewReadyToWp(
  previewKey: string,
  targetOrigin = resolvePreviewTargetOrigin(),
): void {
  if (!previewKey || !targetOrigin) return;
  postMessageToWpEditor(
    {
      type: "cloakwp-preview-ready",
      previewKey,
    },
    targetOrigin,
  );
}

// When parent (i.e. WP Block Editor) sends message, this function handles it:
export function handleWPBlockIframeMessage<BlockData = unknown>(
  event: MessageEvent,
  {
    previewKey,
    targetOrigin = resolvePreviewTargetOrigin(),
    onBlockDataReceipt,
  }: HandlePreviewMessageOptions<BlockData>,
): void {
  if (!targetOrigin || !isMessageFromWpEditor(event, targetOrigin)) {
    debugLog("Ignoring preview message from untrusted origin:", event.origin);
    return;
  }

  let data: unknown = event.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return;
    }
  }
  if (!data || typeof data !== "object") return;

  const payload = data as {
    type?: unknown;
    previewKey?: unknown;
    blockData?: unknown;
    bodyClassName?: unknown;
    previewViewportHeight?: unknown;
  };

  if (payload.previewKey !== previewKey || typeof payload.type !== "string") {
    return;
  }

  if (payload.type === "cloakwp-preview-get-height") {
    sendBlockHeightToWP(null, { previewKey, targetOrigin });
    return;
  }
  if (payload.type !== "cloakwp-preview-update") {
    return;
  }

  if (payload.blockData && typeof payload.blockData === "object") {
    debugLog("blockData received from WP: ", payload.blockData);
    onBlockDataReceipt?.(payload.blockData as BlockData);
  }
  if (payload.bodyClassName) {
    // WP sets classes on the iframe <body> (color themes / dark mode).
    debugLog("bodyClassName received from WP: ", payload);
    const { bodyClassName } = payload;
    if (Array.isArray(bodyClassName))
      document.body.classList.add(...bodyClassName.map(String));
    else if (typeof bodyClassName === "string" && bodyClassName.includes(" "))
      document.body.classList.add(...bodyClassName.split(" "));
    else if (typeof bodyClassName === "string")
      document.body.classList.add(bodyClassName);
  }
  if (
    typeof payload.previewViewportHeight === "number" &&
    Number.isFinite(payload.previewViewportHeight) &&
    payload.previewViewportHeight > 0
  ) {
    const next = Math.round(payload.previewViewportHeight);
    if (next !== editorViewportHeight) {
      debugLog("previewViewportHeight received from WP:", next);
      editorViewportHeight = next;
      applyPreviewViewportTokens(next);
      editorViewportListeners.forEach((listener) => listener(next));
    }
  }
}

export const watchForDocumentHeightChanges = (
  options?: PreviewMessageContext & {
    onHeightChange?: (newHeight: number) => unknown;
  },
): ResizeObserver => {
  const { onHeightChange } = options ?? {};

  /** Ignore |Δcontent| at or below this when classifying viewport coupling. */
  const NOISE_PX = 4;
  /** Skip re-sending heights within this of the last sent value. */
  const REPORT_TOLERANCE_PX = 2;
  /** Viewport changes smaller than this can't reliably estimate coupling. */
  const PROBE_MIN_PX = 24;
  /** Coupling ratio at/above which content is treated as fully tied (~100vh). */
  const PIN_RATIO = 0.85;
  /** Reject coupling ratios above this (pathological feedback only). */
  const MAX_COUPLING_RATIO = 3;
  /**
   * When content height is below the editor reference by at least this much,
   * treat it as a min-height / viewport hero measured in a too-small iframe
   * and bootstrap to the editor reference before reporting natural height.
   */
  const BOOTSTRAP_GAP_PX = 48;
  /** Sanity cap for computed heights. */
  const MAX_TARGET_PX = 10000;
  /** Debounce for content-driven reports (typing bursts, streams of edits). */
  const DEBOUNCE_MS = 200;
  /**
   * Rate-limit valve for viewport-driven corrections: if the model somehow
   * never settles (non-linear content), stop chasing it. This is the generic
   * recursive-loop cut-off — it catches ANY residual feedback loop no matter
   * the step size.
   */
  const VALVE_MAX_REPORTS = 4;
  const VALVE_WINDOW_MS = 3000;

  let lastContentHeight = getDocumentHeight();
  let lastViewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 0;
  let lastViewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 0;

  // Local linear model content(V) = r * V + b, measured from viewport probes.
  let couplingR = 0;
  let couplingB = 0;
  let couplingKnown = false;

  const valveTimestamps: number[] = [];
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let debouncedHeight: number | null = null;

  /**
   * Hold the first content-driven report until the editor sends its canvas
   * viewport reference. Without this, an early natural-height measure (~600px
   * for min-h heroes in a small iframe) wins and traps the preview.
   */
  let bootstrapPending = true;
  deferHeightUntilEditorViewport = true;
  /**
   * After a bootstrap height report, ignore coupling inference on the next
   * viewport resize — min-h heroes look partially tied when growing from a
   * capped natural height and the model would step the iframe down wrongly.
   */
  let suppressCouplingProbe = false;
  let bootstrapTimer: ReturnType<typeof setTimeout> | null = null;

  const cancelDebounced = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    debouncedHeight = null;
  };

  const clearBootstrapTimer = () => {
    if (bootstrapTimer) {
      clearTimeout(bootstrapTimer);
      bootstrapTimer = null;
    }
  };

  const finishBootstrap = () => {
    bootstrapPending = false;
    deferHeightUntilEditorViewport = false;
    clearBootstrapTimer();
  };

  /**
   * min-h viewport heroes (and similar) measure at natural content height when
   * the iframe is too small. Bootstrap to the editor's one-screen reference so
   * min-height can bind, then re-measure on the next viewport resize.
   */
  const tryViewportBootstrap = (): boolean => {
    if (!bootstrapPending || editorViewportHeight <= 0) return false;
    // Empty `#root` is not a "short block" — wait for the Server Action.
    if (!previewHasBlockContent()) return false;

    const contentHeight = getDocumentHeight();
    const viewportHeight = window.innerHeight;

    if (contentHeight >= editorViewportHeight - BOOTSTRAP_GAP_PX) {
      finishBootstrap();
      if (Math.abs(contentHeight - viewportHeight) > REPORT_TOLERANCE_PX) {
        // Large overflow (abspos hero copy, etc.) should resize immediately;
        // small drift can wait for the content debounce.
        if (contentHeight - viewportHeight > BOOTSTRAP_GAP_PX) {
          report(contentHeight, "bootstrap-aligned");
        } else {
          reportDebounced(contentHeight, "bootstrap-aligned");
        }
      }
      return false;
    }

    // Genuinely short blocks should shrink normally — not bootstrap to one screen.
    const iframeAlreadyTall =
      viewportHeight >= editorViewportHeight - BOOTSTRAP_GAP_PX;
    if (iframeAlreadyTall && contentHeight < 500) {
      finishBootstrap();
      reportDebounced(contentHeight, "content");
      return false;
    }

    finishBootstrap();
    suppressCouplingProbe = true;
    report(editorViewportHeight, "viewport-bootstrap");
    return true;
  };

  const report = (height: number, via: string) => {
    const h = Math.round(height);
    if (!Number.isFinite(h) || h < 20 || h > MAX_TARGET_PX) return;
    if (
      lastSentHeight != null &&
      Math.abs(h - lastSentHeight) <= REPORT_TOLERANCE_PX
    ) {
      return;
    }
    debugLog("Reporting height to WP:", h, "via", via);
    onHeightChange?.(h);
    sendBlockHeightToWP(h, options);
  };

  const reportDebounced = (height: number, via: string) => {
    debouncedHeight = height;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      if (debouncedHeight != null) report(debouncedHeight, via);
      debouncedHeight = null;
    }, DEBOUNCE_MS);
  };

  const valveOpen = () => {
    const now = Date.now();
    while (valveTimestamps.length && now - valveTimestamps[0] > VALVE_WINDOW_MS) {
      valveTimestamps.shift();
    }
    return valveTimestamps.length < VALVE_MAX_REPORTS;
  };

  /** Target height implied by the current coupling model. */
  const computeTarget = (): number | null => {
    if (!couplingKnown) return null;

    if (couplingR >= PIN_RATIO) {
      // Fully tied: no self-consistent height exists. Pin to what the content
      // would measure at one editor screen; freeze in place if the editor
      // hasn't told us its viewport yet (it re-sends with every update).
      if (editorViewportHeight > 0) {
        return Math.round(couplingR * editorViewportHeight + couplingB);
      }
      return lastSentHeight ?? Math.round(lastContentHeight);
    }

    // Partially tied: the loop converges to a fixed point where content
    // exactly fits its own iframe — jump straight there.
    const fixedPoint = couplingB / (1 - couplingR);
    if (!Number.isFinite(fixedPoint) || fixedPoint <= 0 || fixedPoint > MAX_TARGET_PX) {
      return lastSentHeight ?? Math.round(lastContentHeight);
    }
    return Math.round(fixedPoint);
  };

  /**
   * Report the model's target. Viewport-driven corrections go out immediately
   * (but valve-limited); content-driven ones share the normal debounce.
   */
  const applyModel = (immediate: boolean) => {
    const target = computeTarget();
    if (target == null) return;

    pinnedHeight = couplingR >= PIN_RATIO ? target : null;

    if (immediate) {
      if (!valveOpen()) {
        // Loop cut-off: model isn't settling. Freeze at the last sent height
        // until content changes independently or the canvas width changes.
        debugLog("Height correction suppressed by loop valve; freezing.");
        pinnedHeight = lastSentHeight ?? pinnedHeight;
        couplingKnown = false;
        cancelDebounced();
        return;
      }
      valveTimestamps.push(Date.now());
      cancelDebounced();
      report(target, "model");
    } else {
      reportDebounced(target, "model-debounced");
    }
  };

  /**
   * Single evaluation point for both ResizeObserver and window resize events.
   * Reads current measurements, classifies the change by what moved (width,
   * viewport height, or content alone), and reacts. Idempotent: a second call
   * in the same frame sees zero deltas and no-ops.
   */
  const evaluate = () => {
    const contentHeight = getDocumentHeight();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    if (!previewHasBlockContent()) {
      lastContentHeight = contentHeight;
      lastViewportHeight = viewportHeight;
      lastViewportWidth = viewportWidth;
      return;
    }

    const dC = contentHeight - lastContentHeight;
    const dV = viewportHeight - lastViewportHeight;
    const dW = viewportWidth - lastViewportWidth;

    lastContentHeight = contentHeight;
    lastViewportHeight = viewportHeight;
    lastViewportWidth = viewportWidth;

    if (dW !== 0) {
      // Width changed (editor canvas resize / responsive preview mode):
      // genuine reflow. The old model is meaningless — start over.
      couplingKnown = false;
      pinnedHeight = null;
      valveTimestamps.length = 0;
      reportDebounced(contentHeight, "width-reflow");
      return;
    }

    if (dV !== 0) {
      if (suppressCouplingProbe) {
        suppressCouplingProbe = false;
        couplingKnown = false;
        pinnedHeight = null;
        valveTimestamps.length = 0;
        reportDebounced(contentHeight, "bootstrap-resync");
        return;
      }

      // Viewport height changed at fixed width — WP applied a height (or the
      // user resized the editor). Ordinary content cannot rewrap here, so any
      // meaningful content delta is viewport-driven.
      if (Math.abs(dV) < PROBE_MIN_PX) {
        // Too small to estimate a ratio reliably; refresh the model's offset
        // if we have one (keeps pinned targets tracking small drifts).
        if (couplingKnown) {
          couplingB = contentHeight - couplingR * viewportHeight;
          applyModel(false);
        }
        return;
      }

      if (Math.abs(dC) <= NOISE_PX) {
        // A real viewport probe with no content response: content is NOT
        // viewport-tied (anymore). Drop any stale model/pin. This also kills
        // legacy ±1px echo loops dead.
        if (couplingKnown || pinnedHeight != null) {
          couplingKnown = false;
          pinnedHeight = null;
          // Iframe may now mismatch content (e.g. tied block replaced by a
          // short one) — re-sync.
          reportDebounced(contentHeight, "unpin-resync");
        }
        return;
      }

      const r = dC / dV;
      if (r <= 0 || r > MAX_COUPLING_RATIO) {
        // Inverse or pathological superlinear response — not a coupling we can chase.
        return;
      }

      couplingR = r;
      couplingB = contentHeight - r * viewportHeight;
      couplingKnown = true;
      applyModel(true);
      return;
    }

    // Pure content change at a stable viewport: a real edit or async content
    // (images/fonts loading, etc.).
    if (dC !== 0) {
      if (bootstrapPending) {
        if (editorViewportHeight <= 0) {
          // Wait for the editor reference — reporting natural height now
          // traps min-h heroes in a too-small iframe.
          return;
        }
        if (tryViewportBootstrap()) return;
      }

      if (couplingKnown) {
        // Keep the measured ratio; shift the offset and re-derive the target
        // (e.g. content below a 100vh hero grew).
        couplingB = contentHeight - couplingR * viewportHeight;
        const target = computeTarget();
        // Mode switches (100vh → 150vh stretch, etc.) jump beyond the old
        // model — report measured content instead of pinning to one screen.
        if (
          target != null &&
          Math.abs(contentHeight - target) > BOOTSTRAP_GAP_PX
        ) {
          couplingKnown = false;
          pinnedHeight = null;
          reportDebounced(contentHeight, "content-model-mismatch");
          return;
        }
        applyModel(false);
      } else {
        if (pinnedHeight != null) pinnedHeight = null;
        reportDebounced(contentHeight, "content");
      }
    }
  };

  const onEditorViewport = () => {
    if (tryViewportBootstrap()) return;

    // Reference for "one screen" arrived/changed; re-derive pinned targets.
    if (couplingKnown && couplingR >= PIN_RATIO) {
      applyModel(true);
    }
  };

  let observer: ResizeObserver;
  if (typeof document !== "undefined") {
    observer = new ResizeObserver(evaluate);

    const observeLayoutTargets = () => {
      const root = document.getElementById("root");
      const hero = document.getElementById("hero");
      const target = root || document.body || document.documentElement;
      observer.observe(target);
      if (hero) observer.observe(hero);
      if (root?.firstElementChild) observer.observe(root.firstElementChild);
    };

    observeLayoutTargets();

    // Abspos / specified-height overflow does not resize `#root`, so fonts,
    // images, and Server Action commits would never re-report without this.
    let mutationRaf = 0;
    const mutationObserver = new MutationObserver(() => {
      if (mutationRaf) return;
      mutationRaf = requestAnimationFrame(() => {
        mutationRaf = 0;
        observeLayoutTargets();
        evaluate();
      });
    });
    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    let disconnected = false;
    let asyncLayoutRaf = 0;
    const onAsyncLayout = () => {
      if (disconnected || asyncLayoutRaf) return;
      asyncLayoutRaf = requestAnimationFrame(() => {
        asyncLayoutRaf = 0;
        if (!disconnected) evaluate();
      });
    };
    document.addEventListener("load", onAsyncLayout, true);
    void document.fonts?.ready.then(onAsyncLayout);

    // ResizeObserver only fires when the observed box changes; a viewport
    // resize with untied content doesn't change it, which would let our
    // viewport baseline go stale and mis-classify a later edit as coupled.
    window.addEventListener("resize", evaluate);
    editorViewportListeners.add(onEditorViewport);

    bootstrapTimer = setTimeout(() => {
      bootstrapTimer = null;
      if (!bootstrapPending) return;
      // Don't collapse to empty-shell min height while the Server Action
      // is still painting — ResizeObserver will bootstrap when content lands.
      if (!previewHasBlockContent()) return;
      finishBootstrap();
      evaluate();
    }, 2500);

    // Preserve the public API (callers hold a ResizeObserver and call
    // disconnect()) while still cleaning up our extra listeners.
    const originalDisconnect = observer.disconnect.bind(observer);
    observer.disconnect = () => {
      disconnected = true;
      window.removeEventListener("resize", evaluate);
      document.removeEventListener("load", onAsyncLayout, true);
      mutationObserver.disconnect();
      if (mutationRaf) cancelAnimationFrame(mutationRaf);
      if (asyncLayoutRaf) cancelAnimationFrame(asyncLayoutRaf);
      editorViewportListeners.delete(onEditorViewport);
      clearBootstrapTimer();
      cancelDebounced();
      originalDisconnect();
    };
  }

  return observer;
};
