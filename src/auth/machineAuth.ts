export type MachineAuthScheme = "basic" | "bearer" | null;

export type MachineAuthConfig = {
  jwt?: string | null;
  applicationUser?: string | null;
  applicationPassword?: string | null;
  dangerouslyIgnoreExposedJwtWarning?: boolean;
};

export type ResolvedMachineAuth = {
  authorization: string | null;
  scheme: MachineAuthScheme;
};

let warnedJwtFallback = false;

export function resetMachineAuthWarnings(): void {
  warnedJwtFallback = false;
}

function encodeBasicCredentials(user: string, password: string): string {
  const raw = `${user}:${password}`;
  if (typeof Buffer !== "undefined") {
    return Buffer.from(raw, "utf8").toString("base64");
  }
  return btoa(raw);
}

export function assertMachineAuthNotExposed(
  auth: MachineAuthConfig | undefined,
  isBrowser: boolean,
): void {
  if (!isBrowser || auth?.dangerouslyIgnoreExposedJwtWarning === true) {
    return;
  }

  if (auth?.jwt || auth?.applicationPassword) {
    throw new Error(
      "You're exposing WordPress machine credentials (an application password or JWT) to the browser. Store them in server-only environment variables and pass them into wpRestApiClient only on the server.",
    );
  }
}

export function resolveMachineAuth(
  auth: MachineAuthConfig | undefined,
): ResolvedMachineAuth {
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
      console.warn(
        "CloakWP: WP_JWT is a deprecated machine-auth fallback. Set WP_APPLICATION_USER and WP_APPLICATION_PASSWORD (WordPress Application Passwords) and redeploy. jwt-auth will phase out.",
      );
    }
    return {
      authorization: `Bearer ${jwt}`,
      scheme: "bearer",
    };
  }

  return { authorization: null, scheme: null };
}
