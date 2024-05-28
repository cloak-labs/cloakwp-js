import { type Plugin } from "cloakcms";
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
export declare const wpRestApiClient: (options: RestApiClientConfig) => (incomingConfig: CMSInstance) => Promise<any>;
export {};
