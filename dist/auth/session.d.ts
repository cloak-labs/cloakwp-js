export declare const SESSION_COOKIE_ACCESS = "cloakwp_at";
export declare const SESSION_COOKIE_REFRESH = "cloakwp_rt";
export declare const SESSION_COOKIE_HINT = "cloakwp_ui";
export declare const SESSION_SECRET_HEADER = "X-CloakWP-Secret";
export declare const DEFAULT_LOGIN_PATH = "/__cloakwp/login";
export declare const DEFAULT_LOGOUT_PATH = "/__cloakwp/logout";
export declare function parseCookieHeader(header: string | null | undefined): Record<string, string>;
export declare function hasSessionHint(cookieHeader: string | null | undefined): boolean;
export declare function wpAdminHandshakePath(wpAdminPath: string): string;
/** True for `/wp-admin` and subdirectory multisite paths like `/hyland02/wp-admin/edit.php`. */
export declare function isWpAdminPath(pathname: string): boolean;
//# sourceMappingURL=session.d.ts.map