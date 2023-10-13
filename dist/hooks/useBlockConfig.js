"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBlockConfig = void 0;
var react_1 = require("react");
var blockConfig_1 = require("../context/blockConfig");
function useBlockConfig() {
    var config = (0, react_1.useContext)(blockConfig_1.BlockConfigContext);
    return config;
}
exports.useBlockConfig = useBlockConfig;
