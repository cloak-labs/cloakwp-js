"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stripTrailingSlash(url) {
    return url.replace(/\/$/, "");
}
exports.default = stripTrailingSlash;
