import { getCMSInstance } from "cloakcms";
import { PreviewModeParams } from "./types";

export async function getPreviewData(
  previewParams: PreviewModeParams,
  serverApiClient?: any // TODO: type this to WPAPI client once that package is TS
): Promise<Record<string, any>> {
  const { revisionId = null, postId, apiMethod } = previewParams;

  const wp = serverApiClient ?? getCMSInstance().client();
  const page = wp[apiMethod]?.().id(postId);

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
