import { ContentSourceRegistry } from "cloakcms";
export async function getPreviewData(previewParams, serverApiClient // TODO: type this to WPAPI client once that package is TS
) {
    const { revisionId = null, postId, apiMethod } = previewParams;
    const wp = serverApiClient ?? ContentSourceRegistry.get().client();
    const page = wp[apiMethod]?.().id(postId);
    let revision;
    if (revisionId) {
        revision = await page.revisions(revisionId).get();
    }
    else {
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
