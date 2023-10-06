import WPInstance from "../WPInstance";

export interface CloakConfig {
  wpInstances: WPInstance[];
  apiRouterBasePath?: string;
}

let config: CloakConfig;

export function setCloakConfig(_config: CloakConfig) {
  if (config) return; // don't allow setting config more than once

  config = {
    apiRouterBasePath: "cloakwp",
    ..._config,
  };
}

export function getCloakConfig(): CloakConfig {
  if (!config) throw Error("Called getCloakConfig() before setCloakConfig()");
  return config;
}

export function getWpInstance(name?: string): WPInstance {
  if (!config) throw Error("Called getWpInstance() before setCloakConfig()");
  if (!config?.wpInstances || !config?.wpInstances?.length)
    throw Error(
      "Called getWpInstance() without setting `wpInstances` in your CloakWP config"
    );

  return name
    ? config.wpInstances.find((wp) => wp.getName() == name)
    : config.wpInstances[0]; // return 1st instance if `name` not provided
}
