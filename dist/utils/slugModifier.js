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
exports.slugModifier = void 0;
var useGlobalConfig_1 = require("../hooks/useGlobalConfig");
/* Function definition:
  slugModifier() takes an array of posts (or a single post object), and modifies each post's slug based on your CloakWP config option "postBaseSlugs".
  'postBaseSlugs' allows you to specify that certain post type slugs should get prepended with a sub-directory. If you specify in your Next.js routing that blog posts live under the '/blog/' route,
  you must specify 'postBaseSlugs': { post: 'blog/' } in your cloakwp.config.js file. This ensures any time you fetch blog posts from WordPress, each post's slug property gets prepended with 'blog/',
  which ensures all internal linking and static revalidation works as expected. This is required because WordPress doesn't know about your Next.js routing strategy, and doesn't ever prepend the 'slug' property of posts with the correct sub-route.
*/
function slugModifier(posts) {
    return __awaiter(this, void 0, void 0, function () {
        var config, postBaseSlugs, convertedToArray;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, useGlobalConfig_1.useGlobalConfig)()];
                case 1:
                    config = _a.sent();
                    postBaseSlugs = config.postBaseSlugs;
                    if (!postBaseSlugs)
                        return [2 /*return*/, posts
                            // the package user has provided baseSlugs to prepend to certain post type slugs, which we do below:
                        ];
                    convertedToArray = false;
                    if (!Array.isArray(posts)) {
                        convertedToArray = true;
                        posts = [posts];
                    }
                    posts = posts.map(function (post) {
                        // modify post object's slug:
                        if (post && post.type && postBaseSlugs[post.type]) {
                            post.slug = "".concat(postBaseSlugs[post.type]).concat(post.slug);
                        }
                        // modify any post slugs for any posts in ACF relationship/page_link/post_object fields
                        if (post.has_blocks && post.blocksData && post.blocksData.length) {
                            post.blocksData.map(function (block) {
                                if (block.attrs.hasRelationshipFields) {
                                    // let blockFieldValues = Object.values(block.attrs.data)
                                    var blockFields = Object.entries(block.attrs.data);
                                    blockFields = blockFields.map(function (_a) {
                                        var key = _a[0], val = _a[1];
                                        if (val && val.value && (val.type == 'relationship' || val.type == 'page_link' || val.type == 'post_object')) {
                                            val.value = val.value.map(function (relatedPost) {
                                                if (relatedPost && relatedPost.post_type && postBaseSlugs[relatedPost.post_type]) {
                                                    relatedPost.slug = "".concat(postBaseSlugs[relatedPost.post_type]).concat(relatedPost.post_name);
                                                }
                                                return relatedPost;
                                            });
                                        }
                                        return [key, val];
                                    });
                                    block.attrs.data = Object.fromEntries(blockFields);
                                }
                                return block;
                            });
                        }
                        return post;
                    });
                    return [2 /*return*/, posts.length > 1 ? posts : (convertedToArray ? posts[0] : posts)];
            }
        });
    });
}
exports.slugModifier = slugModifier;
