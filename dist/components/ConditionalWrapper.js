"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConditionalWrapper = function (_a) {
    var condition = _a.condition, wrapper = _a.wrapper, children = _a.children, args = _a.args;
    var passesCondition = typeof condition === "function" ? condition() : condition;
    return passesCondition ? wrapper(children, args) : children;
};
exports.default = ConditionalWrapper;
