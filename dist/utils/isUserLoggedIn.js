"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserLoggedIn = void 0;
const CloakWPConfig_1 = require("../CloakWPConfig");
const isUserLoggedIn = async () => {
    const { apiRouterBasePath } = (0, CloakWPConfig_1.getCloakWPConfig)();
    try {
        const response = await fetch(`${apiRouterBasePath}/is-authenticated`, {
            credentials: "include",
        });
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        return data === true ? true : false;
    }
    catch (error) {
        console.error(`Error while checking user's WP login status: ${error.message ?? error}`);
    }
    return false;
};
exports.isUserLoggedIn = isUserLoggedIn;
