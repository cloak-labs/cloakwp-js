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
exports.watchForDocumentHeightChanges = exports.handleWPBlockIframeMessage = exports.getDocumentHeight = exports.sendBlockHeightToWP = exports.isUserLoggedIn = exports.validateRouteSecretToken = exports.getPreviewParams = exports.getPreviewData = exports.generateSitemap = exports.getCloakWPConfig = exports.setCloakWPConfig = exports.wpBlockStyleBuilder = exports.WPBlockRenderer = void 0;
__exportStar(require("./types"), exports);
// Bundle `cloakcms` into `cloakwp` so users don't need to install it:
__exportStar(require("cloakcms"), exports);
var WPBlockRenderer_1 = require("./WPBlockRenderer");
Object.defineProperty(exports, "WPBlockRenderer", { enumerable: true, get: function () { return WPBlockRenderer_1.WPBlockRenderer; } });
var wpBlockStyleBuilder_1 = require("./wpBlockStyleBuilder");
Object.defineProperty(exports, "wpBlockStyleBuilder", { enumerable: true, get: function () { return wpBlockStyleBuilder_1.wpBlockStyleBuilder; } });
// CMSInstance Plugins
// export {
//   wpRestApiClient,
//   RestApiClientConfig,
//   ClientMutationFn,
//   WPClient
// } from "./plugins/wpRestApiClient";
// export { registerCloakWPMethods } from "./plugins/registerCloakWPMethods"
// Config
var CloakWPConfig_1 = require("./CloakWPConfig");
Object.defineProperty(exports, "setCloakWPConfig", { enumerable: true, get: function () { return CloakWPConfig_1.setCloakWPConfig; } });
Object.defineProperty(exports, "getCloakWPConfig", { enumerable: true, get: function () { return CloakWPConfig_1.getCloakWPConfig; } });
// Utils
var generateSitemap_1 = require("./utils/generateSitemap");
Object.defineProperty(exports, "generateSitemap", { enumerable: true, get: function () { return generateSitemap_1.generateSitemap; } });
var getPreviewData_1 = require("./utils/getPreviewData");
Object.defineProperty(exports, "getPreviewData", { enumerable: true, get: function () { return getPreviewData_1.getPreviewData; } });
var getPreviewParams_1 = require("./utils/getPreviewParams");
Object.defineProperty(exports, "getPreviewParams", { enumerable: true, get: function () { return getPreviewParams_1.getPreviewParams; } });
var validateRouteSecretToken_1 = require("./utils/validateRouteSecretToken");
Object.defineProperty(exports, "validateRouteSecretToken", { enumerable: true, get: function () { return validateRouteSecretToken_1.validateRouteSecretToken; } });
var isUserLoggedIn_1 = require("./utils/isUserLoggedIn");
Object.defineProperty(exports, "isUserLoggedIn", { enumerable: true, get: function () { return isUserLoggedIn_1.isUserLoggedIn; } });
var acfBlockDecoupledPreview_1 = require("./utils/acfBlockDecoupledPreview");
Object.defineProperty(exports, "sendBlockHeightToWP", { enumerable: true, get: function () { return acfBlockDecoupledPreview_1.sendBlockHeightToWP; } });
Object.defineProperty(exports, "getDocumentHeight", { enumerable: true, get: function () { return acfBlockDecoupledPreview_1.getDocumentHeight; } });
Object.defineProperty(exports, "handleWPBlockIframeMessage", { enumerable: true, get: function () { return acfBlockDecoupledPreview_1.handleWPBlockIframeMessage; } });
Object.defineProperty(exports, "watchForDocumentHeightChanges", { enumerable: true, get: function () { return acfBlockDecoupledPreview_1.watchForDocumentHeightChanges; } });
