"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSecretValidation = void 0;
var revalidate_1 = require("./revalidate");
var enablePreviewMode_1 = require("./enablePreviewMode");
var exitPreviewMode_1 = require("./exitPreviewMode");
var validateRouteSecretToken_1 = require("./validateRouteSecretToken");
var verifyUserAuthStatus_1 = require("./verifyUserAuthStatus");
function withSecretValidation(req, res, callback) {
    var error = (0, validateRouteSecretToken_1.default)(req, res).error;
    return error !== null && error !== void 0 ? error : callback(req, res);
}
exports.withSecretValidation = withSecretValidation;
function apiRouter(req, res) {
    var slug = req.query.route;
    switch (slug[0]) {
        case "is-authenticated":
            return (0, verifyUserAuthStatus_1.default)(req, res);
        case "revalidate":
            return withSecretValidation(req, res, revalidate_1.default);
        case "preview":
            return withSecretValidation(req, res, enablePreviewMode_1.default);
        case "exit-preview":
            return (0, exitPreviewMode_1.default)(req, res);
        default:
            res.statusCode = 404;
            res.end();
    }
}
exports.default = apiRouter;
