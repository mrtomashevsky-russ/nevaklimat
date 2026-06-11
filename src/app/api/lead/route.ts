import { NextRequest, NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import { verifyCaptcha } from "@/lib/server/captcha";
import { sendToCrm } from "@/lib/server/crm";
import { saveLead } from "@/lib/server/db";
import type { StoredLead } from "@/lib/server/db";
import { notifyManagers } from "@/lib/server/notify";
import { enqueueOfflineConversion } from "@/lib/server/offline-conversions";
import { rateLimit } from "@/lib/server/rate-limit";
import { cleanJson, cleanString } from "@/lib/server/sanitize";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getIp(request);

  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (isBotByHoneypot(body) || isTooFast(body)) {
    console.warn("Lead filtered by anti-spam", { ip, source: cleanString(body.source, 160) });
    return NextResponse.json({ ok: true });
  }

  const captchaOk = await verifyCaptcha(cleanString(body.captchaToken, 300) || undefined);
  if (!captchaOk) {
    return NextResponse.json({ ok: false, error: "captcha_failed" }, { status: 403 });
  }

  const phoneRaw = cleanString(body.phone, 80);
  if (!phoneRaw) {
    return NextResponse.json({ ok: false, error: "phone_required" }, { status: 422 });
  }

  const phone = normalizePhone(phoneRaw);
  if (!phone.ok) {
    return NextResponse.json({ ok: false, error: "phone_invalid" }, { status: 422 });
  }

  const lead: StoredLead = {
    phone: phone.formatted,
    phoneNormalized: phone.normalized,
    source: cleanString(body.source, 180),
    payload: cleanJson(body.payload),
    rec: cleanJson(body.rec),
    utm: cleanJson(body.utm),
    page: cleanString(body.page, 300),
    referrer: cleanString(body.referrer, 500),
    ip,
    userAgent: request.headers.get("user-agent") || ""
  };

  try {
    await saveLead(lead);
    console.info("Lead saved", { phone: lead.phoneNormalized, source: lead.source, page: lead.page });
  } catch (error) {
    console.error("Lead DB save failed", error);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  const sideEffects = await Promise.allSettled([notifyManagers(lead), sendToCrm(lead), enqueueOfflineConversion(lead)]);
  for (const result of sideEffects) {
    if (result.status === "rejected") console.error("Lead side effect failed", result.reason);
  }

  return NextResponse.json({ ok: true });
}

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

function isBotByHoneypot(body: Record<string, unknown>): boolean {
  return Boolean(cleanString(body.website, 200) || cleanString(body.company, 200));
}

function isTooFast(body: Record<string, unknown>): boolean {
  const minFillMs = Number(process.env.LEAD_MIN_FILL_MS || 1200);
  const startedAt = Number(body.startedAt || 0);
  if (!startedAt) return false;
  return Date.now() - startedAt < minFillMs;
}
