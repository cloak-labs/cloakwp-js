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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var classNames_1 = require("../utils/classNames");
function Container(_a) {
    var className = _a.className, innerClassName = _a.innerClassName, children = _a.children, props = __rest(_a, ["className", "innerClassName", "children"]);
    var defaultInnerClassNames = "px-4 sm:px-6 lg:px-9 mx-auto max-w-7xl lg:max-w-8xl";
    var hasBgColor = (className === null || className === void 0 ? void 0 : className.includes("bg-")) || false;
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, classNames_1.classNames)(!hasBgColor && defaultInnerClassNames, !hasBgColor && innerClassName, className), "data-cloakwp-container": "true" }, props, { children: hasBgColor ? ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, classNames_1.classNames)(defaultInnerClassNames, innerClassName) }, { children: children }))) : (children) })));
}
exports.default = Container;
