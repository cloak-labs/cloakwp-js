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
var Link_1 = require("./Link");
var baseStyles = {
    solid: 'text-sm outline-2 outline-offset-2 transition-colors',
    outline: 'border text-sm outline-2 outline-offset-2 transition-colors',
    link: 'text-sm',
};
var variantStyles = {
    solid: {
        white: 'text-gray-800 bg-white hover:bg-gray-100',
        gray: 'text-white bg-gray-700 hover:bg-gray-800',
        black: 'text-white bg-black hover:bg-gray-900',
    },
    outline: {
        white: 'border-white text-black hover:bg-white hover:text-gray-800',
        gray: 'border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white',
        black: 'border-black text-black hover:bg-black hover:text-white',
    },
    link: {
        gray: 'text-gray-100 hover:text-gray-300 active:text-gray-100/80',
    },
};
function Button(_a) {
    var _b = _a.color, color = _b === void 0 ? 'gray' : _b, _c = _a.variant, variant = _c === void 0 ? 'solid' : _c, _d = _a.size, size = _d === void 0 ? 'reg' : _d, _e = _a.type, type = _e === void 0 ? 'button' : _e, href = _a.href, className = _a.className, wpClasses = _a.wpClasses, style = _a.style, children = _a.children, props = __rest(_a, ["color", "variant", "size", "type", "href", "className", "wpClasses", "style", "children"]);
    var classes = (0, classNames_1.classNames)("inline-flex items-center justify-center border border-transparent font-semibold rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2", size === 'small' && 'text-xs px-4 py-1.5', size === 'reg' && 'text-sm px-6 py-2.5', size === 'large' && 'text-base px-8 py-3', baseStyles[variant], variantStyles[variant][color], wpClasses, className);
    // note: when an href is passed in, we just render a Link styled as a button --> HTML5 doesn't want interactive elements (i.e. button) inside <a> tags. So putting <button> in <Link> can lead to hydration error.
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: href ? ((0, jsx_runtime_1.jsx)(Link_1.default, __assign({ href: href, className: classes, style: style }, props, { children: children }))) : ((0, jsx_runtime_1.jsx)("button", __assign({ type: type, className: classes, style: style }, props, { children: (0, jsx_runtime_1.jsx)("span", __assign({ className: "w-full" }, { children: children })) }))) }));
}
exports.default = Button;
