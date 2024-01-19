import { RestApiClientConfig } from "./wpRestApiClient";
export declare const registerCloakWPMethods: (incomingConfig: RestApiClientConfig) => {
    clientMutations: import("./wpRestApiClient").ClientMutationFn[];
    auth?: {
        jwt?: string;
        dangerouslyIgnoreExposedJwtWarning?: boolean;
    };
    wpapiOptions?: Record<string, any>;
    plugins?: import("cloakcms").Plugin<RestApiClientConfig>[];
};
