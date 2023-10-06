import { useEffect, useState } from "react";
import { getCloakConfig } from "../config";

export function useUser() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getLoginStatus = async () => {
      const { apiRouterBasePath } = getCloakConfig();
      const response = await fetch(
        `/api/${apiRouterBasePath}/is-authenticated`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      setIsLoggedIn(data === true ? true : false);
    };

    getLoginStatus();
  }, []);

  return {
    isLoggedIn,
    // in future add other WP user data here if a WordPress admin user is logged in
  };
}
