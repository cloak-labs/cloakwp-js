export declare const SESSION_COOKIE_ACCESS = "cloakwp_at";
export declare const SESSION_COOKIE_REFRESH = "cloakwp_rt";
export declare const SESSION_COOKIE_HINT = "cloakwp_ui";
export declare const SESSION_SECRET_HEADER = "X-CloakWP-Secret";
export declare const DEFAULT_LOGIN_PATH = "/__cloakwp/login";
export declare function parseCookieHeader(header: string | null | undefined): Record<string, string>;
export declare function hasSessionHint(cookieHeader: string | null | undefined): boolean;
export declare function wpAdminHandshakePath(wpAdminPath: string): string;
//# sourceMappingURL=session.d.ts.map