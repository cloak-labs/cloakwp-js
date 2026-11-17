export const getPreviewParams = (revisionId, postId, postType) => {
    if (!/^[1-9]\d*$/.test(postId))
        return {
            error: 'A valid master post ID is required in "postId".',
        };
    if (revisionId && !/^[1-9]\d*$/.test(revisionId))
        return { error: 'Invalid "revisionId".' };
    if (!/^[a-z0-9_-]{1,20}$/.test(postType))
        return {
            error: 'A valid WordPress post type is required in "postType".',
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
