export const registerCloakWPMethods = (incomingConfig) => {
    return {
        ...incomingConfig,
        clientMutations: [
            ...(incomingConfig.clientMutations ?? []),
            ({ client }) => {
                if (!client)
                    return;
                client.menus = client.registerRoute("cloakwp", "/menus/(?P<id>[a-zA-Z0-9-]+)");
                client.globals = client.registerRoute("cloakwp", "/globals/(?P<id>[a-zA-Z0-9_-]+)");
                client.frontpage = client.registerRoute("cloakwp", "/frontpage");
                return client;
            },
        ],
    };
};
