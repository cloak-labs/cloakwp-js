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
// Used for YouTube embeds
function Embed(_a) {
    var block = _a.block, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "aspect-w-16 aspect-h-9 w-full" }, { children: (0, jsx_runtime_1.jsx)("iframe", { src: block.attrs.url, frameborder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowfullscreen: true }) })));
}
exports.default = Embed;
