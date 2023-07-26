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
exports.getServerSideProps = exports.BlockPreviewPage = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var Blocks_1 = require("./Blocks");
var useGlobalConfig_1 = require("./hooks/useGlobalConfig");
var head_1 = require("next/head");
var router_1 = require("next/router");
var react_1 = require("react");
function BlockPreviewPage(_a) {
    var blockData = _a.blockData;
    console.log({ blockData: blockData });
    var router = (0, router_1.useRouter)();
    var sendHeightToParent = function () {
        setTimeout(function () {
            var _a;
            // Get the content height and send it to the parent website
            console.log('send height to parent, documentElement: ', document.documentElement);
            var docHeight = document.documentElement.scrollHeight;
            var contentHeight = document.querySelector('#previewBlock').clientHeight;
            (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage(contentHeight || docHeight, '*');
        }, 500);
    };
    // when parent sends message, handleIframeMessage() handles it
    var handleIframeMessage = function (event) {
        console.log('received message event in iframe: ', event);
        // Check if the message is requesting the content height
        if (event.data === 'getHeight') {
            console.log('message is requesting our iframe content height');
            sendHeightToParent();
        }
    };
    function handleRouteChangeStart(url) {
        throw new Error('Abort route change while previewing block');
    }
    (0, react_1.useEffect)(function () {
        if (typeof window !== 'undefined') { // prevents running the following client code on server
            console.log('initial render of block preview');
            // don't wait for parent to ask for iframe height, just send it (only on initial render)
            sendHeightToParent();
            // Add a message event listener to receive messages from the parent website (i.e. WordPress Gutenberg Editor)
            window.addEventListener('message', handleIframeMessage);
            // Disable page transitions so that clicking links in iframe preview doesn't navigate editor away from preview route
            router.events.on('routeChangeStart', handleRouteChangeStart);
            // Cleanup function to remove event listeners
            return function () {
                window.removeEventListener('message', handleIframeMessage);
                router.events.off('routeChangeStart', handleRouteChangeStart);
            };
        }
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(head_1.default, { children: (0, jsx_runtime_1.jsx)("title", { children: "Preview Block: ".concat(blockData.blockName) }) }), (0, jsx_runtime_1.jsx)("div", __assign({ id: "previewBlock" }, { children: (0, jsx_runtime_1.jsx)(Blocks_1.default, { data: [blockData], blocks: {}, container: {} }) }))] }));
}
exports.BlockPreviewPage = BlockPreviewPage;
function getServerSideProps(ctx) {
    var _a = ctx.query, _b = _a.blockData, blockData = _b === void 0 ? null : _b, _c = _a.secret, secret = _c === void 0 ? null : _c;
    var config = (0, useGlobalConfig_1.useGlobalConfig)();
    if (!blockData || secret != config.sources.default.secret) {
        // if someone visits this route without passing blockData or the correct secret, we redirect them to the homepage
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    // TODO: do I need to run decodeURI() on blockData?
    var data = JSON.parse(blockData);
    return {
        props: {
            blockData: data,
            enableLayout: false
        },
    };
}
exports.getServerSideProps = getServerSideProps;
