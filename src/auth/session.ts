export const SESSION_COOKIE_ACCESS = "cloakwp_at";
export const SESSION_COOKIE_REFRESH = "cloakwp_rt";
export const SESSION_COOKIE_HINT = "cloakwp_ui";

export const SESSION_SECRET_HEADER = "X-CloakWP-Secret";

export const DEFAULT_LOGIN_PATH = "/__cloakwp/login";

export function parseCookieHeader(
  header: string | null | undefined,
): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) {
    return cookies;
  }

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) {
      continue;
    }
    const name = part.slice(0, separator).trim();
    if (!name) {
      continue;
    }
    try {
      cookies[name] = decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      cookies[name] = part.slice(separator + 1).trim();
    }
  }

  return cookies;
}

export function hasSessionHint(
  cookieHeader: string | null | undefined,
): boolean {
  return parseCookieHeader(cookieHeader)[SESSION_COOKIE_HINT] === "1";
}

export function wpAdminHandshakePath(wpAdminPath: string): string {
  const path = wpAdminPath.startsWith("/") ? wpAdminPath : `/${wpAdminPath}`;
  return `/api/cloakwp/auth/wp-admin?path=${encodeURIComponent(path)}`;
}
