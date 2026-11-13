import {
  createBlockStyleEngine,
  type Breakpoint,
  type StyleDiagnostic,
  type StyleInput,
  type StyleModule,
  type StyleProperty,
  type StyleOutput,
  type StyleState,
  type StyleScalar,
  type StyleValue,
} from "@cloakui/block-styles";

export type WordPressStyleOutput = StyleOutput<"unsupported-attribute" | "unresolved-preset">;

export type WordPressStyleOptions = {
  /** Prefix for emitted classes and variables. */
  prefix?: string;
  /** WordPress viewport names and media conditions. Pass the site's configured widths. */
  breakpoints?: readonly Breakpoint<string>[];
  /** Map a WordPress preset into the frontend's own token system. */
  resolvePreset?: (
    category: string,
    slug: string,
    context?: { property: string; breakpoint?: string; state?: StyleState },
  ) => string;
  /** Diagnose unresolved WordPress variables, or explicitly allow them when supplied by the site. */
  unresolvedPreset?: "diagnose" | "allow";
  /** Map an editor media URL to the frontend's deployed media origin. */
  resolveMediaUrl?: (url: string) => string;
  /** Resolve a background image into a CSS image value. */
  resolveBackgroundImage?: (url: string, block: unknown) => string;
  defaults?: StyleInput<string>;
  /** Register or override CMS-independent property capabilities. */
  properties?: Record<string, StyleProperty>;
  modules?: readonly StyleModule<string>[];
  resolve?: (style: StyleInput<string>, block: unknown) => StyleInput<string>;
  canCombine?: (properties: readonly string[], block: unknown) => boolean;
  cssDefaults?:
    | Record<string, StyleScalar>
    | ((block: unknown) => Record<string, StyleScalar>);
  specificity?: "low" | "class" | "strong";
};

/** Mirrors WordPress's 7.1 viewport validation and non-overlapping ranges. */
export function wordpressBreakpointsForViewport(settings?: {
  mobile?: string;
  tablet?: string;
}): readonly Breakpoint<string>[] {
  const valid = (value: unknown) =>
    typeof value === "string" &&
    /^(?:\d+|\d*\.\d+)(?:px|em|rem)$/.test(value.trim());
  let mobile = valid(settings?.mobile) ? settings!.mobile!.trim() : undefined;
  let tablet = valid(settings?.tablet) ? settings!.tablet!.trim() : undefined;
  if (!mobile && !tablet) {
    mobile = "480px";
    tablet = "782px";
  }
  const px = (value: string) =>
    parseFloat(value) * (value.endsWith("px") ? 1 : 16);
  if (mobile && tablet && px(tablet) <= px(mobile)) tablet = undefined;
  const result: Breakpoint<string>[] = [];
  if (tablet)
    result.push({
      name: "tablet",
      query: mobile
        ? `(${mobile} < width <= ${tablet})`
        : `(width <= ${tablet})`,
    });
  if (mobile) result.push({ name: "mobile", query: `(width <= ${mobile})` });
  result.push({ name: "desktop", query: `(width > ${tablet ?? mobile})` });
  return result;
}

export const wordpressBreakpoints = wordpressBreakpointsForViewport();

const STATES: StyleState[] = ["hover", "focus", "focus-visible", "active"];

function token(
  value: unknown,
  resolvePreset: NonNullable<WordPressStyleOptions["resolvePreset"]>,
  context?: { property: string; breakpoint?: string; state?: StyleState },
): string | undefined {
  if (typeof value !== "string" && typeof value !== "number") return;
  const text = String(value);
  const preset = /^var:preset\|([\w-]+)\|([\w-]+)$/.exec(text);
  return preset ? resolvePreset(preset[1], preset[2], context) : text;
}

