import Blocks from "./Blocks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function BlockPreviewPage({ blockData }) {
  const [previewHeight, setPreviewHeight] = useState(getHeight);
  const router = useRouter();

  const sendHeightToParent = (h = null) => {
    let height = h;
    if (!h) height = getHeight();
    console.log("Sending height to Gutenberg: ", height);
    window.parent?.postMessage(height, "*");
  };

  function getHeight() {
    const minHeight = 20;
    if (typeof document !== "undefined") {
      const { scrollHeight = minHeight, offsetHeight = minHeight } =
        document.documentElement || {};
      return Math.max(scrollHeight, offsetHeight);
    }
    return minHeight;
  }

  // when parent (i.e. Gutenberg Editor) sends message, handleIframeMessage() handles it:
  const handleIframeMessage = function (event) {
    console.log("received message event in iframe: ", event);
    // Check if the message is requesting the content height
    if (event.data === "getHeight") sendHeightToParent();
  };

  function handleRouteChangeStart() {
    throw new Error("Abort route change while previewing block");
  }

  useEffect(() => {
    // prevent running the following client code on server:
    if (typeof window !== "undefined") {
      // don't wait for parent to ask for iframe height, or for ResizeObserver to kick in, just send the height immediately on initial render
      sendHeightToParent();

      // watch for document height resizes, and send new height to Gutenberg
      let observer;
      if (typeof document !== "undefined") {
        observer = new ResizeObserver((entries) => {
          // detected height change for document.documentElement
          const newHeight = parseInt(
            entries?.[0]?.contentBoxSize?.[0].blockSize?.toFixed(0)
          );
          if (previewHeight != newHeight) {
            console.log("ResizeObserver detected new document height");
            setPreviewHeight(newHeight);
            sendHeightToParent(newHeight);
          }
        });
        observer.observe(document.documentElement);
      }

      // Add a message event listener to receive messages from the parent website (i.e. WordPress Gutenberg Editor)
      window.addEventListener("message", handleIframeMessage);

      // Disable page transitions so that clicking links in iframe preview doesn't navigate editor away from preview route
      router.events.on("routeChangeStart", handleRouteChangeStart);

      // Cleanup function to remove event listeners
      return () => {
        window.removeEventListener("message", handleIframeMessage);
        router.events.off("routeChangeStart", handleRouteChangeStart);
        observer?.disconnect();
      };
    }
  }, []);

  return (
    <>
      <Head>
        <title>{`Preview Block: ${blockData.name}`}</title>
      </Head>
      <div id="previewBlock">
        <Blocks data={[blockData]} blocks={{}} container={{}} />
      </div>
    </>
  );
}

export function getServerSideProps(ctx) {
  const {
    query: { blockData = null, secret = null },
  } = ctx;

  if (!blockData || secret != process.env.CLOAKWP_AUTH_SECRET) {
    // if someone visits this route without passing blockData or the correct secret, we redirect them to the homepage
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let data = JSON.parse(blockData);

  return {
    props: {
      blockData: data,
      enableLayout: false,
    },
  };
}
