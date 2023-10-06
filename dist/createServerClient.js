"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerClient = void 0;
var createBrowserClient_1 = require("./createBrowserClient");
/**
 * createServerClient is a wrapper around createBrowserClient that simply
 * adds JWT authentication to all REST API requests done through the returned
 * WPInstance instance. The idea is that any authenticated requests should
 * happen server-side so as to not expose your JWT token to the browser, which
 * would obivously open your site up to major security vulnerabilities.
 */
var createServerClient = function (wpUrl, jwt, options) {
    return (0, createBrowserClient_1.createBrowserClient)(wpUrl, options).authWithJWT(jwt);
};
exports.createServerClient = createServerClient;