/** Convert saved WordPress attributes into the CMS-independent style model. */
export function normalizeWordPressBlockStyles(
  block: { name?: string; attrs?: Record<string, any>; context?: any },
  options: Pick<
    WordPressStyleOptions,
    | "breakpoints"
    | "resolvePreset"
    | "resolveMediaUrl"
    | "resolveBackgroundImage"
  > = {},
): StyleInput<string> {
  const attributes = block.attrs ?? {};
  const root = attributes.style ?? {};
  const breakpoints = options.breakpoints ?? wordpressBreakpoints;
  const resolvePreset =
    options.resolvePreset ??
    ((category, slug) => `var(--wp--preset--${category}--${slug})`);
  const result: StyleInput<string> = {};

  const add = (
    property: string,
    raw: unknown,
    breakpoint?: string,
    state?: StyleState,
  ) => {
    const value = token(raw, resolvePreset, { property, breakpoint, state });
    if (value === undefined || value === "") return;
    const previous = result[property];
    const current: StyleValue<string> =
      typeof previous === "object" && previous !== null ? previous : {};
    if (state) {
      const states = (current.states ??= {});
      const target = (states[state] ??= {});
      if (breakpoint) (target.breakpoints ??= {})[breakpoint] = value;
      else target.base = value;
    } else if (breakpoint) (current.breakpoints ??= {})[breakpoint] = value;
    else current.base = value;
    result[property] = current;
  };

  const read = (
    style: Record<string, any>,
    breakpoint?: string,
    state?: StyleState,
  ) => {
    const emit = (name: string, value: unknown) =>
      add(name, value, breakpoint, state);
    const typography = style.typography ?? {};
    const typographyFields: Record<string, string> = {
      textAlign: "text-align",
      fontSize: "font-size",
      fontFamily: "font-family",
      fontStyle: "font-style",
      fontWeight: "font-weight",
      lineHeight: "line-height",
      letterSpacing: "letter-spacing",
      textDecoration: "text-decoration",
      textTransform: "text-transform",
      textIndent: "text-indent",
      textColumns: "column-count",
      writingMode: "writing-mode",
      textShadow: "text-shadow",
    };
    for (const [source, target] of Object.entries(typographyFields))
      emit(target, typography[source]);
    const color = style.color ?? {};
    emit("color", color.text);
    emit("background-color", color.background);
    const link = style.elements?.link;
    emit("link-color", link?.color?.text);
    for (const state of STATES)
      emit(`link-${state}-color`, link?.[`:${state}`]?.color?.text);
    const background = style.background ?? {};
    for (const [source, target] of Object.entries({
      backgroundSize: "background-size",
      backgroundPosition: "background-position",
      backgroundRepeat: "background-repeat",
      backgroundAttachment: "background-attachment",
    }))
      emit(target, background[source]);
    const originalImage = background.backgroundImage?.url;
    const image =
      typeof originalImage === "string"
        ? (options.resolveMediaUrl?.(originalImage) ?? originalImage)
        : undefined;
    if (image) {
      if (!background.backgroundSize) emit("background-size", "cover");
      if (!background.backgroundPosition) emit("background-position", "center");
      if (!background.backgroundRepeat) emit("background-repeat", "no-repeat");
      if (!background.backgroundAttachment)
        emit("background-attachment", "scroll");
    }
    const gradient = token(
      background.gradient ?? color.gradient,
      resolvePreset,
    );
    if (image || gradient)
      emit(
        "background-image",
        [
          gradient,
          image
            ? (options.resolveBackgroundImage?.(image, block) ??
              `url("${image}")`)
            : null,
        ]
          .filter(Boolean)
          .join(", "),
      );
    const spacing = style.spacing ?? {};
    for (const kind of ["padding", "margin"]) {
      const value = spacing[kind];
      for (const side of ["top", "right", "bottom", "left"])
        emit(
          `${kind}-${side}`,
          typeof value === "object" && value !== null ? value[side] : value,
        );
    }
    const gap = spacing.blockGap;
    if (typeof gap === "object" && gap !== null) {
      if (gap.top != null && gap.top === gap.left) emit("gap", gap.top);
      else {
        emit("row-gap", gap.top);
        emit("column-gap", gap.left);
      }
    } else emit("gap", gap);
    const border = style.border ?? {};
    for (const name of ["color", "width", "style"]) {
      emit(`border-${name}`, border[name]);
      for (const side of ["top", "right", "bottom", "left"])
        emit(`border-${side}-${name}`, border[side]?.[name]);
    }
    if (border.radius && typeof border.radius === "object") {
      for (const [source, target] of Object.entries({
        topLeft: "top-left",
        topRight: "top-right",
        bottomRight: "bottom-right",
        bottomLeft: "bottom-left",
      }))
        emit(`border-${target}-radius`, border.radius[source]);
    } else emit("border-radius", border.radius);
    for (const [source, target] of Object.entries({
      width: "width",
      height: "height",
      minWidth: "min-width",
      minHeight: "min-height",
      maxWidth: "max-width",
      maxHeight: "max-height",
      aspectRatio: "aspect-ratio",
    }))
      emit(target, style.dimensions?.[source]);
    emit("box-shadow", style.shadow);
    if (style.layout?.orientation === "horizontal")
      emit("flex-direction", "row");
    if (style.layout?.orientation === "vertical")
      emit("flex-direction", "column");
    const columns = Number(style.layout?.columnCount);
    if (Number.isInteger(columns) && columns > 0 && columns <= 100)
      emit("grid-template-columns", `repeat(${columns}, minmax(0, 1fr))`);
    const span = Number(style.layout?.columnSpan);
    if (Number.isInteger(span) && span > 0 && span <= 100)
      emit("grid-column", `span ${span}`);
    const start = Number(style.layout?.columnStart);
    if (Number.isInteger(start) && start > 0 && start <= 100)
      emit("grid-column-start", start);
  };

  // Legacy attributes are still present in saved blocks. New block supports win.
  if (attributes.textAlign) add("text-align", attributes.textAlign);
  else if (["center", "right"].includes(attributes.align))
    add("text-align", attributes.align);
  if (attributes.fontSize)
    add("font-size", resolvePreset("font-size", attributes.fontSize));
  if (attributes.fontFamily)
    add("font-family", resolvePreset("font-family", attributes.fontFamily));
  if (attributes.textColor)
    add("color", resolvePreset("color", attributes.textColor));
  if (attributes.backgroundColor)
    add(
      "background-color",
      attributes.backgroundColor === "transparent"
        ? "transparent"
        : resolvePreset("color", attributes.backgroundColor),
    );
  if (attributes.borderColor)
    add("border-color", resolvePreset("color", attributes.borderColor));
  if (attributes.gradient)
    add("background-image", resolvePreset("gradient", attributes.gradient));
  if (block.name === "core/spacer" || block.name === "core/image") {
    for (const dimension of ["width", "height"]) {
      const value = attributes[dimension];
      if (value !== undefined)
        add(
          dimension,
          typeof value === "number" || /^\d+(?:\.\d+)?$/.test(String(value))
            ? `${value}px`
            : value,
        );
    }
  }
  if (attributes.layout?.type === "grid") {
    add("display", "grid");
    const count = Number(attributes.layout.columnCount);
    if (Number.isInteger(count) && count > 0 && count <= 100)
      add("grid-template-columns", `repeat(${count}, minmax(0, 1fr))`);
  }
  read(root);
  for (const state of STATES)
    if (root[`:${state}`]) read(root[`:${state}`], undefined, state);
  for (const { name } of breakpoints) {
    const responsive = root[`@${name}`];
    if (!responsive) continue;
    read(responsive, name);
    for (const state of STATES)
      if (responsive[`:${state}`]) read(responsive[`:${state}`], name, state);
  }
  const visibility = attributes.metadata?.blockVisibility?.viewport;
  if (visibility && typeof visibility === "object") {
    for (const { name } of breakpoints)
      if (visibility[name] === false) add("display", "none", name);
  }
  return result;
}

