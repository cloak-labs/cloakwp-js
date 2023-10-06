"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookies_next_1 = require("cookies-next");
var crypto_1 = require("../utils/crypto");
var config_1 = require("../config");
function setLoggedIn(req, res) {
    var config = (0, config_1.getConfig)();
    var wp = config.wpInstances[0].serverClient;
    var wpUrl = wp.getUrl();
    var wpAdminPath = wp.getAdminPath();
    var signedValue = (0, crypto_1.createSignedCookieValue)("true");
    console.log("SETTING LOGIN COOKIE WITH SIGNED VALUE OF: ", signedValue);
    (0, cookies_next_1.setCookie)("cloakwp-logged-in", signedValue, {
        req: req,
        res: res,
        // domain: "localhost",
        maxAge: 60 * 60 * 48,
        sameSite: "lax",
        secure: true,
        httpOnly: true,
    }); // logged in status expires in 48 hours (the default session length for WordPress)
    // redirect back to WordPress wp-admin "posts" page (opinion: the dashboard page is useless)
    res.writeHead(307, { Location: "".concat(wpUrl, "/").concat(wpAdminPath, "/edit.php") }).end();
    // res.json("logged in");
}
exports.default = setLoggedIn;
