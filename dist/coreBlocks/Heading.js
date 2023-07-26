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
var useBlockStyleBuilder_1 = require("../hooks/useBlockStyleBuilder");
var html_react_parser_1 = require("html-react-parser");
var classNames_js_1 = require("../utils/classNames.js");
function Heading(_a) {
    var block = _a.block, className = _a.className, tags = _a.tags;
    var _b = (0, useBlockStyleBuilder_1.useBlockStyleBuilder)(block.data), classes = _b.classes, styles = _b.styles;
    var _c = block.data.attrs, level = _c.level, content = _c.content;
    // console.log("heading tags: ", tags);
    var Tag = __assign({ 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" }, tags)[level];
    return ((0, jsx_runtime_1.jsx)(Tag, __assign({ className: (0, classNames_js_1.classNames)(block.isNested && "py-2", classes, className), style: styles }, (typeof Tag == "string" ? {} : { block: block }), { children: (0, html_react_parser_1.default)(content) })));
}
exports.default = Heading;
