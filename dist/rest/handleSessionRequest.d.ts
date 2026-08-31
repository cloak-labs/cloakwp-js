export type CloakWpSessionOptions = {
    wordpressUrl: string;
    secret: string;
    loginPath?: string;
};
export declare function handleSessionRequest(request: Request, route: readonly string[], session: CloakWpSessionOptions): Promise<Response>;
//# sourceMappingURL=handleSessionRequest.d.ts.map