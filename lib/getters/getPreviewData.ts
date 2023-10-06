import { useFetchRestAPI } from "../hooks/useFetchRestAPI";

export async function getPreviewData(previewParams) {
  const { revisionId = null, postId, postTypeRestEndpoint, ...rest } = previewParams.post

  let data
  if(revisionId){
    data = await useFetchRestAPI(`/${postTypeRestEndpoint}/${postId}/revisions/${revisionId}`);
  } else {
    // if no revisionId is provided, we fetch all revisions and return the latest one
    data = await useFetchRestAPI(`/${postTypeRestEndpoint}/${postId}/revisions/`);
    data = Array.isArray(data) ? data[0] : data
  }
  
  // If no revision is found for the given revisionId, we fetch and show the published post data instead:
  if(!data || data?.data?.status == 404) {
    data = await useFetchRestAPI(`/${postTypeRestEndpoint}/${postId}`);
  }

  return {
    data,
    params: {
      revisionId,
      postId,
      postTypeRestEndpoint,
      ...rest
    }
  }
}