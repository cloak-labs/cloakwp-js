"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignedCookieValue = exports.createSignedCookieValue = void 0;
var crypto = require("crypto");
var signingSecret = process.env.CLOAKWP_AUTH_SECRET;
/**
 * Function to create a signed cookie value, which paired with verifySignedCookieValue
 * below, allows us to read our cookie values in a secure way, ensuring that its value
 * was not modified client-side by a malicious user. For example, we use this to verify
 * a user is logged in to WordPress using our `cloakwp-logged-in` cookie, so we can safely
 * render the AdminBar if they are logged in.
 */
function createSignedCookieValue(value) {
    var signature = createCookieSignature(value);
    return "".concat(value, ".").concat(signature);
}
exports.createSignedCookieValue = createSignedCookieValue;
// Function to verify a signed cookie value was set by us (and not a malicious user)
function verifySignedCookieValue(clientCookieValue) {
    var parts = clientCookieValue.split(".");
    if (parts.length === 2) {
        var value = parts[0], signature = parts[1];
        var computedSignature = createCookieSignature(value);
        return signature === computedSignature;
    }
    return false;
}
exports.verifySignedCookieValue = verifySignedCookieValue;
function createCookieSignature(value) {
    if (!signingSecret)
        throw Error("Missing required CLOAKWP_AUTH_SECRET env variable -- cannot create signed cookie value without it.");
    return crypto.createHmac("sha256", signingSecret).update(value).digest("hex");
}
