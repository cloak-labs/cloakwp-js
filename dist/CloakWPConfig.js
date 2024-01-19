"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloakWPConfig = exports.setCloakWPConfig = void 0;
let _config = {
    // set defaults:
    apiRouterBasePath: "/api/cloakwp",
};
function setCloakWPConfig(config) {
    _config = {
        ..._config,
        ...config,
    };
}
exports.setCloakWPConfig = setCloakWPConfig;
function getCloakWPConfig() {
    return _config;
}
exports.getCloakWPConfig = getCloakWPConfig;
