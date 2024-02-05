export * from "./types";

// Bundle `cloakcms` into `cloakwp` so users don't need to install it:
export * from "cloakcms";

export { WPBlockRenderer } from "./WPBlockRenderer";

export { wpBlockStyleBuilder } from "./wpBlockStyleBuilder";

// CMSInstance Plugins
// export {
//   wpRestApiClient,
//   RestApiClientConfig,
//   ClientMutationFn,
//   WPClient
// } from "./plugins/wpRestApiClient";
// export { registerCloakWPMethods } from "./plugins/registerCloakWPMethods";

// Config
export { setCloakWPConfig, getCloakWPConfig } from "./CloakWPConfig";

// Utils
export { generateSitemap } from "./utils/generateSitemap";
export { getPreviewData } from "./utils/getPreviewData";
export { getPreviewParams } from "./utils/getPreviewParams";
export { validateRouteSecretToken } from "./utils/validateRouteSecretToken";
export { isUserLoggedIn } from "./utils/isUserLoggedIn";
export {
  sendBlockHeightToWP,
  getDocumentHeight,
  handleWPBlockIframeMessage,
  watchForDocumentHeightChanges,
} from "./utils/acfBlockDecoupledPreview";
