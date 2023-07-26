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
var image_1 = require("next/future/image");
var html_react_parser_1 = require("html-react-parser");
var classNames_1 = require("../utils/classNames");
var Link_1 = require("../components/Link");
var useBlockStyleBuilder_1 = require("../hooks/useBlockStyleBuilder");
function Image(_a) {
    var _b, _c, _d;
    var block = _a.block, className = _a.className, _e = _a.quality, quality = _e === void 0 ? 75 : _e, _f = _a.priority, priority = _f === void 0 ? false : _f, _g = _a.placeholder, placeholder = _g === void 0 ? 'empty' : _g, blurDataURL = _a.blurDataURL, containerClassName = _a.containerClassName;
    var _h = (0, useBlockStyleBuilder_1.useBlockStyleBuilder)(block.data), classes = _h.classes, styles = _h.styles;
    var _j = (_b = block === null || block === void 0 ? void 0 : block.data) === null || _b === void 0 ? void 0 : _b.attrs, url = _j.url, alt = _j.alt, caption = _j.caption, href = _j.href, width = _j.width, height = _j.height, align = _j.align, wpClassName = _j.className;
    var captionColor = ((_d = (_c = block === null || block === void 0 ? void 0 : block.parent) === null || _c === void 0 ? void 0 : _c.attrs) === null || _d === void 0 ? void 0 : _d.textColor) || 'gray-700';
    styles = __assign(__assign({}, styles), { width: width || '100%', maxWidth: '100%' });
    // TODO: add containerClassName prop
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, classNames_1.classNames)('relative', align == 'center' && 'mx-auto', align == 'right' && 'ml-auto', containerClassName), style: styles }, { children: [(0, jsx_runtime_1.jsx)(Link_1.default, __assign({ href: href, className: "relative" }, { children: (0, jsx_runtime_1.jsx)(image_1.default, { src: url, className: (0, classNames_1.classNames)("rounded-lg", (block.isNested || width == 0) && "w-full h-full", wpClassName.includes("is-style-rounded") && "rounded-full", className, classes), width: width || 1300, height: height, alt: alt, quality: quality, priority: priority, placeholder: (placeholder == 'blur' && !blurDataURL) ? 'empty' : placeholder, blurDataURL: blurDataURL }) })), caption &&
                (0, jsx_runtime_1.jsx)("p", __assign({ className: (0, classNames_1.classNames)('text-sm text-center mt-2', "text-".concat(captionColor)), style: { width: width || '100%', maxWidth: "100%" } }, { children: (0, html_react_parser_1.default)(caption) }))] })));
}
exports.default = Image;
