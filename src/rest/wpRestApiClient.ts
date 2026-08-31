import { withPlugins, type ContentSourceConfig } from "@cloakui/content-sources";
import {
  assertMachineAuthNotExposed,
  resolveMachineAuth,
} from "../auth/machineAuth.js";
import { type RestApiClientConfig, type WPClient } from "./types";

export const wpRestApiClient =
  (options: RestApiClientConfig) =>
  async (incomingConfig: ContentSourceConfig): Promise<ContentSourceConfig> => {
    const optionsAfterPlugins = await withPlugins(options, options.plugins);

    const { auth = {}, wpapiOptions = {}, clientMutations } = optionsAfterPlugins;

    assertMachineAuthNotExposed(auth, typeof window !== "undefined");

    const wpUrl =
      typeof incomingConfig.url === "string"
        ? incomingConfig.url
        : incomingConfig.url[incomingConfig.activeEnvironment];

    const wpapi = (await import("@cloakwp/wpapi/fetch")).default;
    let client: WPClient = new wpapi({
      endpoint: `${wpUrl}${incomingConfig.apiPath ?? "/wp-json"}`,
      ...wpapiOptions,
    });

    const { authorization } = resolveMachineAuth(auth);
    if (authorization) {
      client.setHeaders("Authorization", authorization);
    }

    if (clientMutations && clientMutations.length) {
      clientMutations.forEach((mutationFn) => {
        client = mutationFn({ client });
      });
    }

    return {
      ...incomingConfig,
      client: () => client,
    };
  };
