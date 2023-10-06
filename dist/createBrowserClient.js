"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBrowserClient = void 0;
var WPInstance_1 = require("./WPInstance");
/**
 * Returns a browser-friendly WPInstance instance. It can only interact with
 * public/non-authenticated REST API endpoints; eg. you can't create/update posts,
 * retrieve post revisions/drafts, etc. -- to do this, use `createServerClient`
 * on the server-side.
 */
var createBrowserClient = function (wpUrl, options) {
    var _a = options.adminPath, adminPath = _a === void 0 ? "wp/wp-admin" : _a, _b = options.contentPath, contentPath = _b === void 0 ? "app" : _b;
    return new WPInstance_1.default(wpUrl, {
        adminPath: adminPath,
        contentPath: contentPath,
    });
};
exports.createBrowserClient = createBrowserClient;
