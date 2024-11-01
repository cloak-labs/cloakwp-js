export const registerCloakWPMethods = (incomingConfig) => {
    return {
        ...incomingConfig,
        clientMutations: [
            ...(incomingConfig.clientMutations ?? []),
            ({ client }) => {
                if (!client)
                    return;
                client.menus = client.registerRoute("cloakwp", "/menus/(?P<id>[a-zA-Z0-9-]+)");
                client.options = client.registerRoute("cloakwp", "/options/(?P<id>[a-zA-Z0-9-]+)");
                client.isLoggedIn = client.registerRoute("cloakwp", "/is-logged-in");
                client.frontpage = client.registerRoute("cloakwp", "/frontpage");
                return client;
            },
        ],
    };
};
