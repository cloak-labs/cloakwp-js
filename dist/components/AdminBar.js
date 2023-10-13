"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var Button_1 = require("./Button");
var useUser_1 = require("../hooks/useUser");
var icons_1 = require("./icons");
var classNames_1 = require("../utils/classNames");
var config_1 = require("../config");
var GlobalsContext_1 = require("../context/GlobalsContext");
function AdminBar(_a) {
    var _b, _c;
    var _d = _a.alwaysVisible, alwaysVisible = _d === void 0 ? false : _d, className = _a.className, props = __rest(_a, ["alwaysVisible", "className"]);
    var _e = (0, GlobalsContext_1.useGlobals)(), pageData = _e.pageData, isPreview = _e.isPreview;
    var _f = (0, useUser_1.useUser)().isLoggedIn, isLoggedIn = _f === void 0 ? false : _f;
    var apiRouterBasePath = (0, config_1.getCloakConfig)().apiRouterBasePath;
    var _g = (0, config_1.getWpInstance)().settings(), url = _g.url, adminPath = _g.adminPath;
    var status = (_c = (_b = {
        publish: "published",
        draft: "draft",
        pending: "pending",
        future: "scheduled",
        private: "private",
    }[pageData === null || pageData === void 0 ? void 0 : pageData.status]) !== null && _b !== void 0 ? _b : pageData === null || pageData === void 0 ? void 0 : pageData.status) !== null && _c !== void 0 ? _c : "revision";
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (alwaysVisible || isLoggedIn) && ((0, jsx_runtime_1.jsx)("div", __assign({ id: "cloakwp-admin-bar", className: (0, classNames_1.classNames)("w-full h-[38px] flex items-center bg-gray-900 text-gray-200 px-3 lg:px-4 py-1.5", className) }, props, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "w-full flex gap-x-2 sm:gap-x-6 mb-0 text-sm" }, { children: [(0, jsx_runtime_1.jsxs)("a", __assign({ href: "".concat(url, "/").concat(adminPath, "/edit.php"), target: "_blank", className: "flex items-center" }, { children: [(0, jsx_runtime_1.jsx)(icons_1.HomeIcon, { className: "mr-1.5" }), (0, jsx_runtime_1.jsx)("span", __assign({ className: "hidden sm:flex" }, { children: "Dashboard" }))] })), pageData && ((0, jsx_runtime_1.jsxs)("a", __assign({ href: "".concat(url, "/").concat(adminPath, "/post.php?post=").concat(pageData.id, "&action=edit"), target: "_blank", className: "flex items-center" }, { children: [(0, jsx_runtime_1.jsx)(icons_1.EditIcon, { className: "mr-1.5" }), "Edit Page"] }))), isPreview && ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({ color: "gray", className: "py-0.5 px-3 ml-auto", href: "/api/".concat(apiRouterBasePath, "/exit-preview?pathname=").concat(pageData.pathname), size: "small", openInNewTab: false }, { children: "Exit Preview" }))), pageData && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, classNames_1.classNames)("flex items-center gap-x-2", !isPreview && "ml-auto") }, { children: ["Status:", (0, jsx_runtime_1.jsx)("span", __assign({ className: "rounded-full bg-gray-100 text-gray-800 py-0.5 px-2 uppercase tracking-wide text-xs font-semibold" }, { children: status }))] })))] })) }))) }));
}
exports.AdminBar = AdminBar;
