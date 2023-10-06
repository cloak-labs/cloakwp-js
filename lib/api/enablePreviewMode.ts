import { getWpInstance } from "../config";
// import { getPost } from "../getters/getPost";

export default async function enablePreviewMode(req, res) {
  console.log("=== ENABLE PREVIEW ===");
  // console.log({ query: req.query });
  const wp = getWpInstance().serverApi();

  let { revisionId, postId, postType } = req.query;

  // if (postId == 0 || postId == "0") {
  //   postId = `${revisionId}`; // this fixes previewing a draft or a post that doesn't have a revision.. string interpolation is used to *copy* revisionId rather than reference it
  //   revisionId = null;
  // }

  // if (!revisionId) return res.status(401).json({ message: 'A post revision ID was not supplied -- pass it in via a "revisionId" parameter.' });
  if (!postId)
    return res.status(401).json({
      message:
        'A master post ID was not supplied -- pass it in via a "postId" parameter.',
    });

  if (!postType)
    return res.status(401).json({
      message:
        'A post type was not supplied -- pass it in via a "postType" parameter.',
    });

  let postTypeRestEndpoint = postType;
  if (postType == "page") postTypeRestEndpoint = "pages";
  else if (postType == "post") postTypeRestEndpoint = "posts";

  // TODO: if revisionId is null, ping /.../revisions and take the first (most recent) one, and use that as preview data
  const request = wp[postTypeRestEndpoint]?.().id(postId);
  let revision;
  if (revisionId) {
    revision = await request.revisions(revisionId).get();
  } else {
    revision = await request.revisions().single().get();
  }

  console.log({ revision });

  // Fetch WordPress to check if the provided `id` or `slug` exists
  // const {
  //   data: { pathname },
  // } = await getPost({
  //   postType: postTypeRestEndpoint,
  //   id: postId,
  // });

  if (!revision) {
    return res.status(401).json({
      message: `Post of type "${postType}" with ID "${postId}" does not have any unpublished revisions to preview.`,
    });
  }

  // If the post doesn't exist prevent preview mode from being enabled
  if (!revision.pathname) {
    return res.status(401).json({
      message: `Post of type "${postType}" with ID "${postId}" is missing a pathname, so we abandoned preview mode.`,
    });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(
    {
      // post: {
      // pathname,
      ...revision,
      // revisionId,
      // postId,
      postType,
      postTypeRestEndpoint,
      // },
    },
    {
      maxAge: 60 * 60, // The preview mode cookies expire in 1 hour
      path: revision.pathname, // The preview mode cookies apply to the page we're previewing (visiting any other page turns off preview mode)
    }
  );

  // Redirect to the path from the fetched post
  // We don't redirect to `req.query.slug` as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: revision.pathname });
  res.end();
}
