"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryParamsString = void 0;
var getQueryParamsString = function (queryParams, url) {
    var _a;
    if (url === void 0) { url = ''; }
    var queryParamsString = '';
    if (typeof queryParams === 'object' &&
        !Array.isArray(queryParams) &&
        queryParams !== null) {
        // queryParams is an object
        (_a = Object.entries(queryParams)) === null || _a === void 0 ? void 0 : _a.forEach(function (param, i) {
            var firstParam = i == 0 && !url.includes('?');
            queryParamsString += "".concat(firstParam ? '?' : (i == 0 && url.endsWith('?') ? '' : '&')).concat(param[0], "=").concat(param[1]);
        });
    }
    else if (queryParams && typeof queryParams === 'string') {
        queryParamsString = queryParams;
        if (!url.includes('?')) {
            if (!queryParams.startsWith('?'))
                queryParamsString = '?' + queryParams;
        }
        else {
            if (!queryParams.startsWith('&') && !url.endsWith('?'))
                queryParamsString = '&' + queryParams;
        }
    }
    return queryParamsString;
};
exports.getQueryParamsString = getQueryParamsString;
