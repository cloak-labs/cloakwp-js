"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchForDocumentHeightChanges = exports.handleWPBlockIframeMessage = exports.getDocumentHeight = exports.sendBlockHeightToWP = void 0;
const cloakcms_1 = require("cloakcms");
// Sends the block preview page's height to WP via iFrame message posting
const sendBlockHeightToWP = (h = null) => {
    let height = h;
    if (!h)
        height = (0, exports.getDocumentHeight)();
    console.log("Sending height to WP Block Editor: ", height);
    window.parent?.postMessage(height, "*");
};
exports.sendBlockHeightToWP = sendBlockHeightToWP;
// gets the height of the current page/document
const getDocumentHeight = () => {
    const minHeight = 20;
    if (typeof document !== "undefined") {
        const { scrollHeight = minHeight, offsetHeight = minHeight } = document.documentElement || {};
        return Math.max(scrollHeight, offsetHeight);
    }
    return minHeight;
};
exports.getDocumentHeight = getDocumentHeight;
// When parent (i.e. WP Block Editor) sends message, handleWPBlockIframeMessage() handles it:
const handleWPBlockIframeMessage = (event, { onBlockDataReceipt }) => {
    const wpUrl = (0, cloakcms_1.getCMSInstance)().url;
    if (wpUrl.startsWith(event.origin)) {
        // console.log("received message event IN iframe: ", event);
        // Check if the message is requesting the content height
        if (event.data === "getHeight") {
            (0, exports.sendBlockHeightToWP)();
        }
        else {
            const blockData = JSON.parse(event.data);
            console.log("blockData received from WP: ", blockData);
            onBlockDataReceipt?.(blockData);
        }
    }
    // }
};
exports.handleWPBlockIframeMessage = handleWPBlockIframeMessage;
// Use the ResizeObserver API to watch for document height resizes, and send new height values to WP
const watchForDocumentHeightChanges = (options) => {
    const { onHeightChange } = options ?? {};
    let cachedHeight = (0, exports.getDocumentHeight)();
    let observer;
    if (typeof document !== "undefined") {
        observer = new ResizeObserver((entries) => {
            // detected a height change for document.documentElement...
            const newHeight = parseInt(entries?.[0]?.contentBoxSize?.[0].blockSize?.toFixed(0));
            if (cachedHeight != newHeight) {
                console.log("ResizeObserver detected new document height: ", newHeight);
                cachedHeight = newHeight;
                onHeightChange?.(newHeight);
                (0, exports.sendBlockHeightToWP)(newHeight);
            }
        });
        observer.observe(document.documentElement);
    }
    return observer;
};
exports.watchForDocumentHeightChanges = watchForDocumentHeightChanges;
