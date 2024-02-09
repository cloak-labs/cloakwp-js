export const getPreviewParams = (revisionId, postId, postType) => {
    if (!postId)
        return {
            error: 'A master post ID was not supplied -- pass it in via a "postId" parameter.',
        };
    if (!postType)
        return {
            error: 'A post type was not supplied -- pass it in via a "postType" parameter.',
        };
    let apiMethod = postType;
    if (postType == "page")
        apiMethod = "pages";
    else if (postType == "post")
        apiMethod = "posts";
    return {
        revisionId,
        postId,
        apiMethod,
        postType,
    };
};
