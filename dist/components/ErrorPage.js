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
var jsx_runtime_1 = require("react/jsx-runtime");
var head_1 = require("next/head");
var Container_1 = require("./Container");
function ErrorPage(_a) {
    var _b;
    var errorData = _a.errorData;
    console.log({ errorData: errorData });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(head_1.default, { children: (0, jsx_runtime_1.jsx)("title", { children: "Error" }) }), (0, jsx_runtime_1.jsx)(Container_1.default, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "mx-auto flex h-[70vh] max-w-none flex-col items-center justify-center gap-y-3 sm:max-w-xl lg:max-w-3xl" }, { children: [(0, jsx_runtime_1.jsx)("h2", __assign({ className: "text-lg text-gray-900 sm:text-xl" }, { children: ((_b = errorData === null || errorData === void 0 ? void 0 : errorData.data) === null || _b === void 0 ? void 0 : _b.status) ? "".concat(errorData.data.status, " error") : "Unknown error" })), (0, jsx_runtime_1.jsx)("h1", __assign({ className: "text-4xl mb-5 text-gray-700 sm:text-5xl" }, { children: "Sorry, an error occured." })), (0, jsx_runtime_1.jsx)("p", { children: (errorData === null || errorData === void 0 ? void 0 : errorData.code) && "Code: ".concat(errorData.code) }), (0, jsx_runtime_1.jsx)("p", { children: (errorData === null || errorData === void 0 ? void 0 : errorData.code) && "Message: ".concat(errorData.message) })] })) })] }));
}
exports.default = ErrorPage;
