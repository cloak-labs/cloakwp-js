"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreviewData = void 0;
const cloakcms_1 = require("cloakcms");
var WPAPI = require("@cloakwp/wpapi/fetch");
async function getPreviewData(previewParams, serverApiClient) {
    const { revisionId = null, postId, apiMethod } = previewParams;
    const wp = serverApiClient ?? (0, cloakcms_1.getCMSInstance)().client();
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
exports.getPreviewData = getPreviewData;
