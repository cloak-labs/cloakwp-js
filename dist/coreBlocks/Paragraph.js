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
function Paragraph(_a) {
    var _b, _c;
    var block = _a.block, className = _a.className;
    var _d = (0, useBlockStyleBuilder_1.useBlockStyleBuilder)(block.data), classes = _d.classes, styles = _d.styles;
    return ((0, jsx_runtime_1.jsx)("p", __assign({ className: (0, classNames_1.classNames)("h-min-content", classes, ((_c = (_b = block === null || block === void 0 ? void 0 : block.data) === null || _b === void 0 ? void 0 : _b.attrs) === null || _c === void 0 ? void 0 : _c.backgroundColor) ? "p-6" : 'pb-6', className), style: styles }, { children: (0, html_react_parser_1.default)(block.data.attrs.content) })));
}
exports.default = Paragraph;
