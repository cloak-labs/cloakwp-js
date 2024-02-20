import { getCMSInstance } from "cloakcms";
// Sends the block preview page's height to WP via iFrame message posting
export const sendBlockHeightToWP = (h = null) => {
    let height = h;
    if (!h)
        height = getDocumentHeight();
    console.log("Sending height to WP Block Editor: ", height);
    window.parent?.postMessage(height, "*");
};
// gets the height of the current page/document
export const getDocumentHeight = () => {
    const minHeight = 20;
    if (typeof document !== "undefined") {
        const { scrollHeight = minHeight, offsetHeight = minHeight } = document.documentElement || {};
        return Math.max(scrollHeight, offsetHeight);
    }
    return minHeight;
};
// When parent (i.e. WP Block Editor) sends message, handleWPBlockIframeMessage() handles it:
export const handleWPBlockIframeMessage = (event, { onBlockDataReceipt }) => {
    const wpUrl = getCMSInstance().url;
    if (wpUrl.startsWith(event.origin)) {
        // Check if the message is requesting the content height
        if (event.data === "getHeight") {
            sendBlockHeightToWP();
        }
        else {
            const data = JSON.parse(event.data);
            if (data.name && data.type && data.data) {
                console.log("blockData received from WP: ", data);
                onBlockDataReceipt?.(data);
            }
            else if (data.bodyClassName) {
                // the following allows WP to set classes on the <body> of the iframe preview; mostly used for setting color themes eg. dark mode
                console.log("bodyClassName received from WP: ", data);
                const { bodyClassName } = data;
                if (Array.isArray(bodyClassName))
                    document.body.classList.add(...bodyClassName);
                else if (bodyClassName.includes(" "))
                    document.body.classList.add(...bodyClassName.split(" "));
                else
                    document.body.classList.add(bodyClassName);
            }
        }
    }
    // }
};
// Use the ResizeObserver API to watch for document height resizes, and send new height values to WP
export const watchForDocumentHeightChanges = (options) => {
    const { onHeightChange } = options ?? {};
    let cachedHeight = getDocumentHeight();
    let observer;
    if (typeof document !== "undefined") {
        observer = new ResizeObserver((entries) => {
            // detected a height change for document.documentElement...
            const newHeight = parseInt(entries?.[0]?.contentBoxSize?.[0].blockSize?.toFixed(0));
            if (cachedHeight != newHeight) {
                console.log("ResizeObserver detected new document height: ", newHeight);
                cachedHeight = newHeight;
                onHeightChange?.(newHeight);
                sendBlockHeightToWP(newHeight);
            }
        });
        observer.observe(document.documentElement);
    }
    return observer;
};
