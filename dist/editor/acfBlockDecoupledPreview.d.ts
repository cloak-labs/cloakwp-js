export type PreviewMessageContext = {
    previewKey: string;
    targetOrigin?: string;
};
export type HandlePreviewMessageOptions<BlockData = unknown> = PreviewMessageContext & {
    onBlockDataReceipt?: (blockData: BlockData) => void;
};
/** Design-system viewport tokens overridden to px during block preview. */
export declare const PREVIEW_VIEWPORT_CSS_VARS: readonly ["--100vh", "--100svh", "--100dvh"];
/** Anchor `--100vh` / `--100svh` / `--100dvh` to one editor-screen height (px). */
export declare const applyPreviewViewportTokens: (heightPx: number) => void;
/**
 * True once the preview Server Action has committed block UI into `#root`.
 * Empty-shell measurements (minHeight 20, min-h-0 flex) must not be reported
 * — they collapse the iframe before viewport-tied heroes can bind.
 */
export declare const previewHasBlockContent: () => boolean;
export declare const sendBlockHeightToWP: (h?: number | null, context?: PreviewMessageContext) => void;
/**
 * Content height for the preview iframe — must NOT use documentElement's
 * offset/client height. Those track the iframe viewport, so when WP sizes the
 * iframe to H (or H+1) the next report becomes H+1 and each edit grows by 1px.
 */
export declare const getDocumentHeight: () => number;
export declare function getConfiguredWpOrigin(): string | null;
export declare function sendPreviewReadyToWp(previewKey: string, targetOrigin?: string): void;
export declare function handleWPBlockIframeMessage<BlockData = unknown>(event: MessageEvent, { previewKey, targetOrigin, onBlockDataReceipt, }: HandlePreviewMessageOptions<BlockData>): void;
export declare const watchForDocumentHeightChanges: (options?: PreviewMessageContext & {
    onHeightChange?: (newHeight: number) => unknown;
}) => ResizeObserver;
//# sourceMappingURL=acfBlockDecoupledPreview.d.ts.map