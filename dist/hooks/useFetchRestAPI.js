"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchRestAPI = void 0;
var useGlobalConfig_1 = require("./useGlobalConfig");
function useFetchRestAPI(endpoint, // api URL endpoint that comes after `wp-json/wp/v2` (include first slash)
options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _c, embed, _d, convertToRelativeURLs, _e, apiNamespace, _f, includeJwt, _g, dataSource, config, sourceConfig, url, jwt, contentPath, headers, embedParam, fetchUrl, res, posts, postsString, hasTrailingSlash, wpUrl;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _c = options.embed, embed = _c === void 0 ? true : _c, _d = options.convertToRelativeURLs, convertToRelativeURLs = _d === void 0 ? true : _d, _e = options.apiNamespace, apiNamespace = _e === void 0 ? "wp-json/wp/v2" : _e, _f = options.includeJwt, includeJwt = _f === void 0 ? true : _f, _g = options.dataSource, dataSource = _g === void 0 ? 'default' : _g;
                    if (!endpoint)
                        throw new Error('You must pass in an endpoint to useFetchRestAPI');
                    return [4 /*yield*/, (0, useGlobalConfig_1.useGlobalConfig)()];
                case 1:
                    config = _h.sent();
                    sourceConfig = (_a = config === null || config === void 0 ? void 0 : config.sources) === null || _a === void 0 ? void 0 : _a[dataSource];
                    if (!sourceConfig)
                        throw new Error("The WordPress data source \"".concat(dataSource, "\" is missing from your cloakwp.config.js -- so there's nothing to fetch from."));
                    url = sourceConfig.url, jwt = sourceConfig.jwt, contentPath = sourceConfig.contentPath;
                    if (!url)
                        throw new Error("The WordPress URL for the data source \"".concat(dataSource, "\" is missing from your cloakwp.config.js -- this is required to use useFetchRestAPI."));
                    headers = {
                        'Content-Type': 'application/json',
                    };
                    // The JWT isn't required for all requests, only protected routes such as post revisions
                    if (includeJwt && jwt)
                        headers['Authorization'] = "Bearer ".concat(jwt);
                    embedParam = '';
                    if (embed) {
                        if (endpoint.includes('?'))
                            embedParam = '&_embed=';
                        else
                            embedParam = '?_embed=';
                    }
                    if (url.slice(-1) != "/")
                        url += '/'; // add trailing slash if missing
                    fetchUrl = "".concat(url).concat(apiNamespace).concat(endpoint).concat(embedParam);
                    return [4 /*yield*/, fetch(fetchUrl, {
                            headers: headers,
                            method: 'GET',
                        })];
                case 2:
                    res = _h.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    posts = _h.sent();
                    if (posts.errors)
                        throw new Error("Failed to fetch data from WP REST API at \"".concat(fetchUrl, "\" -- Error: ").concat(posts.errors));
                    if (res.status !== 200) {
                        console.error(res.status, res.statusText);
                    }
                    if (posts && convertToRelativeURLs) { // remove all references to WP URL in data
                        postsString = JSON.stringify(posts);
                        hasTrailingSlash = url.slice(-1) == '/';
                        wpUrl = hasTrailingSlash ? url.slice(0, -1) : url;
                        // remove all references to WordPress URL but then add them back for any URLs referencing content under /wp-content folder, where the WP URL reference is required
                        postsString = (_b = postsString === null || postsString === void 0 ? void 0 : postsString.replaceAll(wpUrl, '')) === null || _b === void 0 ? void 0 : _b.replaceAll("/".concat(contentPath), "".concat(wpUrl, "/").concat(contentPath));
                        posts = JSON.parse(postsString);
                    }
                    return [2 /*return*/, posts];
            }
        });
    });
}
exports.useFetchRestAPI = useFetchRestAPI;
