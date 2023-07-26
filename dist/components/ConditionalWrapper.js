"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Code taken from: https://blog.hackages.io/conditionally-wrap-an-element-in-react-a8b9a47fab2
var ConditionalWrapper = function (_a) {
    var condition = _a.condition, wrapper = _a.wrapper, children = _a.children, args = _a.args;
    var passesCondition = (typeof condition === "function") ? condition() : condition;
    return passesCondition ? wrapper(children, args) : children;
};
exports.default = ConditionalWrapper;
