import { type ContentSourceConfig } from "cloakcms";
import { type RestApiClientConfig } from "./types";
export declare const wpRestApiClient: (options: RestApiClientConfig) => (incomingConfig: ContentSourceConfig) => Promise<ContentSourceConfig>;
