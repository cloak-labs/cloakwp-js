export declare const sendBlockHeightToWP: (h?: number | null) => void;
export declare const getDocumentHeight: () => number;
export declare const handleWPBlockIframeMessage: (event: any, { onBlockDataReceipt }: {
    onBlockDataReceipt: any;
}) => void;
export declare const watchForDocumentHeightChanges: (options?: {
    onHeightChange: (newHeight: number) => any | void;
}) => ResizeObserver;
