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
exports.HomeIcon = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var classNames_1 = require("../../utils/classNames");
function HomeIcon(_a) {
    var className = _a.className;
    return ((0, jsx_runtime_1.jsx)("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: (0, classNames_1.classNames)("w-4 h-4", className), viewBox: "0 0 24 24" }, { children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" }) })));
}
exports.HomeIcon = HomeIcon;
