export const isUserLoggedIn = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      // `/api/cloakwp/is-authenticated?XDEBUG_TRIGGER`, // useful for debugging, but not ideal to leave on as the parameter's presence slows down the response considerably.
      `/api/cloakwp/is-authenticated`,
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
