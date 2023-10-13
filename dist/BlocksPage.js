"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocksPage = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var Blocks_1 = require("./Blocks");
function BlocksPage(_a) {
    var pageData = _a.pageData;
    return (0, jsx_runtime_1.jsx)(Blocks_1.default, { data: pageData === null || pageData === void 0 ? void 0 : pageData.blocks_data });
}
exports.BlocksPage = BlocksPage;
