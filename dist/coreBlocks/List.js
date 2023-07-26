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
var classNames_1 = require("../utils/classNames");
var Block_1 = require("../Block");
function List(_a) {
    var block = _a.block, className = _a.className;
    var _b = (0, useBlockStyleBuilder_1.useBlockStyleBuilder)(block.data), classes = _b.classes, styles = _b.styles;
    var _c = block.data, _d = _c.attrs, ordered = _d.ordered, values = _d.values, innerBlocks = _c.innerBlocks;
    // const { ordered, values } = attrs
    // console.log("These are supposed to be innerBlocks:", classes)
    var newListItemRenderingMethod = false;
    if (innerBlocks.length) {
        // using WP v6.1 or later, where the core/list-item inner block was introduced rather than baking all the <li>'s into the block.attrs.values field
        newListItemRenderingMethod = true;
    }
    var ListType = ordered ? 'ol' : 'ul';
    return ((0, jsx_runtime_1.jsx)(ListType, __assign({ className: (0, classNames_1.classNames)("space-y-3 pb-6", ListType == 'ul' ? "list-disc" : "list-decimal", classes, className), style: styles }, { children: newListItemRenderingMethod ? (innerBlocks === null || innerBlocks === void 0 ? void 0 : innerBlocks.map(function (block, i) { return (0, jsx_runtime_1.jsx)(Block_1.default, { block: block }, i); })) : (0, html_react_parser_1.default)(values) })));
}
exports.default = List;
