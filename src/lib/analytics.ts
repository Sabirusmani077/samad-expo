export function normalizeAnalyticsPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const path = value.split(/[?#]/, 1)[0].trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.length > 240) return null;
  if (path.startsWith("/api/") || path.startsWith("/admin/") || path === "/admin") return null;
  return path;
}

export function normalizeReferrerHost(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 253) return null;
  const host = value.trim().toLowerCase().replace(/\.$/, "");
  if (!host || /[^a-z0-9.:-]/.test(host)) return null;
  return host;
}

export function classifyTrafficSource(
  referrerHost: string | null,
  ownHost?: string
): "direct" | "referral" | "search" | "social" | "internal" {
  if (!referrerHost) return "direct";
  if (ownHost && referrerHost.toLowerCase() === ownHost.toLowerCase()) return "internal";
  if (/(^|\.)(google|bing|yahoo|duckduckgo|baidu)\./i.test(referrerHost)) return "search";
  if (/(^|\.)(facebook|instagram|linkedin|tiktok|x|twitter|youtube)\./i.test(referrerHost)) return "social";
  return "referral";
}
