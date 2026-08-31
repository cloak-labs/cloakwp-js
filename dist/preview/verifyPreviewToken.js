import { base64UrlToBytes, constantTimeBytesEqual, hmacSha256, } from "../auth/crypto.js";
const textDecoder = new TextDecoder();
function isPreviewTokenPayload(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }
    const payload = value;
    return (typeof payload.previewKey === "string" &&
        payload.previewKey.length > 0 &&
        typeof payload.pathname === "string" &&
        payload.pathname.startsWith("/") &&
        Number.isSafeInteger(payload.exp) &&
        payload.exp > 0);
}
export async function verifyPreviewToken(token, secret, { now = Date.now(), clockSkewSeconds = 30, } = {}) {
    if (!token) {
        return { valid: false, error: "missing-token" };
    }
    if (!secret) {
        return { valid: false, error: "missing-secret" };
    }
    const segments = token.split(".");
    if (segments.length !== 2) {
        return { valid: false, error: "malformed-token" };
    }
    const [encodedPayload, encodedSignature] = segments;
    const payloadBytes = base64UrlToBytes(encodedPayload);
    const suppliedSignature = base64UrlToBytes(encodedSignature);
    if (!payloadBytes || !suppliedSignature || suppliedSignature.length !== 32) {
        return { valid: false, error: "malformed-token" };
    }
    const expectedSignature = await hmacSha256(secret, encodedPayload);
    if (!constantTimeBytesEqual(suppliedSignature, expectedSignature)) {
        return { valid: false, error: "invalid-signature" };
    }
    let payload;
    try {
        payload = JSON.parse(textDecoder.decode(payloadBytes));
    }
    catch {
        return { valid: false, error: "invalid-payload" };
    }
    if (!isPreviewTokenPayload(payload)) {
        return { valid: false, error: "invalid-payload" };
    }
    const nowSeconds = Math.floor(now / 1000);
    if (payload.exp + clockSkewSeconds < nowSeconds) {
        return { valid: false, error: "expired-token" };
    }
    return { valid: true, payload };
}
