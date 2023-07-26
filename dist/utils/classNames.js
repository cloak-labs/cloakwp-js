"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classNames = void 0;
var tailwind_merge_1 = require("tailwind-merge");
var classNames = function () {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return (0, tailwind_merge_1.twMerge)(classes.filter(Boolean).join(' '));
};
exports.classNames = classNames;
