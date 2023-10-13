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
exports.BlockConfigContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useBlockConfig_1 = require("../hooks/useBlockConfig");
var deepMerge_1 = require("../utils/deepMerge");
exports.BlockConfigContext = (0, react_1.createContext)({});
var BlockConfigProvider = function (_a) {
    var blocks = _a.blocks, container = _a.container, containerCondition = _a.containerCondition, _b = _a.merge, merge = _b === void 0 ? true : _b, // when true, we deepMerge 'blocks' with previously set blocks from higher-up context.. otherwise when false, 'blocks' totally overrides previous context
    children = _a.children;
    var _c = (0, useBlockConfig_1.useBlockConfig)(), _d = _c.container, prevContainer = _d === void 0 ? null : _d, _e = _c.containerCondition, prevContainerCondition = _e === void 0 ? null : _e, _f = _c.blocks, prevBlocks = _f === void 0 ? {} : _f; // grabs next closest block config from higher up the component tree (doesn't necessarily exist)
    var isNewConfig = blocks || container || container == false || containerCondition; // boolean --> when false (no props provided), we don't bother rendering Context Provider, we just render the children
    var config = {
        container: container !== null && container !== void 0 ? container : prevContainer,
        containerCondition: containerCondition !== null && containerCondition !== void 0 ? containerCondition : prevContainerCondition,
        blocks: merge ? (0, deepMerge_1.deepMerge)(prevBlocks, blocks) : blocks !== null && blocks !== void 0 ? blocks : prevBlocks,
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: isNewConfig ? ((0, jsx_runtime_1.jsx)(exports.BlockConfigContext.Provider, __assign({ value: config }, { children: children }))) : (children) }));
};
exports.default = BlockConfigProvider;
