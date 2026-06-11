"use client";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "yclid"] as const;
type UtmKey = (typeof UTM_KEYS)[number];
export type UtmPayload = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "nk_utm";

export function captureUtmFromLocation(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const next: UtmPayload = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) next[key] = value.slice(0, 300);
  }

  if (Object.keys(next).length > 0) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}

export function readUtm(): UtmPayload {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const live: UtmPayload = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) live[key] = value.slice(0, 300);
  }

  if (Object.keys(live).length > 0) return live;

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}") as UtmPayload;
  } catch {
    return {};
  }
}
