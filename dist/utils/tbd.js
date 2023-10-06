"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
function createSignedCookieValue(value) {
    var signature = crypto
        .createHmac("sha256", process.env.CLOAKWP_AUTH_SECRET)
        .update(value)
        .digest("hex");
    return "".concat(value, ".").concat(signature);
}
exports.default = createSignedCookieValue;
