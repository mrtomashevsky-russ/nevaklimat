export function cleanString(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

export function cleanJson(value: unknown, maxBytes = 8192): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const json = JSON.stringify(value);
  if (Buffer.byteLength(json, "utf8") > maxBytes) return {};
  return JSON.parse(json) as Record<string, unknown>;
}
