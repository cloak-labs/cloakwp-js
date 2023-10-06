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
exports.getWpInstance = exports.getCloakConfig = exports.setCloakConfig = void 0;
var config;
function setCloakConfig(_config) {
    if (config)
        return; // don't allow setting config more than once
    config = __assign({ apiRouterBasePath: "cloakwp" }, _config);
}
exports.setCloakConfig = setCloakConfig;
function getCloakConfig() {
    if (!config)
        throw Error("Called getCloakConfig() before setCloakConfig()");
    return config;
}
exports.getCloakConfig = getCloakConfig;
function getWpInstance(name) {
    var _a;
    if (!config)
        throw Error("Called getWpInstance() before setCloakConfig()");
    if (!(config === null || config === void 0 ? void 0 : config.wpInstances) || !((_a = config === null || config === void 0 ? void 0 : config.wpInstances) === null || _a === void 0 ? void 0 : _a.length))
        throw Error("Called getWpInstance() without setting `wpInstances` in your CloakWP config");
    return name
        ? config.wpInstances.find(function (wp) { return wp.getName() == name; })
        : config.wpInstances[0]; // return 1st instance if `name` not provided
}
exports.getWpInstance = getWpInstance;
