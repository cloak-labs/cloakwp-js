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
var link_1 = require("next/link");
var CustomLink = function (_a) {
    var href = _a.href, ref = _a.ref, children = _a.children, _b = _a.openInNewTab, openInNewTab = _b === void 0 ? true : _b, rest = __rest(_a, ["href", "ref", "children", "openInNewTab"]);
    if (!href)
        return (0, jsx_runtime_1.jsx)("span", __assign({ ref: ref }, rest, { children: children }));
    var isInternalLink = href && href.startsWith('/') && !href.startsWith('/api/');
    var isAnchorLink = href && href.startsWith('#');
    if (isInternalLink) {
        return ((0, jsx_runtime_1.jsx)(link_1.default, __assign({ ref: ref, href: href }, rest, { children: children })));
    }
    if (isAnchorLink) {
        return (0, jsx_runtime_1.jsx)("a", __assign({ ref: ref, href: href }, rest, { children: children }));
    }
    if (!href.startsWith('/') && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
        href = "https://".concat(href);
    return (0, jsx_runtime_1.jsx)("a", __assign({ target: openInNewTab ? "_blank" : "", rel: "noopener noreferrer", ref: ref, href: href }, rest, { children: children }));
};
exports.default = CustomLink;
