import { useFetchRestAPI } from "../hooks/useFetchRestAPI";

// Function: returns all ACF Options data using CloakWP's custom /options endpoint created by the WP Plugin
export async function getACFOptions() {
  let res = await useFetchRestAPI(`/options`, {
    apiNamespace: "wp-json/cloakwp",
    embed: false,
    includeJwt: false
  });

  return res
}