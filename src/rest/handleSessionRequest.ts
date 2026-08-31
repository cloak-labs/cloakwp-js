import {
  DEFAULT_LOGIN_PATH,
  SESSION_COOKIE_ACCESS,
  SESSION_COOKIE_HINT,
  SESSION_COOKIE_REFRESH,
  SESSION_SECRET_HEADER,
  parseCookieHeader,
} from "../auth/session.js";

export type CloakWpSessionOptions = {
  wordpressUrl: string;
  secret: string;
  loginPath?: string;
};

type AuthorizePayload = {
  accessToken?: string;
  accessTokenExpiration?: number;
  refreshToken?: string;
  refreshTokenExpiration?: number;
  wpLoginCode?: string;
  wpLogoutCode?: string;
  error?: string;
  message?: string;
  code?: string;
};

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

function requestOrigin(request: Request): string {
  return new URL(request.url).origin;
}

function isSameOriginMutation(request: Request): boolean {
  const origin = request.headers.get("origin");
  const expected = requestOrigin(request);
  if (origin) {
    return origin === expected;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return false;
  }

  try {
    return new URL(referer).origin === expected;
  } catch {
    return false;
  }
}

async function readBody(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const parsed = (await request.json()) as Record<string, unknown>;
    const body: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed ?? {})) {
      if (value == null) {
        continue;
      }
      body[key] = String(value);
    }
    return body;
  }

  const text = await request.text();
  return Object.fromEntries(new URLSearchParams(text));
}