export function createWordPressBlockStyleEngine(
  options: WordPressStyleOptions = {},
) {
  const engine = createBlockStyleEngine<string>({
    prefix: options.prefix,
    breakpoints: options.breakpoints ?? wordpressBreakpoints,
    defaults: options.defaults,
    properties: options.properties,
    modules: options.modules,
    resolve: options.resolve,
    canCombine: options.canCombine,
    cssDefaults: options.cssDefaults,
    specificity: options.specificity,
  });
  return {
    catalog: engine.catalog,
    normalize: (block: Parameters<typeof normalizeWordPressBlockStyles>[0]) =>
      normalizeWordPressBlockStyles(block, options),
    render(
      block: Parameters<typeof normalizeWordPressBlockStyles>[0],
    ): WordPressStyleOutput {
      const unresolved = new Map<string, { property: string; value: string }>();
      const resolvePreset: NonNullable<WordPressStyleOptions["resolvePreset"]> =
        (category, slug, context) => {
          const fallback = `var(--wp--preset--${category}--${slug})`;
          const value = options.resolvePreset?.(category, slug, context) ?? fallback;
          if (value === fallback)
            unresolved.set(`${context?.property ?? category}:${fallback}`, {
              property: context?.property ?? category,
              value: `${category}|${slug}`,
            });
          return value;
        };
      const output: WordPressStyleOutput = engine.render(
        normalizeWordPressBlockStyles(block, { ...options, resolvePreset }),
        block,
      );
      if (options.unresolvedPreset !== "allow")
        for (const [key, diagnostic] of unresolved) {
          const fallback = key.slice(key.indexOf(":") + 1);
          if (Object.values(output.variables).some((value) => value.includes(fallback)))
            output.diagnostics.push({ ...diagnostic, reason: "unresolved-preset" });
        }
      output.diagnostics.push(
        ...findUnsupportedWordPressStyles(
          block,
          options.breakpoints ?? wordpressBreakpoints,
        ),
      );
      return output;
    },
  };
}

