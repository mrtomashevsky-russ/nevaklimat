type Bucket = {
  resetAt: number;
  count: number;
};

const buckets = new Map<string, Bucket>();

export function rateLimit(ip: string): boolean {
  const limit = Number(process.env.LEAD_RATE_LIMIT_PER_MIN || 5);
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { resetAt: now + 60_000, count: 1 });
    return true;
  }

  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}
