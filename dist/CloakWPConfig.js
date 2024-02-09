let _config = {
    // set defaults:
    apiRouterBasePath: "/api/cloakwp",
};
export function setCloakWPConfig(config) {
    _config = {
        ..._config,
        ...config,
    };
}
export function getCloakWPConfig() {
    return _config;
}
