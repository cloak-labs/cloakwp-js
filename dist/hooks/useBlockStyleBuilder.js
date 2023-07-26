"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBlockStyleBuilder = void 0;
var classNames_1 = require("../utils/classNames");
function useBlockStyleBuilder(block) {
    var _a, _b, _c, _d;
    var _e = block.attrs, backgroundColor = _e.backgroundColor, textColor = _e.textColor, className = _e.className, fontSize = _e.fontSize, align = _e.align, textAlign = _e.textAlign, style = _e.style, verticalAlignment = _e.verticalAlignment, layout = _e.layout;
    var layoutKeyword = ((layout === null || layout === void 0 ? void 0 : layout.orientation) == "horizontal" || (layout === null || layout === void 0 ? void 0 : layout.type) == "flex") ? "justify" : "items";
    var classes = (0, classNames_1.classNames)(backgroundColor && "bg-".concat(backgroundColor), textColor && "text-".concat(textColor), fontSize && "text-".concat(fontSize), (align || textAlign) && "text-".concat(textAlign || align), verticalAlignment ? (verticalAlignment == 'center' ? 'justify-center' : (verticalAlignment == 'bottom' ? 'justify-end' : 'justify-start')) : '', (layout && layout.orientation) ? (layout.orientation == "horizontal" ? "flex-row" : "flex-col") : "", layout ? (layout.justifyContent == "center" ? "".concat(layoutKeyword, "-center") : (layout.justifyContent == "right" ? "".concat(layoutKeyword, "-end") : (layout.justifyContent == "space-between" ? "".concat(layoutKeyword, "-between") : ''))) : "", className);
    var styles = {};
    if ((_a = style === null || style === void 0 ? void 0 : style.spacing) === null || _a === void 0 ? void 0 : _a.padding) {
        var _f = (_b = style === null || style === void 0 ? void 0 : style.spacing) === null || _b === void 0 ? void 0 : _b.padding, _g = _f.top, top_1 = _g === void 0 ? '0px' : _g, _h = _f.right, right = _h === void 0 ? '0px' : _h, _j = _f.bottom, bottom = _j === void 0 ? '0px' : _j, _k = _f.left, left = _k === void 0 ? '0px' : _k;
        var total_1 = 0;
        var arr = [top_1, right, bottom, left];
        arr === null || arr === void 0 ? void 0 : arr.forEach(function (val) { return total_1 += parseFloat(val); });
        if (total_1 > 0) {
            styles['padding'] = "".concat(top_1, " ").concat(right, " ").concat(bottom, " ").concat(left);
        }
    }
    if ((_c = style === null || style === void 0 ? void 0 : style.spacing) === null || _c === void 0 ? void 0 : _c.margin) {
        var _l = (_d = style === null || style === void 0 ? void 0 : style.spacing) === null || _d === void 0 ? void 0 : _d.margin, _m = _l.top, top_2 = _m === void 0 ? '0px' : _m, _o = _l.right, right = _o === void 0 ? '0px' : _o, _p = _l.bottom, bottom = _p === void 0 ? '0px' : _p, _q = _l.left, left = _q === void 0 ? '0px' : _q;
        var total_2 = 0;
        var arr = [top_2, right, bottom, left];
        arr === null || arr === void 0 ? void 0 : arr.forEach(function (val) { return total_2 += parseFloat(val); });
        if (total_2 > 0) {
            styles['margin'] = "".concat(top_2, " ").concat(right, " ").concat(bottom, " ").concat(left);
        }
    }
    return {
        classes: classes,
        styles: styles,
    };
}
exports.useBlockStyleBuilder = useBlockStyleBuilder;
