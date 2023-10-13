"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = exports.classNames = exports.deepMerge = exports.BlockPreviewPageSSP = exports.BlockPreviewPage = exports.getPreviewData = exports.useUser = exports.useBlockStyleBuilder = exports.useBlockConfig = exports.AdminBar = exports.ErrorPage = exports.Link = exports.ConditionalWrapper = exports.Container = exports.Block = exports.Blocks = exports.BlocksPage = exports.useGlobals = exports.GlobalsProvider = exports.BlockConfigProvider = exports.getWpInstance = exports.getCloakConfig = exports.setCloakConfig = exports.withCloakWP = exports.createWPInstance = exports.WPInstance = void 0;
// Config
__exportStar(require("./types"), exports);
var WPInstance_1 = require("./WPInstance");
Object.defineProperty(exports, "WPInstance", { enumerable: true, get: function () { return WPInstance_1.default; } });
Object.defineProperty(exports, "createWPInstance", { enumerable: true, get: function () { return WPInstance_1.createWPInstance; } });
var withCloakWP_1 = require("./config/withCloakWP");
Object.defineProperty(exports, "withCloakWP", { enumerable: true, get: function () { return withCloakWP_1.withCloakWP; } });
var index_1 = require("./config/index");
Object.defineProperty(exports, "setCloakConfig", { enumerable: true, get: function () { return index_1.setCloakConfig; } });
Object.defineProperty(exports, "getCloakConfig", { enumerable: true, get: function () { return index_1.getCloakConfig; } });
Object.defineProperty(exports, "getWpInstance", { enumerable: true, get: function () { return index_1.getWpInstance; } });
// Context
var blockConfig_1 = require("./context/blockConfig");
Object.defineProperty(exports, "BlockConfigProvider", { enumerable: true, get: function () { return blockConfig_1.default; } });
var GlobalsContext_1 = require("./context/GlobalsContext");
Object.defineProperty(exports, "GlobalsProvider", { enumerable: true, get: function () { return GlobalsContext_1.GlobalsProvider; } });
Object.defineProperty(exports, "useGlobals", { enumerable: true, get: function () { return GlobalsContext_1.useGlobals; } });
// Components
var BlocksPage_1 = require("./BlocksPage");
Object.defineProperty(exports, "BlocksPage", { enumerable: true, get: function () { return BlocksPage_1.BlocksPage; } });
var Blocks_1 = require("./Blocks");
Object.defineProperty(exports, "Blocks", { enumerable: true, get: function () { return Blocks_1.default; } });
var Block_1 = require("./Block");
Object.defineProperty(exports, "Block", { enumerable: true, get: function () { return Block_1.default; } });
var Container_1 = require("./components/Container");
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return Container_1.default; } });
var ConditionalWrapper_1 = require("./components/ConditionalWrapper");
Object.defineProperty(exports, "ConditionalWrapper", { enumerable: true, get: function () { return ConditionalWrapper_1.default; } });
var Link_1 = require("./components/Link");
Object.defineProperty(exports, "Link", { enumerable: true, get: function () { return Link_1.default; } });
var ErrorPage_1 = require("./components/ErrorPage");
Object.defineProperty(exports, "ErrorPage", { enumerable: true, get: function () { return ErrorPage_1.default; } });
var AdminBar_1 = require("./components/AdminBar");
Object.defineProperty(exports, "AdminBar", { enumerable: true, get: function () { return AdminBar_1.AdminBar; } });
// Hooks
var useBlockConfig_1 = require("./hooks/useBlockConfig");
Object.defineProperty(exports, "useBlockConfig", { enumerable: true, get: function () { return useBlockConfig_1.useBlockConfig; } });
var useBlockStyleBuilder_1 = require("./hooks/useBlockStyleBuilder");
Object.defineProperty(exports, "useBlockStyleBuilder", { enumerable: true, get: function () { return useBlockStyleBuilder_1.useBlockStyleBuilder; } });
var useUser_1 = require("./hooks/useUser");
Object.defineProperty(exports, "useUser", { enumerable: true, get: function () { return useUser_1.useUser; } });
// Preview mode
var getPreviewData_1 = require("./preview/getPreviewData");
Object.defineProperty(exports, "getPreviewData", { enumerable: true, get: function () { return getPreviewData_1.getPreviewData; } });
var BlockPreviewPage_1 = require("./preview/BlockPreviewPage");
Object.defineProperty(exports, "BlockPreviewPage", { enumerable: true, get: function () { return BlockPreviewPage_1.default; } });
Object.defineProperty(exports, "BlockPreviewPageSSP", { enumerable: true, get: function () { return BlockPreviewPage_1.getServerSideProps; } });
// Utils
var deepMerge_1 = require("./utils/deepMerge");
Object.defineProperty(exports, "deepMerge", { enumerable: true, get: function () { return deepMerge_1.deepMerge; } });
var classNames_1 = require("./utils/classNames");
Object.defineProperty(exports, "classNames", { enumerable: true, get: function () { return classNames_1.classNames; } });
// API
var apiRouter_1 = require("./api/apiRouter");
Object.defineProperty(exports, "apiRouter", { enumerable: true, get: function () { return apiRouter_1.default; } });
