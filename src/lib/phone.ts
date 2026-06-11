export function phoneDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.length === 10) digits = `7${digits}`;
  return digits.slice(0, 11);
}

export function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith("7")) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const p = digits.slice(1);
  let out = "+7";
  if (p.length > 0) out += ` (${p.slice(0, 3)}`;
  if (p.length >= 3) out += `) ${p.slice(3, 6)}`;
  if (p.length >= 6) out += `-${p.slice(6, 8)}`;
  if (p.length >= 8) out += `-${p.slice(8, 10)}`;
  return out;
}

export function phoneValid(raw: string): boolean {
  const digits = phoneDigits(raw);
  return digits.length === 11 && digits.startsWith("7");
}

export function normalizePhone(raw: string): { ok: true; formatted: string; normalized: string } | { ok: false } {
  if (!phoneValid(raw)) return { ok: false };
  const digits = phoneDigits(raw);
  return {
    ok: true,
    normalized: `+${digits}`,
    formatted: formatPhone(digits)
  };
}
