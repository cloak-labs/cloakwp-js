import { PreviewModeParams } from "../types";
import stripTrailingSlash from "../utils/stripTrailingSlash";

export default async function enablePreviewMode(req, res) {
  let { revisionId, postId, postType, pathname } = req.query;

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

  pathname = stripTrailingSlash(pathname); // important to remove trailing slash so preview cookies kick in on correct page

  const previewParams = {
    revisionId,
    postId,
    postTypeRestEndpoint,
    postType,
  } as PreviewModeParams;

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(previewParams, {
    maxAge: 60 * 60, // The preview mode cookies expire in 1 hour
    path: pathname, // The preview mode cookies apply to the page we're previewing (visiting any other page turns off preview mode)
  });

  // Redirect to the path of the post we're previewing
  res.writeHead(307, { Location: pathname });
  res.end();
}
