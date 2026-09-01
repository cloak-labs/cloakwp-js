import {
  base64UrlToBytes,
  constantTimeBytesEqual,
  hmacSha256,
} from "../auth/crypto.js";

const textDecoder = new TextDecoder();

export type PreviewTokenPayload = {
  previewKey: string;
  pathname: string;
  exp: number;
  wpOrigin?: string;
};

export type PreviewTokenVerification =
  | {
      valid: true;
      payload: PreviewTokenPayload;
    }
  | {
      valid: false;
      error:
        | "missing-token"
        | "missing-secret"
        | "malformed-token"
        | "invalid-signature"
        | "invalid-payload"
        | "expired-token";
    };

export type VerifyPreviewTokenOptions = {
  now?: number;
  clockSkewSeconds?: number;
};

function isHttpOrigin(value: unknown): value is string {
  if (typeof value !== "string" || value === "") {
    return false;
  }
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.origin === value
    );
  } catch {
    return false;
  }
}

function isPreviewTokenPayload(value: unknown): value is PreviewTokenPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const payload = value as Record<string, unknown>;
  if (
    typeof payload.previewKey !== "string" ||
    payload.previewKey.length === 0 ||
    typeof payload.pathname !== "string" ||
    !payload.pathname.startsWith("/") ||
    !Number.isSafeInteger(payload.exp) ||
    (payload.exp as number) <= 0
  ) {
    return false;
  }

  if (payload.wpOrigin !== undefined && !isHttpOrigin(payload.wpOrigin)) {
    return false;
  }

  return true;
}

export async function verifyPreviewToken(
  token: string | null | undefined,
  secret: string | null | undefined,
  {
    now = Date.now(),
    clockSkewSeconds = 30,
  }: VerifyPreviewTokenOptions = {},
): Promise<PreviewTokenVerification> {
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

  let payload: unknown;
  try {
    payload = JSON.parse(textDecoder.decode(payloadBytes));
  } catch {
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
