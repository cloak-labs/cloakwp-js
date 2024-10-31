import { getCloakWPConfig } from "../CloakWPConfig";

export const isUserLoggedIn = async (): Promise<boolean> => {
  const { apiRouterBasePath } = getCloakWPConfig();

  try {
    const response = await fetch(
      `${apiRouterBasePath}/is-authenticated?XDEBUG_TRIGGER`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    return data === true;
  } catch (error) {
    console.error(
      `Error while checking user's WP login status: ${error.message ?? error}`
    );
  }
  return false;
};