/** Report unsupported saved fields instead of silently pretending to render them. */
export function findUnsupportedWordPressStyles(
  block: { attrs?: Record<string, any> },
  breakpoints: readonly Breakpoint<string>[] = wordpressBreakpoints,
): StyleDiagnostic<"unsupported-attribute">[] {
  const diagnostics: StyleDiagnostic<"unsupported-attribute">[] = [];
  const allowed: Record<string, readonly string[]> = {
    "": [
      "typography",
      "color",
      "background",
      "spacing",
      "border",
      "dimensions",
      "layout",
      "elements",
      "shadow",
      "css",
    ],
    typography: [
      "textAlign",
      "fontSize",
      "fontFamily",
      "fontStyle",
      "fontWeight",
      "lineHeight",
      "letterSpacing",
      "textDecoration",
      "textTransform",
      "textIndent",
      "textColumns",
      "writingMode",
      "textShadow",
    ],
    color: ["text", "background", "gradient"],
    background: [
      "backgroundImage",
      "backgroundSize",
      "backgroundPosition",
      "backgroundRepeat",
      "backgroundAttachment",
      "gradient",
    ],
    spacing: ["padding", "margin", "blockGap"],
    border: [
      "radius",
      "color",
      "width",
      "style",
      "top",
      "right",
      "bottom",
      "left",
    ],
    dimensions: [
      "width",
      "height",
      "minWidth",
      "minHeight",
      "maxWidth",
      "maxHeight",
      "aspectRatio",
    ],
    // These layout fields are also interpreted by the existing functional data routers.
    layout: [
      "orientation",
      "columnCount",
      "columnSpan",
      "columnStart",
      "selfStretch",
      "flexSize",
    ],
    elements: ["link"],
    "elements.link": ["color"],
    "elements.link.color": ["text"],
  };
  const walk = (style: unknown, prefix: string, location = "") => {
    if (!style || typeof style !== "object" || Array.isArray(style)) return;
    for (const [key, value] of Object.entries(style)) {
      const path = location ? `${location}.${key}` : key;
      if (key.startsWith("@")) {
        if (!breakpoints.some((bp) => `@${bp.name}` === key))
          diagnostics.push({
            property: path,
            reason: "unsupported-attribute",
            value,
          });
        else walk(value, prefix, path);
      } else if (key.startsWith(":")) {
        if (!STATES.some((state) => `:${state}` === key))
          diagnostics.push({
            property: path,
            reason: "unsupported-attribute",
            value,
          });
        else walk(value, prefix, path);
      } else if (!(allowed[prefix] ?? []).includes(key)) {
        diagnostics.push({
          property: path,
          reason: "unsupported-attribute",
          value,
        });
      } else if (prefix === "" && key === "css" && value) {
        // Custom CSS cannot be applied safely as an ordinary block style.
        diagnostics.push({ property: path, reason: "unsupported-attribute", value });
      } else {
        const nested = prefix ? `${prefix}.${key}` : key;
        if (allowed[nested]) walk(value, nested, path);
      }
    }
  };
  walk(block.attrs?.style, "");
  return diagnostics;
}
