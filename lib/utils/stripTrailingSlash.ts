export default function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}
