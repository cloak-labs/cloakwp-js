import { withPlugins, type CMSInstance, type Plugin } from "cloakcms";
import { type RestApiClientConfig, type WPClient } from "./types";

export const wpRestApiClient =
  (options: RestApiClientConfig) => async (incomingConfig: CMSInstance) => {
    const optionsAfterPlugins = await withPlugins(options, options.plugins);

    const {
      auth: { jwt, dangerouslyIgnoreExposedJwtWarning = false } = {},
      wpapiOptions = {},
      clientMutations,
    } = optionsAfterPlugins;

    if (
      typeof window !== "undefined" &&
      jwt &&
      dangerouslyIgnoreExposedJwtWarning !== true
    ) {
      throw Error(
        "You're exposing your JWT token to the client/browser, which is a major security concern. You should store it in a server-only ENV variable, then pass that variable into the `auth.jwt` option -- effectively making it `null` on the client side; yes, this means you should only make authenticated requests server-side."
      );
    }

    const wpapi = (await import("@cloakwp/wpapi/fetch")).default;
    let client: WPClient = new wpapi({
      endpoint: `${incomingConfig.url}/wp-json`,
      ...wpapiOptions,
    });

    if (jwt) {
      // add JWT authentication globally for all requests -- this API client should therefore only ever be used server-side so as to not expose the JWT value to the browser
      client.setHeaders("Authorization", `Bearer ${jwt}`);
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
