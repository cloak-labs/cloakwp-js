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
exports.useGlobals = exports.GlobalsProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
/*
  A fairly generic Global Context utility that allows CloakWP users to wrap their app with <GlobalsProvider>,
  and pass in whatever props they want, which become accessible anywhere in their app via the useGlobals() hook.
  Common use-cases include passing in menu data and ACF Options data.
*/
var GlobalsContext = (0, react_1.createContext)({});
var GlobalsProvider = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return ((0, jsx_runtime_1.jsx)(GlobalsContext.Provider, __assign({ value: __assign({}, props // data from ACF Options page(s)
        ) }, { children: children })));
};
exports.GlobalsProvider = GlobalsProvider;
var useGlobals = function () { return (0, react_1.useContext)(GlobalsContext); };
exports.useGlobals = useGlobals;
