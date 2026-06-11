"use client";

import type { Recommendation } from "@/config/site";
import { readUtm } from "@/lib/utm";

declare global {
  interface Window {
    ym?: (counterId: number, method: string, goal: string, params?: Record<string, unknown>) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export type LeadInput = {
  phone: string;
  source: string;
  payload?: Record<string, unknown>;
  rec?: Recommendation;
  website?: string;
  startedAt?: number;
  captchaToken?: string;
};

export async function submitLead(input: LeadInput): Promise<void> {
  const body = {
    phone: input.phone,
    source: input.source,
    payload: input.payload,
    rec: input.rec,
    utm: readUtm(),
    page: window.location.pathname,
    referrer: document.referrer,
    ts: Date.now(),
    website: input.website || "",
    startedAt: input.startedAt,
    captchaToken: input.captchaToken
  };

  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Lead request failed: ${res.status}`);
  }

  trackLead(input.source);
}

function trackLead(source: string): void {
  const ymId = Number(process.env.NEXT_PUBLIC_YM_ID || 0);
  if (ymId && window.ym) window.ym(ymId, "reachGoal", "lead", { source });

  if (window.gtag) {
    window.gtag("event", "lead", {
      event_category: "lead",
      event_label: source,
      source
    });
  }
}
