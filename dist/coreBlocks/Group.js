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
var Block_1 = require("../Block");
var Container_1 = require("../components/Container");
var useBlockStyleBuilder_1 = require("../hooks/useBlockStyleBuilder");
var classNames_1 = require("../utils/classNames");
function Group(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var block = _a.block;
    var _j = (0, useBlockStyleBuilder_1.useBlockStyleBuilder)(block), classes = _j.classes, styles = _j.styles;
    if (!((_b = block === null || block === void 0 ? void 0 : block.data) === null || _b === void 0 ? void 0 : _b.innerBlocks))
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    var _k = block.attrs, layout = _k.layout, align = _k.align;
    var numBlocks = (_d = (_c = block === null || block === void 0 ? void 0 : block.data) === null || _c === void 0 ? void 0 : _c.innerBlocks) === null || _d === void 0 ? void 0 : _d.length;
    var groupClasses = (0, classNames_1.classNames)('flex gap-x-4 md:gap-x-6 flex-wrap', layout.type == 'flex' ? (layout.flexWrap ? 'flex-row' : 'flex-col') : 'flex-col', numBlocks <= 2 ? 'sm:flex-nowrap' : (numBlocks <= 3 ? 'md:flex-nowrap' : (numBlocks <= 4 ? 'lg:flex-nowrap' : '')));
    if (align != 'full') {
        return ((0, jsx_runtime_1.jsx)(Container_1.default, __assign({ className: (0, classNames_1.classNames)("relative") }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: (0, classNames_1.classNames)(styles.margin && 'rounded-lg', groupClasses, classes), style: styles }, { children: (_f = (_e = block === null || block === void 0 ? void 0 : block.data) === null || _e === void 0 ? void 0 : _e.innerBlocks) === null || _f === void 0 ? void 0 : _f.map(function (innerBlock, index) { return (0, jsx_runtime_1.jsx)(Block_1.default, { block: innerBlock, parentBlock: block.data, isNested: true, className: "min-w-[150px]" }, index); }) })) })));
    }
    else {
        return ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, classNames_1.classNames)(classes), style: styles }, { children: (0, jsx_runtime_1.jsx)(Container_1.default, __assign({ className: "relative", innerClassName: groupClasses }, { children: (_h = (_g = block === null || block === void 0 ? void 0 : block.data) === null || _g === void 0 ? void 0 : _g.innerBlocks) === null || _h === void 0 ? void 0 : _h.map(function (innerBlock, index) { return (0, jsx_runtime_1.jsx)(Block_1.default, { block: innerBlock, parentBlock: block.data, isNested: true, className: "min-w-[150px]" }, index); }) })) })));
    }
}
exports.default = Group;
