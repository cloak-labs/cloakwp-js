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
exports.EditIcon = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var classNames_1 = require("../../utils/classNames");
function EditIcon(_a) {
    var className = _a.className;
    return ((0, jsx_runtime_1.jsx)("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: (0, classNames_1.classNames)("w-4 h-4", className), viewBox: "0 0 24 24" }, { children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" }) })));
}
exports.EditIcon = EditIcon;
