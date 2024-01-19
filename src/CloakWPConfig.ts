export interface CloakWPConfig {
  apiRouterBasePath?: string;
}

let _config: CloakWPConfig = {
  // set defaults:
  apiRouterBasePath: "/api/cloakwp",
};

export function setCloakWPConfig(config: CloakWPConfig) {
  _config = {
    ..._config,
    ...config,
  };
}

export function getCloakWPConfig(): CloakWPConfig {
  return _config;
}
