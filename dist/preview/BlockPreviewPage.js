"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var Blocks_1 = require("../Blocks");
var head_1 = require("next/head");
var router_1 = require("next/router");
var react_1 = require("react");
function BlockPreviewPage(_a) {
    var blockData = _a.blockData;
    var _b = (0, react_1.useState)(getHeight), previewHeight = _b[0], setPreviewHeight = _b[1];
    var router = (0, router_1.useRouter)();
    var sendHeightToParent = function (h) {
        var _a;
        if (h === void 0) { h = null; }
        var height = h;
        if (!h)
            height = getHeight();
        console.log("Sending height to Gutenberg: ", height);
        (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage(height, "*");
    };
    function getHeight() {
        var minHeight = 20;
        if (typeof document !== "undefined") {
            var _a = document.documentElement || {}, _b = _a.scrollHeight, scrollHeight = _b === void 0 ? minHeight : _b, _c = _a.offsetHeight, offsetHeight = _c === void 0 ? minHeight : _c;
            return Math.max(scrollHeight, offsetHeight);
        }
        return minHeight;
    }
    // when parent (i.e. Gutenberg Editor) sends message, handleIframeMessage() handles it:
    var handleIframeMessage = function (event) {
        console.log("received message event in iframe: ", event);
        // Check if the message is requesting the content height
        if (event.data === "getHeight")
            sendHeightToParent();
    };
    function handleRouteChangeStart() {
        throw new Error("Abort route change while previewing block");
    }
    (0, react_1.useEffect)(function () {
        // prevent running the following client code on server:
        if (typeof window !== "undefined") {
            // don't wait for parent to ask for iframe height, or for ResizeObserver to kick in, just send the height immediately on initial render
            sendHeightToParent();
            // watch for document height resizes, and send new height to Gutenberg
            var observer_1;
            if (typeof document !== "undefined") {
                observer_1 = new ResizeObserver(function (entries) {
                    var _a, _b, _c;
                    // detected height change for document.documentElement
                    var newHeight = parseInt((_c = (_b = (_a = entries === null || entries === void 0 ? void 0 : entries[0]) === null || _a === void 0 ? void 0 : _a.contentBoxSize) === null || _b === void 0 ? void 0 : _b[0].blockSize) === null || _c === void 0 ? void 0 : _c.toFixed(0));
                    if (previewHeight != newHeight) {
                        console.log("ResizeObserver detected new document height");
                        setPreviewHeight(newHeight);
                        sendHeightToParent(newHeight);
                    }
                });
                observer_1.observe(document.documentElement);
            }
            // Add a message event listener to receive messages from the parent website (i.e. WordPress Gutenberg Editor)
            window.addEventListener("message", handleIframeMessage);
            // Disable page transitions so that clicking links in iframe preview doesn't navigate editor away from preview route
            router.events.on("routeChangeStart", handleRouteChangeStart);
            // Cleanup function to remove event listeners
            return function () {
                window.removeEventListener("message", handleIframeMessage);
                router.events.off("routeChangeStart", handleRouteChangeStart);
                observer_1 === null || observer_1 === void 0 ? void 0 : observer_1.disconnect();
            };
        }
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(head_1.default, { children: (0, jsx_runtime_1.jsx)("title", { children: "Preview Block: ".concat(blockData.name) }) }), (0, jsx_runtime_1.jsx)("div", __assign({ id: "previewBlock" }, { children: (0, jsx_runtime_1.jsx)(Blocks_1.default, { data: [blockData] }) }))] }));
}
exports.default = BlockPreviewPage;
function getServerSideProps(ctx) {
    var _a = ctx.query, _b = _a.blockData, blockData = _b === void 0 ? null : _b, _c = _a.secret, secret = _c === void 0 ? null : _c;
    if (!blockData || secret != process.env.CLOAKWP_AUTH_SECRET) {
        // if someone visits this route without passing blockData or the correct secret, we redirect them to the homepage
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    var data = JSON.parse(blockData);
    return {
        props: {
            blockData: data,
            enableLayout: false,
        },
    };
}
exports.getServerSideProps = getServerSideProps;
