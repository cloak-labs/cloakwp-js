let warnedJwtFallback = false;
export function resetMachineAuthWarnings() {
    warnedJwtFallback = false;
}
function encodeBasicCredentials(user, password) {
    const raw = `${user}:${password}`;
    if (typeof Buffer !== "undefined") {
        return Buffer.from(raw, "utf8").toString("base64");
    }
    return btoa(raw);
}
export function assertMachineAuthNotExposed(auth, isBrowser) {
    if (!isBrowser || auth?.dangerouslyIgnoreExposedJwtWarning === true) {
        return;
    }
    if (auth?.jwt || auth?.applicationPassword) {
        throw new Error("You're exposing WordPress machine credentials (an application password or WP_JWT) to the browser. Store them in server-only environment variables and pass them into wpRestApiClient only on the server.");
    }
}
export function resolveMachineAuth(auth) {
    const user = auth?.applicationUser?.trim() ?? "";
    const password = auth?.applicationPassword ?? "";
    if (user && password) {
        return {
            authorization: `Basic ${encodeBasicCredentials(user, password)}`,
            scheme: "basic",
        };
    }
    const jwt = auth?.jwt ?? "";
    if (jwt) {
        if (!warnedJwtFallback) {
            warnedJwtFallback = true;
            console.warn("CloakWP: WP_JWT is a deprecated machine-auth fallback. Set WP_APPLICATION_USER and WP_APPLICATION_PASSWORD (WordPress Application Passwords) and redeploy. jwt-auth will be removed after every site has migrated.");
        }
        return {
            authorization: `Bearer ${jwt}`,
            scheme: "bearer",
        };
    }
    return { authorization: null, scheme: null };
}
