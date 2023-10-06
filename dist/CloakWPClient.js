"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stripTrailingSlash_1 = require("./utils/stripTrailingSlash");
var WPAPI = require("wpapi/fetch");
var WPInstance = /** @class */ (function () {
    function WPInstance(url, _a) {
        var _b = _a.adminPath, adminPath = _b === void 0 ? "wp-admin" : _b, _c = _a.contentPath, contentPath = _c === void 0 ? "wp-content" : _c;
        this._enabledJWT = false;
        this._url = (0, stripTrailingSlash_1.default)(url);
        this._adminPath = (0, stripTrailingSlash_1.default)(adminPath);
        this._contentPath = (0, stripTrailingSlash_1.default)(contentPath);
        var wpapi = new WPAPI({
            endpoint: "".concat(this._url, "/wp-json"),
            auth: true, // make all requests from the WPAPI instance use authentication
        });
        // register custom CloakWP api routes as wpapi methods:
        wpapi.menus = wpapi.registerRoute("cloakwp", "/menus/(?P<id>[a-zA-Z0-9-]+)");
        wpapi.options = wpapi.registerRoute("cloakwp", "/options/(?P<id>[a-zA-Z0-9-]+)");
        wpapi.isLoggedIn = wpapi.registerRoute("jwt-auth/v1", "/is-logged-in");
        this._rest = wpapi;
    }
    WPInstance.prototype.rest = function () {
        return this._rest;
    };
    WPInstance.prototype.settings = function () {
        return {
            url: this._url,
            adminPath: this._adminPath,
            contentPath: this._contentPath,
        };
    };
    WPInstance.prototype.getUrl = function () {
        return this._url;
    };
    WPInstance.prototype.getAdminPath = function () {
        return this._adminPath;
    };
    WPInstance.prototype.authWithJWT = function (jwt) {
        if (jwt && !this._enabledJWT) {
            // add JWT authentication globally for all requests:
            this._rest = this._rest.setHeaders("Authorization", "Bearer ".concat(jwt));
            this._enabledJWT = true;
        }
        return this;
    };
    return WPInstance;
}());
exports.default = WPInstance;
