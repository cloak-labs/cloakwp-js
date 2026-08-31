import { type RevalidationRequestOptions } from "../revalidation/request.js";
import { type CloakWpSessionOptions } from "./handleSessionRequest.js";
export type EnablePreviewInput = {
    data: {
        revisionId: string;
        postId: string;
        apiMethod: string;
        postType: string;
    };
    pathname: string;
    maxAge: number;
};
export type CloakWpRequestHandlerOptions = RevalidationRequestOptions & {
    route: readonly string[];
    enablePreviewMode: (input: EnablePreviewInput) => void | Promise<void>;
    exitPreviewMode: (pathname: string) => void | Promise<void>;
    session?: CloakWpSessionOptions;
};
export type { CloakWpSessionOptions } from "./handleSessionRequest.js";
export declare function handleCloakWpRequest(request: Request, options: CloakWpRequestHandlerOptions): Promise<Response>;
//# sourceMappingURL=handleCloakWpRequest.d.ts.map