import { verifyPreviewToken } from "../preview/verifyPreviewToken.js";
import { handleRevalidationRequest, } from "../revalidation/request.js";
import { handleSessionRequest, } from "./handleSessionRequest.js";
import { normalizePathname } from "./normalizePathname.js";
function json(data, status = 200) {
    return Response.json(data, { status });
}
function getPreviewParams(revisionId, postId, postType) {
    if (!postId) {
        return { error: "A master post ID was not supplied." };
    }
    if (!postType) {
        return { error: "A post type was not supplied." };
    }
    const apiMethod = postType === "page" ? "pages" : postType === "post" ? "posts" : postType;
    return {
        revisionId,
        postId,
        apiMethod,
        postType,
    };
}
export async function handleCloakWpRequest(request, options) {
    const route = options.route[0];
    const url = new URL(request.url);
    switch (route) {
        case "revalidate":
            return handleRevalidationRequest(request, options);
        case "preview": {
            const verification = await verifyPreviewToken(url.searchParams.get("token"), options.secret, { now: options.now });
            if (!verification.valid) {
                return json({ error: "Unauthorized." }, 401);
            }
            const pathname = normalizePathname(url.searchParams.get("pathname"));
            if (!pathname || pathname !== verification.payload.pathname) {
                return json({ error: "Invalid preview pathname." }, 400);
            }
            const params = getPreviewParams(url.searchParams.get("revisionId") ?? "", url.searchParams.get("postId") ?? "", url.searchParams.get("postType") ?? "");
            if ("error" in params) {
                return json({ error: params.error }, 400);
            }
            if (verification.payload.previewKey !== `post-${params.postId}`) {
                return json({ error: "Preview token does not match the requested post." }, 401);
            }
            await options.enablePreviewMode({
                data: params,
                pathname,
                maxAge: 60 * 60,
            });
            return new Response(null, {
                status: 307,
                headers: { Location: pathname },
            });
        }
        case "exit-preview": {
            const pathname = normalizePathname(url.searchParams.get("pathname"));
            if (!pathname) {
                return json({ error: "Invalid preview pathname." }, 400);
            }
            await options.exitPreviewMode(pathname);
            return new Response(null, {
                status: 307,
                headers: { Location: pathname },
            });
        }
        case "auth": {
            if (!options.session) {
                return json({ error: "CloakWP session is not configured." }, 503);
            }
            return handleSessionRequest(request, options.route, options.session);
        }
        default:
            return json({ error: "Not found." }, 404);
    }
}
