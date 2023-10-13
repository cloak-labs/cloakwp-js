"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWPInstance = void 0;
var stripTrailingSlash_1 = require("./utils/stripTrailingSlash");
var WPAPI = require("wpapi/fetch");
function createWPInstance(options) {
    return new WPInstance(options);
}
exports.createWPInstance = createWPInstance;
var WPInstance = /** @class */ (function () {
    function WPInstance(_a) {
        var url = _a.url, jwt = _a.jwt, _b = _a.adminPath, adminPath = _b === void 0 ? "wp-admin" : _b, _c = _a.contentPath, contentPath = _c === void 0 ? "wp-content" : _c, _d = _a.name, name = _d === void 0 ? "default" : _d;
        this._url = (0, stripTrailingSlash_1.default)(url);
        this._adminPath = (0, stripTrailingSlash_1.default)(adminPath);
        this._contentPath = (0, stripTrailingSlash_1.default)(contentPath);
        this._name = name;
        this._api = this.createRestApiClient();
        this._serverApi = this.createRestApiClient({ jwt: jwt });
    }
    WPInstance.prototype.createRestApiClient = function (options) {
        if (options === void 0) { options = {}; }
        var jwt = options.jwt;
        var wpapi = new WPAPI({
            endpoint: "".concat(this._url, "/wp-json"),
            auth: true, // make all requests from the WPAPI instance use authentication
        });
        // register custom CloakWP api routes as wpapi methods:
        wpapi.menus = wpapi.registerRoute("cloakwp", "/menus/(?P<id>[a-zA-Z0-9-]+)");
        wpapi.options = wpapi.registerRoute("cloakwp", "/options/(?P<id>[a-zA-Z0-9-]+)");
        wpapi.isLoggedIn = wpapi.registerRoute("jwt-auth/v1", "/is-logged-in");
        wpapi.frontpage = wpapi.registerRoute("cloakwp", "/frontpage");
        if (jwt) {
            // add JWT authentication globally for all requests -- this API client should therefore only ever be used server-side so as to not expose the JWT value to the browser
            wpapi.setHeaders("Authorization", "Bearer ".concat(jwt));
        }
        return wpapi;
    };
    /**
     * Returns a browser-friendly WPAPI instance. It can only interact with
     * public/non-authenticated REST API endpoints; eg. you can't create/update posts,
     * retrieve post revisions/drafts, etc. -- to do this, use `serverApi()`
     * on the server-side.
     */
    WPInstance.prototype.api = function () {
        return this._api;
    };
    /**
     * Returns a WPAPI instance with JWT authentication applied to all REST API requests.
     * The idea is that any authenticated requests should happen server-side so as to not
     * expose your JWT token to the browser, which would obivously open your site up to
     * major security vulnerabilities.
     */
    WPInstance.prototype.serverApi = function () {
        return this._serverApi;
    };
    WPInstance.prototype.settings = function () {
        return {
            url: this._url,
            adminPath: this._adminPath,
            contentPath: this._contentPath,
            name: this._name,
        };
    };
    WPInstance.prototype.getName = function () {
        return this._name;
    };
    WPInstance.prototype.getUrl = function () {
        return this._url;
    };
    WPInstance.prototype.getAdminPath = function () {
        return this._adminPath;
    };
    return WPInstance;
}());
exports.default = WPInstance;
