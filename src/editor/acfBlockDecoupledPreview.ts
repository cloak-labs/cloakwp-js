import { ContentSourceRegistry } from "cloakcms";

// Sends the block preview page's height to WP via iFrame message posting
export const sendBlockHeightToWP = (h: number | null = null) => {
  let height = h;
  if (!h) height = getDocumentHeight();
  console.log("Sending height to WP Block Editor: ", height);
  window.parent?.postMessage(height, "*");
};

// gets the height of the current page/document
export const getDocumentHeight = () => {
  const minHeight = 20;
  if (typeof document !== "undefined") {
    const { scrollHeight = minHeight, offsetHeight = minHeight } =
      document.documentElement || {};
    return Math.max(scrollHeight, offsetHeight);
  }
  return minHeight;
};

// When parent (i.e. WP Block Editor) sends message, this function handles it:
export const handleWPBlockIframeMessage = (event, { onBlockDataReceipt }) => {
  const wpUrl = ContentSourceRegistry.get().getActiveUrl();
  if (wpUrl.startsWith(event.origin)) {
    // Check if the message is requesting the content height
    if (event.data === "getHeight") {
      sendBlockHeightToWP();
    } else {
      const data = JSON.parse(event.data);
      if (data.name && data.type && data.data) {
        console.log("blockData received from WP: ", data);
        onBlockDataReceipt?.(data);
      } else if (data.bodyClassName) {
        // the following allows WP to set classes on the <body> of the iframe preview; mostly used for setting color themes eg. dark mode
        console.log("bodyClassName received from WP: ", data);
        const { bodyClassName } = data;
        if (Array.isArray(bodyClassName))
          document.body.classList.add(...bodyClassName);
        else if (bodyClassName.includes(" "))
          document.body.classList.add(...bodyClassName.split(" "));
        else document.body.classList.add(bodyClassName);
      }
    }
  }
  // }
};

// Use the ResizeObserver API to watch for document height resizes, and send new height values to WP
// export const watchForDocumentHeightChanges = (options?: {
//   onHeightChange: (newHeight: number) => any | void;
// }): ResizeObserver => {
//   const { onHeightChange } = options ?? {};
//   let cachedHeight = getDocumentHeight();

//   let observer: ResizeObserver;
//   if (typeof document !== "undefined") {
//     observer = new ResizeObserver((entries) => {
//       // detected a height change for document.documentElement...
//       const newHeight = parseInt(
//         entries?.[0]?.contentBoxSize?.[0].blockSize?.toFixed(0)
//       );

//       // Ignore updates if height matches viewport height (likely using `h-screen`, which can cause infinite loops)
//       if (cachedHeight !== newHeight) {
//         console.log("ResizeObserver detected new document height: ", newHeight);
//         cachedHeight = newHeight;
//         onHeightChange?.(newHeight);
//         sendBlockHeightToWP(newHeight);
//       }
//     });

//     observer.observe(document.documentElement);
//   }

//   return observer;
// };

export const watchForDocumentHeightChanges = (options?: {
  onHeightChange: (newHeight: number) => any | void;
}): ResizeObserver => {
  const { onHeightChange } = options ?? {};
  let cachedHeight = getDocumentHeight();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounceTime = 200; // 200ms debounce time, ensures that the height is not sent too often

  const sendHeightDebounced = (newHeight: number) => {
    console.log("in sendHeightDebounced");
    if (timeoutId) {
      console.log("clearing timeout id: ", timeoutId);
      clearTimeout(timeoutId);
    }

    // Schedule a new height update
    timeoutId = setTimeout(() => {
      if (cachedHeight !== newHeight) {
        console.log("Sending new height to WP:", newHeight);
        cachedHeight = newHeight;
        onHeightChange?.(newHeight);
        sendBlockHeightToWP(newHeight);
      } else {
        console.log("Height hasn't changed, not sending to WP");
      }
      timeoutId = null; // Reset timeoutId
    }, debounceTime);
  };

  let observer: ResizeObserver;
  if (typeof document !== "undefined") {
    observer = new ResizeObserver((entries) => {
      const newHeight = parseInt(
        entries?.[0]?.contentBoxSize?.[0].blockSize?.toFixed(0)
      );

      // Skip if height matches viewport height (`h-screen`) to avoid feedback loops
      if (newHeight !== cachedHeight) {
        sendHeightDebounced(newHeight);
      }
    });

    observer.observe(document.documentElement);
  }

  return observer;
};
