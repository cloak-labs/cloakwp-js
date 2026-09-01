export type PreviewTokenPayload = {
    previewKey: string;
    pathname: string;
    exp: number;
    wpOrigin?: string;
};
export type PreviewTokenVerification = {
    valid: true;
    payload: PreviewTokenPayload;
} | {
    valid: false;
    error: "missing-token" | "missing-secret" | "malformed-token" | "invalid-signature" | "invalid-payload" | "expired-token";
};
export type VerifyPreviewTokenOptions = {
    now?: number;
    clockSkewSeconds?: number;
};
export declare function verifyPreviewToken(token: string | null | undefined, secret: string | null | undefined, { now, clockSkewSeconds, }?: VerifyPreviewTokenOptions): Promise<PreviewTokenVerification>;
//# sourceMappingURL=verifyPreviewToken.d.ts.map