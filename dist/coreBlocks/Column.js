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
var useBlockStyleBuilder_1 = require("../hooks/useBlockStyleBuilder");
var classNames_1 = require("../utils/classNames");
function Column(_a) {
    var _b, _c;
    var block = _a.block, width = _a.width, index = _a.index, numColumns = _a.numColumns, className = _a.className;
    // console.log('** column block: ', block)
    var _d = (0, useBlockStyleBuilder_1.useBlockStyleBuilder)(block), classes = _d.classes, styles = _d.styles;
    var colSpan = 6; // default to 50% if no column width is defined
    if (width) { // given a percentage width, we need to find the closest matching column width from our 12-column grid system (i.e. 50% == col-span-6, and 52% also == col-span-6)
        var gridColWidths = [8.333, 16.667, 25, 33.333, 41.667, 50, 58.333, 66.667, 75, 83.333, 91.667, 100];
        var lastDiff = 101;
        for (var i = 0; i < gridColWidths.length; i++) {
            var gridColWidth = gridColWidths[i];
            if (width == gridColWidth) { // if we find an exact match, that makes our life easy and we can break out of the loop
                colSpan = i + 1;
                break;
            }
            // otherwise, we search for the closest grid column match:
            var diff = Math.abs(gridColWidth - width);
            if (diff < lastDiff)
                colSpan = i + 1;
            else if (diff > lastDiff)
                break; // we're getting farther from the closest grid col width, so we know we already found the closest and can therefore break out of the loop
            lastDiff = diff;
        }
    }
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, classNames_1.classNames)('flex flex-col', "col-span-".concat(colSpan), numColumns == 2 && 'space-y-3', (numColumns > 2 && numColumns <= 4) && 'space-y-2', (numColumns > 4 && numColumns <= 6) && 'space-y-1', numColumns > 6 && 'space-y-0.5', classes, className), style: styles, "data-cloakwp-column": "true" }, { children: (_c = (_b = block === null || block === void 0 ? void 0 : block.data) === null || _b === void 0 ? void 0 : _b.innerBlocks) === null || _c === void 0 ? void 0 : _c.map(function (innerBlock, index) { return (0, jsx_runtime_1.jsx)(Block_1.default, { block: innerBlock, parentBlock: block, isNested: true }, index); }) })));
}
exports.default = Column;
