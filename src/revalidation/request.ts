import {
  bytesToHex,
  constantTimeEqual,
  hmacSha256,
} from "../auth/crypto.js";
import { normalizePathname } from "../rest/normalizePathname.js";

const MAX_REVALIDATE_PATHS = 100;
const SIGNATURE_MAX_AGE_SECONDS = 300;

export type RevalidationResult =
  | {
      path: string;
      status: "revalidated";
    }
  | {
      path: string;
      status: "invalid" | "error";
      error: string;
    };

export type ParsedRevalidationBody =
  | {
      valid: true;
      paths: string[];
      invalidResults: RevalidationResult[];
    }
  | {
      valid: false;
      error: string;
    };

export type RevalidationRequestOptions = {
  secret?: string;
  now?: number;
  revalidatePath: (path: string) => void | Promise<void>;
  scheduleCacheWarming: (paths: readonly string[]) => void;
};

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export function parseRevalidationBody(
  rawBody: string,
): ParsedRevalidationBody {
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { valid: false, error: "Request body must be valid JSON." };
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      valid: false,
      error: 'Request body must be an object with a "paths" array.',
    };
  }

  const paths = (body as Record<string, unknown>).paths;
  if (!Array.isArray(paths) || paths.length === 0) {
    return { valid: false, error: '"paths" must be a non-empty array.' };
  }
  if (paths.length > MAX_REVALIDATE_PATHS) {
    return {
      valid: false,
      error: `"paths" cannot contain more than ${MAX_REVALIDATE_PATHS} entries.`,
    };
  }

  const deduplicated = new Set<string>();
  const invalidResults: RevalidationResult[] = [];

  for (const value of paths) {
    const normalized = normalizePathname(value);
    if (!normalized) {
      invalidResults.push({
        path: typeof value === "string" ? value : String(value),
        status: "invalid",
        error:
          "Path must be a canonical absolute pathname without a query or hash.",
      });
      continue;
    }
    deduplicated.add(normalized);
  }

  return {
    valid: true,
    paths: Array.from(deduplicated),
    invalidResults,
  };
}

export async function verifyRevalidationRequest(
  request: Request,
  rawBody: string,
  secret: string | undefined,
  now = Date.now(),
): Promise<boolean> {
  if (!secret) {
    return false;
  }

  const authorization = request.headers.get("authorization");
  const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (bearer && constantTimeEqual(bearer, secret)) {
    return true;
  }

  const timestamp = request.headers.get("x-cloakwp-timestamp");
  const suppliedSignature = request.headers
    .get("x-cloakwp-signature")
    ?.replace(/^sha256=/i, "");
  if (!timestamp || !/^\d+$/.test(timestamp) || !suppliedSignature) {
    return false;
  }

  const timestampSeconds = Number(timestamp);
  if (
    !Number.isSafeInteger(timestampSeconds) ||
    Math.abs(Math.floor(now / 1000) - timestampSeconds) >
      SIGNATURE_MAX_AGE_SECONDS
  ) {
    return false;
  }

  const expectedSignature = bytesToHex(
    await hmacSha256(secret, `${timestamp}.${rawBody}`),
  );
  return constantTimeEqual(suppliedSignature.toLowerCase(), expectedSignature);
}

export async function handleRevalidationRequest(
  request: Request,
  options: RevalidationRequestOptions,
): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const rawBody = await request.text();
  if (
    !(await verifyRevalidationRequest(
      request,
      rawBody,
      options.secret,
      options.now,
    ))
  ) {
    return json({ error: "Unauthorized." }, 401);
  }

  const parsed = parseRevalidationBody(rawBody);
  if (parsed.valid === false) {
    return json({ error: parsed.error }, 400);
  }

  const results: RevalidationResult[] = [...parsed.invalidResults];
  const warmedPaths: string[] = [];

  for (const path of parsed.paths) {
    try {
      await options.revalidatePath(path);
      warmedPaths.push(path);
      results.push({ path, status: "revalidated" });
    } catch (error) {
      results.push({
        path,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (warmedPaths.length > 0) {
    options.scheduleCacheWarming(warmedPaths);
  }

  const hasInvalid = results.some((result) => result.status === "invalid");
  const hasError = results.some((result) => result.status === "error");
  const status =
    hasError || (hasInvalid && warmedPaths.length > 0)
      ? 207
      : hasInvalid
        ? 400
        : 200;

  return json(
    {
      ok: !hasInvalid && !hasError,
      results,
    },
    status,
  );
}
