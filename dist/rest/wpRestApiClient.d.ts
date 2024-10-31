import { type CMSInstance, type Plugin } from "cloakcms";
declare var wpapi: any;
export type WPClient = typeof wpapi;
export type ClientMutationFn = ({ client }: {
    client: WPClient;
}) => WPClient;
export interface RestApiClientConfig {
    auth?: {
        jwt?: string;
        dangerouslyIgnoreExposedJwtWarning?: boolean;
    };
    wpapiOptions?: Record<string, any>;
    clientMutations?: ClientMutationFn[];
    plugins?: Plugin<RestApiClientConfig>[];
}
export declare const wpRestApiClient: (options: RestApiClientConfig) => (incomingConfig: CMSInstance) => Promise<{
    client: () => any;
    url: `http://${string}` | `https://${string}`;
    adminPath: `/${string}`;
    contentPath: `/${string}`;
    name?: string;
    blockRenderer?: import("cloakcms").BlockRenderer<(props: any) => any, any, Record<string, any>>;
    meta?: Record<string, any>;
    plugins?: Plugin<CMSInstance>[];
}>;
export {};
