export type RevalidationResult = {
    path: string;
    status: "revalidated";
} | {
    path: string;
    status: "invalid" | "error";
    error: string;
};
export type ParsedRevalidationBody = {
    valid: true;
    paths: string[];
    invalidResults: RevalidationResult[];
} | {
    valid: false;
    error: string;
};
export type RevalidationRequestOptions = {
    secret?: string;
    now?: number;
    revalidatePath: (path: string) => void | Promise<void>;
    scheduleCacheWarming: (paths: readonly string[]) => void;
};
export declare function parseRevalidationBody(rawBody: string): ParsedRevalidationBody;
export declare function verifyRevalidationRequest(request: Request, rawBody: string, secret: string | undefined, now?: number): Promise<boolean>;
export declare function handleRevalidationRequest(request: Request, options: RevalidationRequestOptions): Promise<Response>;
//# sourceMappingURL=request.d.ts.map