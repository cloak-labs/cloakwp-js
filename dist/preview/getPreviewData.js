import { ContentSourceRegistry } from "@cloakui/content-sources";
import { getPreviewParams } from "./getPreviewParams.js";
function isMissing(error) {
    const err = error;
    return (err?.data?.status ?? err?.status) === 404;
}
async function optionalGet(request) {
    try {
        const result = await request.get();
        return isMissing(result) ? null : result;
    }
    catch (error) {
        if (isMissing(error))
            return null;
        throw error;
    }
}
async function getRestRoute(wp, postType) {
    if (postType === "page")
        return { namespace: "wp/v2", base: "pages" };
    if (postType === "post")
        return { namespace: "wp/v2", base: "posts" };
    // A post type slug is neither a WPAPI method name nor necessarily its REST base.
    const type = await optionalGet(wp.types().type(postType));
    if (!type ||
        typeof type.rest_namespace !== "string" ||
        typeof type.rest_base !== "string" ||
        !/^[\w-]+(?:\/[\w-]+)*$/.test(type.rest_namespace) ||
        !/^[\w-]+$/.test(type.rest_base)) {
        return null;
    }
    return { namespace: type.rest_namespace, base: type.rest_base };
}
/** Fetch an authorized preview by WP ID, even when its public slug doesn't exist. */
export async function getPreviewData(previewParams, serverApiClient) {
    const params = getPreviewParams(previewParams.revisionId, previewParams.postId, previewParams.postType);
    if ("error" in params)
        return null;
    const { revisionId, postId, postType } = params;
    const wp = serverApiClient ?? ContentSourceRegistry.get().client();
    const route = await getRestRoute(wp, postType);
    if (!route)
        return null;
    const { namespace, base } = route;
    const getPost = wp.registerRoute(namespace, `/${base}/(?P<id>\\d+)`);
    const post = await optionalGet(getPost.call(wp).id(postId));
    if (!post || !revisionId)
        return post;
    // CPTs can support editor autosaves without supporting ordinary revisions.
    // Both endpoints scope the requested revision to the authorized parent ID.
    for (const kind of ["autosaves", "revisions"]) {
        const getRevision = wp.registerRoute(namespace, `/${base}/(?P<parent>\\d+)/${kind}/(?P<id>\\d+)`);
        const revision = await optionalGet(getRevision.call(wp).parent(postId)[kind]().id(revisionId));
        if (revision) {
            // Revisions contain only revisioned fields; keep the parent's other data.
            const { title, content, excerpt, blocks_data } = revision;
            return {
                ...post,
                ...(title === undefined ? {} : { title }),
                ...(content === undefined ? {} : { content }),
                ...(excerpt === undefined ? {} : { excerpt }),
                ...(blocks_data === undefined ? {} : { blocks_data }),
            };
        }
    }
    return null;
}
