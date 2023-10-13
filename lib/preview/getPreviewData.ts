import { getWpInstance } from "../config";
import { PreviewModeParams } from "../types";
var WPAPI = require("wpapi/fetch");

export async function getPreviewData(
  previewParams: PreviewModeParams,
  serverApiClient?: typeof WPAPI
) {
  const { revisionId = null, postId, postTypeRestEndpoint } = previewParams;

  const wp = serverApiClient ?? getWpInstance().serverApi();
  const page = wp[postTypeRestEndpoint]?.().id(postId);

  let revision;
  if (revisionId) {
    revision = await page.revisions(revisionId).get();
  } else {
    // get most recent revision if no revisionId is provided:
    revision = await page.revisions().single().get();
  }

  let pageData = revision;
  if (!revision || revision?.data?.status == 404) {
    // If no revision is found, we fetch and show the published post data instead:
    pageData = await page.get();
  }

  return pageData;
}