function cookieHeader(
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    maxAge: number;
    secure: boolean;
  },
): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${Math.max(0, Math.floor(options.maxAge))}`,
    "SameSite=Lax",
  ];
  if (options.httpOnly) {
    parts.push("HttpOnly");
  }
  if (options.secure) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

function appendSessionCookies(
  headers: Headers,
  payload: AuthorizePayload,
  secure: boolean,
): void {
  const now = Math.floor(Date.now() / 1000);
  const accessMaxAge = Math.max(
    0,
    (payload.accessTokenExpiration ?? now) - now,
  );
  const refreshMaxAge = Math.max(
    0,
    (payload.refreshTokenExpiration ?? now) - now,
  );

  if (payload.accessToken) {
    headers.append(
      "Set-Cookie",
      cookieHeader(SESSION_COOKIE_ACCESS, payload.accessToken, {
        httpOnly: true,
        maxAge: accessMaxAge,
        secure,
      }),
    );
  }
  if (payload.refreshToken) {
    headers.append(
      "Set-Cookie",
      cookieHeader(SESSION_COOKIE_REFRESH, payload.refreshToken, {
        httpOnly: true,
        maxAge: refreshMaxAge,
        secure,
      }),
    );
    headers.append(
      "Set-Cookie",
      cookieHeader(SESSION_COOKIE_HINT, "1", {
        httpOnly: false,
        maxAge: refreshMaxAge,
        secure,
      }),
    );
  }
}

function clearSessionCookies(headers: Headers, secure: boolean): void {
  const expired = { httpOnly: true, maxAge: 0, secure };
  headers.append(
    "Set-Cookie",
    cookieHeader(SESSION_COOKIE_ACCESS, "", expired),
  );
  headers.append(
    "Set-Cookie",
    cookieHeader(SESSION_COOKIE_REFRESH, "", expired),
  );
  headers.append(
    "Set-Cookie",
    cookieHeader(SESSION_COOKIE_HINT, "", { httpOnly: false, maxAge: 0, secure }),
  );
}

function wordpressRestUrl(wordpressUrl: string, path: string): string {
  return `${wordpressUrl.replace(/\/$/, "")}/wp-json/cloakwp${path}`;
}

function wordpressOrigin(wordpressUrl: string): string {
  return new URL(wordpressUrl).origin;
}

function loginRedirect(
  request: Request,
  loginPath: string,
  extra: Record<string, string>,
): Response {
  const url = new URL(loginPath, request.url);
  for (const [key, value] of Object.entries(extra)) {
    url.searchParams.set(key, value);
  }
  return new Response(null, {
    status: 303,
    headers: { Location: url.toString() },
  });
}

function safeFrontendRedirect(request: Request, candidate: string): string {
  const fallback = new URL("/", request.url).toString();
  try {
    const resolved = new URL(candidate, request.url);
    if (resolved.origin !== requestOrigin(request)) {
      return fallback;
    }
    return resolved.toString();
  } catch {
    return fallback;
  }
}

function wpAdminRedirect(wordpressUrl: string, path: string): string | null {
  const origin = wordpressOrigin(wordpressUrl);
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const target = new URL(normalized, `${origin}/`);
  if (target.origin !== origin || !target.pathname.startsWith("/wp-admin")) {
    return null;
  }
  return target.toString();
}

async function wordpressAuthorize(
  session: CloakWpSessionOptions,
  body: Record<string, string>,
): Promise<{ ok: boolean; status: number; payload: AuthorizePayload }> {
  const response = await fetch(
    wordpressRestUrl(session.wordpressUrl, "/auth/authorize"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [SESSION_SECRET_HEADER]: session.secret,
      },
      body: JSON.stringify(body),
    },
  );

  let payload: AuthorizePayload = {};
  try {
    payload = (await response.json()) as AuthorizePayload;
  } catch {
    payload = { error: "Invalid WordPress session response." };
  }

  return { ok: response.ok, status: response.status, payload };
}

function establishLocation(
  session: CloakWpSessionOptions,
  code: string,
  redirect: string,
  path: "/auth/establish-session" | "/auth/establish-logout" = "/auth/establish-session",
): string {
  const url = new URL(wordpressRestUrl(session.wordpressUrl, path));
  url.searchParams.set("code", code);
  url.searchParams.set("redirect", redirect);
  return url.toString();
}

export async function handleSessionRequest(
  request: Request,
  route: readonly string[],
  session: CloakWpSessionOptions,
): Promise<Response> {
  const action = route[1];
  const loginPath = session.loginPath || DEFAULT_LOGIN_PATH;
  const secure = new URL(request.url).protocol === "https:";
  const cookies = parseCookieHeader(request.headers.get("cookie"));

  if (!session.wordpressUrl || !session.secret) {
    return json({ error: "CloakWP session is not configured." }, 503);
  }

  switch (action) {
    case "authorize": {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed." }, 405);
      }
      if (!isSameOriginMutation(request)) {
        return json({ error: "Invalid origin." }, 403);
      }

      const body = await readBody(request);
      const grantType = body.grant_type || "password";
      const frontendRedirect = safeFrontendRedirect(
        request,
        body.redirect || "/",
      );

      const result = await wordpressAuthorize(session, {
        grant_type: grantType,
        username: body.username ?? "",
        password: body.password ?? "",
        refresh_token: body.refresh_token || cookies[SESSION_COOKIE_REFRESH] || "",
        code: body.code ?? "",
      });

      if (!result.ok || !result.payload.wpLoginCode) {
        if (grantType === "password") {
          return loginRedirect(request, loginPath, {
            error: "invalid",
            redirect: new URL(frontendRedirect).pathname,
          });
        }
        return json(
          { error: result.payload.message || result.payload.error || "Unauthorized." },
          result.status || 401,
        );
      }

      const headers = new Headers({
        Location: establishLocation(
          session,
          result.payload.wpLoginCode,
          frontendRedirect,
        ),
      });
      appendSessionCookies(headers, result.payload, secure);
      return new Response(null, { status: 302, headers });
    }

    case "token": {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed." }, 405);
      }
      if (!isSameOriginMutation(request)) {
        return json({ error: "Invalid origin." }, 403);
      }

      const body = await readBody(request);
      const refreshToken =
        body.refresh_token || cookies[SESSION_COOKIE_REFRESH] || "";
      const result = await wordpressAuthorize(session, {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });
      if (!result.ok) {
        const headers = new Headers({ "Content-Type": "application/json" });
        clearSessionCookies(headers, secure);
        return new Response(
          JSON.stringify({
            error: result.payload.message || result.payload.error || "Unauthorized.",
          }),
          {
            status: result.status || 401,
            headers,
          },
        );
      }

      const headers = new Headers({ "Content-Type": "application/json" });
      appendSessionCookies(headers, result.payload, secure);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    case "logout": {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed." }, 405);
      }
      if (!isSameOriginMutation(request)) {
        return json({ error: "Invalid origin." }, 403);
      }

      const url = new URL(request.url);
      const frontendRedirect = safeFrontendRedirect(
        request,
        url.searchParams.get("redirect") || "/",
      );
      const refreshToken = cookies[SESSION_COOKIE_REFRESH] || "";
      const headers = new Headers();
      clearSessionCookies(headers, secure);

      if (refreshToken) {
        const response = await fetch(
          wordpressRestUrl(session.wordpressUrl, "/auth/logout"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              [SESSION_SECRET_HEADER]: session.secret,
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          },
        );
        let payload: AuthorizePayload = {};
        try {
          payload = (await response.json()) as AuthorizePayload;
        } catch {
          payload = {};
        }
        if (payload.wpLogoutCode) {
          headers.set(
            "Location",
            establishLocation(
              session,
              payload.wpLogoutCode,
              frontendRedirect,
              "/auth/establish-logout",
            ),
          );
          return new Response(null, { status: 302, headers });
        }
      }

      headers.set("Location", frontendRedirect);
      return new Response(null, { status: 302, headers });
    }

    case "wp-admin": {
      const path = new URL(request.url).searchParams.get("path") || "/wp-admin/";
      const redirect = wpAdminRedirect(session.wordpressUrl, path);
      if (!redirect) {
        return json({ error: "Invalid wp-admin path." }, 400);
      }

      const refreshToken = cookies[SESSION_COOKIE_REFRESH] || "";
      if (!refreshToken) {
        return loginRedirect(request, loginPath, {
          redirect: `/api/cloakwp/auth/wp-admin?path=${encodeURIComponent(path)}`,
        });
      }

      const result = await wordpressAuthorize(session, {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });
      if (!result.ok || !result.payload.wpLoginCode) {
        const headers = new Headers();
        clearSessionCookies(headers, secure);
        headers.set(
          "Location",
          loginRedirect(request, loginPath, {
            redirect: `/api/cloakwp/auth/wp-admin?path=${encodeURIComponent(path)}`,
          }).headers.get("Location") ?? loginPath,
        );
        return new Response(null, { status: 303, headers });
      }

      const headers = new Headers({
        Location: establishLocation(
          session,
          result.payload.wpLoginCode,
          redirect,
        ),
      });
      appendSessionCookies(headers, result.payload, secure);
      return new Response(null, { status: 302, headers });
    }

    default:
      return json({ error: "Not found." }, 404);
  }
}
