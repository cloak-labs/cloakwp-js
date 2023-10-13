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
var Block_1 = require("./Block");
var blockConfig_1 = require("./context/blockConfig");
function Blocks(_a) {
    var data = _a.data, blocks = _a.blocks, container = _a.container, containerCondition = _a.containerCondition, _b = _a.merge, merge = _b === void 0 ? true : _b, props = __rest(_a, ["data", "blocks", "container", "containerCondition", "merge"]);
    return ((0, jsx_runtime_1.jsx)(blockConfig_1.default, __assign({ blocks: blocks, container: container, containerCondition: containerCondition, merge: merge }, { children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: data === null || data === void 0 ? void 0 : data.map(function (block, i) { return ((0, jsx_runtime_1.jsx)(Block_1.default, __assign({ block: block, prevSibling: i == 0 ? null : data[i - 1], nextSibling: i == data.length - 1 ? null : data[i + 1] }, props), i)); }) }) })));
}
exports.default = Blocks;
