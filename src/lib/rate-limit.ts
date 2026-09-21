/**
 * Simple in-memory sliding-window rate limiter (per server instance).
 * Good enough for single-node / serverless warm instances; use Redis in multi-region later.
 */
type Bucket = { count: number; resetAt: number };

const STORE = globalThis as unknown as {
  __genradiusRateLimit?: Map<string, Bucket>;
};

function store() {
  if (!STORE.__genradiusRateLimit) STORE.__genradiusRateLimit = new Map();
  return STORE.__genradiusRateLimit;
}

export function rateLimit(opts: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: true; remaining: number } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const map = store();
  const existing = map.get(opts.key);

  if (!existing || now >= existing.resetAt) {
    map.set(opts.key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1 };
  }

  if (existing.count >= opts.limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true, remaining: opts.limit - existing.count };
}

export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}
