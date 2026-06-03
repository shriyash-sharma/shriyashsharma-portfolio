/**
 * Sliding-window rate limiter for same-origin API routes (e.g. assistant).
 *
 * In-memory and per Node process — sufficient for dev and single-instance hosts.
 * Pair with FastAPI limits on `/assistant` for defense in depth.
 */

type HitRecord = {
  timestamps: number[];
};

const hitsByKey = new Map<string, HitRecord>();

function prune(timestamps: number[], windowMs: number, now: number): number[] {
  const cutoff = now - windowMs;
  return timestamps.filter((t) => t > cutoff);
}

export function getRequestClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const client = forwarded.split(",")[0]?.trim();
    if (client) return client;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

export function checkRateLimit(
  key: string,
  options: { limit: number; windowMs: number }
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const { limit, windowMs } = options;
  if (limit <= 0) {
    return { allowed: true };
  }

  const now = Date.now();
  const record = hitsByKey.get(key) ?? { timestamps: [] };
  const timestamps = prune(record.timestamps, windowMs, now);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0] ?? now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000)
    );
    hitsByKey.set(key, { timestamps });
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  hitsByKey.set(key, { timestamps });
  return { allowed: true };
}

const DEFAULT_ASSISTANT_LIMIT_PER_MINUTE = 10;
const ASSISTANT_WINDOW_MS = 60_000;

function assistantLimitPerMinute(): number {
  const raw = process.env.ASSISTANT_RATE_LIMIT_PER_MINUTE;
  if (raw === undefined || raw === "") {
    return DEFAULT_ASSISTANT_LIMIT_PER_MINUTE;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_ASSISTANT_LIMIT_PER_MINUTE;
}

export function checkAssistantRateLimit(clientIp: string) {
  return checkRateLimit(`assistant:${clientIp}`, {
    limit: assistantLimitPerMinute(),
    windowMs: ASSISTANT_WINDOW_MS,
  });
}
