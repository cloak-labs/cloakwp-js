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
var config_1 = require("../config");
// import { getPost } from "../getters/getPost";
function enablePreviewMode(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var wp, _b, revisionId, postId, postType, postTypeRestEndpoint, request, revision;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("=== ENABLE PREVIEW ===");
                    wp = (0, config_1.getWpInstance)().serverApi();
                    _b = req.query, revisionId = _b.revisionId, postId = _b.postId, postType = _b.postType;
                    // if (postId == 0 || postId == "0") {
                    //   postId = `${revisionId}`; // this fixes previewing a draft or a post that doesn't have a revision.. string interpolation is used to *copy* revisionId rather than reference it
                    //   revisionId = null;
                    // }
                    // if (!revisionId) return res.status(401).json({ message: 'A post revision ID was not supplied -- pass it in via a "revisionId" parameter.' });
                    if (!postId)
                        return [2 /*return*/, res.status(401).json({
                                message: 'A master post ID was not supplied -- pass it in via a "postId" parameter.',
                            })];
                    if (!postType)
                        return [2 /*return*/, res.status(401).json({
                                message: 'A post type was not supplied -- pass it in via a "postType" parameter.',
                            })];
                    postTypeRestEndpoint = postType;
                    if (postType == "page")
                        postTypeRestEndpoint = "pages";
                    else if (postType == "post")
                        postTypeRestEndpoint = "posts";
                    request = (_a = wp[postTypeRestEndpoint]) === null || _a === void 0 ? void 0 : _a.call(wp).id(postId);
                    if (!revisionId) return [3 /*break*/, 2];
                    return [4 /*yield*/, request.revisions(revisionId).get()];
                case 1:
                    revision = _c.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, request.revisions().single().get()];
                case 3:
                    revision = _c.sent();
                    _c.label = 4;
                case 4:
                    console.log({ revision: revision });
                    // Fetch WordPress to check if the provided `id` or `slug` exists
                    // const {
                    //   data: { pathname },
                    // } = await getPost({
                    //   postType: postTypeRestEndpoint,
                    //   id: postId,
                    // });
                    if (!revision) {
                        return [2 /*return*/, res.status(401).json({
                                message: "Post of type \"".concat(postType, "\" with ID \"").concat(postId, "\" does not have any unpublished revisions to preview."),
                            })];
                    }
                    // If the post doesn't exist prevent preview mode from being enabled
                    if (!revision.pathname) {
                        return [2 /*return*/, res.status(401).json({
                                message: "Post of type \"".concat(postType, "\" with ID \"").concat(postId, "\" is missing a pathname, so we abandoned preview mode."),
                            })];
                    }
                    // Enable Preview Mode by setting the cookies
                    res.setPreviewData(__assign(__assign({}, revision), { 
                        // revisionId,
                        // postId,
                        postType: postType, postTypeRestEndpoint: postTypeRestEndpoint }), {
                        maxAge: 60 * 60,
                        path: revision.pathname, // The preview mode cookies apply to the page we're previewing (visiting any other page turns off preview mode)
                    });
                    // Redirect to the path from the fetched post
                    // We don't redirect to `req.query.slug` as that might lead to open redirect vulnerabilities
                    res.writeHead(307, { Location: revision.pathname });
                    res.end();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = enablePreviewMode;
