import { type CMSInstance, type Plugin } from "cloakcms";
import { type RestApiClientConfig, type WPClient } from "./types";
export declare const wpRestApiClient: (options: RestApiClientConfig) => (incomingConfig: CMSInstance) => Promise<{
    client: () => WPClient;
    url: `http://${string}` | `https://${string}`;
    adminPath: `/${string}`;
    contentPath: `/${string}`;
    name?: string;
    blockRenderer?: import("cloakcms").BlockRenderer<(props: any) => any, any, Record<string, any>>;
    meta?: Record<string, any>;
    plugins?: Plugin<CMSInstance>[];
}>;
