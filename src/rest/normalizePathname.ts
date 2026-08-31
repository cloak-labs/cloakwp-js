export function normalizePathname(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > 2048 ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes(" ") ||
    value.includes("?") ||
    value.includes("#") ||
    /[\u0000-\u001F\u007F]/.test(value) ||
    /(?:^|\/)\.{1,2}(?:\/|$)/.test(value)
  ) {
    return null;
  }

  try {
    new URL(value, "https://cloakwp.invalid");
  } catch {
    return null;
  }

  return value !== "/" ? value.replace(/\/+$/, "") : "/";
}
