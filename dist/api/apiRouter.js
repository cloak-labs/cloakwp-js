"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var setLoggedIn_1 = require("./setLoggedIn");
var setLoggedOut_1 = require("./setLoggedOut");
var revalidate_1 = require("./revalidate");
var enablePreviewMode_1 = require("./enablePreviewMode");
var exitPreviewMode_1 = require("./exitPreviewMode");
function apiRouter(req, res) {
    var slug = req.query.route;
    switch (slug[0]) {
        case 'login':
            return (0, setLoggedIn_1.default)(req, res);
        case 'logout':
            return (0, setLoggedOut_1.default)(req, res);
        case 'revalidate':
            return (0, revalidate_1.default)(req, res);
        case 'preview':
            return (0, enablePreviewMode_1.default)(req, res);
        case 'exit-preview':
            return (0, exitPreviewMode_1.default)(req, res);
        default:
            res.statusCode = 404;
            res.end();
    }
}
exports.default = apiRouter;
