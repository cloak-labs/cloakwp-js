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
var classNames_1 = require("../utils/classNames");
function ListItem(_a) {
    var block = _a.block;
    var _b = block.data.attrs, content = _b.content, className = _b.className;
    return ((0, jsx_runtime_1.jsx)("li", __assign({ className: (0, classNames_1.classNames)("list-circle", className) }, { children: content })));
}
exports.default = ListItem;
