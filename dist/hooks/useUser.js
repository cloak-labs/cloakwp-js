"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUser = void 0;
var cookies_next_1 = require("cookies-next");
var react_1 = require("react");
function useUser(options) {
    if (options === void 0) { options = {}; }
    var _a = (0, react_1.useState)(false), isLoggedIn = _a[0], setIsLoggedIn = _a[1];
    (0, react_1.useEffect)(function () {
        var loggedIn = (0, cookies_next_1.getCookie)('cloakwp-logged-in', options);
        setIsLoggedIn(loggedIn);
    }, []);
    return {
        isLoggedIn: isLoggedIn,
        // in future add other WP user data here if a WordPress admin user is logged in
    };
}
exports.useUser = useUser;
