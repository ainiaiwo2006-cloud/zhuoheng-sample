// In-memory IP rate limiter — sliding window, LRU-bounded.
//
// Designed for the inquiry / OEM endpoints where a single legitimate buyer
// sends ≤ 1 inquiry per minute. Anything above that is almost certainly a
// bot or someone spamming the form.
//
// MVP-grade: state is per-process. If you scale to multiple Next.js
// instances, swap with Redis or Upstash. The interface stays the same.

type WindowEntry = {
  hits: number[];   // timestamps (ms)
};

const WINDOW_MS = 60_000;       // 1 minute
const MAX_ENTRIES = 5_000;      // bounded LRU; oldest evicted when full
const buckets = new Map<string, WindowEntry>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
};

/**
 * Returns ok=false when the IP has exceeded `limit` hits in the past
 * `WINDOW_MS` milliseconds.
 *
 * Default: 5 requests per minute per IP. Override on per-endpoint basis.
 */
export function rateLimit(ip: string, limit = 5): RateLimitResult {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  let entry = buckets.get(ip);
  if (!entry) {
    entry = { hits: [] };
    buckets.set(ip, entry);
  } else {
    // Move to end (LRU touch)
    buckets.delete(ip);
    buckets.set(ip, entry);
  }

  // drop old hits outside window
  entry.hits = entry.hits.filter((t) => t > cutoff);

  // Evict oldest if we hit the cap (memory ceiling)
  if (buckets.size > MAX_ENTRIES) {
    const oldest = buckets.keys().next().value;
    if (oldest) buckets.delete(oldest);
  }

  if (entry.hits.length >= limit) {
    const oldestHit = entry.hits[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldestHit + WINDOW_MS - now) / 1000));
    return { ok: false, remaining: 0, retryAfterSec };
  }

  entry.hits.push(now);
  return {
    ok: true,
    remaining: limit - entry.hits.length,
    retryAfterSec: 0,
  };
}

/**
 * Best-effort client IP from a Next.js Request.
 * Uses x-forwarded-for first hop (set by nginx), falls back to
 * x-real-ip then x-vercel-forwarded-for. Returns 'unknown' if none.
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const vercel = req.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  return "unknown";
}
