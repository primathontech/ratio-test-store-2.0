import { NextResponse } from "next/server";

/**
 * GET /api/cache-status — shared-cache health probe.
 *
 * Reports whether this pod's Next.js Data/ISR cache is backed by the shared Redis
 * or has degraded to a per-pod in-memory cache. The cache-handler publishes its
 * state on `global.__sfCacheHealth` (same process), which this route surfaces for
 * dashboards, alerting, and manual checks.
 *
 * States (`mode`):
 *  - "redis"        → shared cross-pod cache active (healthy)
 *  - "memory"       → degraded to per-pod in-memory (Redis unreachable, or the
 *                     merchant id is missing so a shared namespace was refused)
 *  - "disabled"     → REDIS_URL not set (feature off — expected in dev/single-pod)
 *  - "initializing" → handler not constructed yet (first request pending)
 *
 * Always 200 so this can't fail a liveness probe; use `degraded` for alerting.
 * Never leaks the Redis URL/credentials — only coarse status.
 */
export const dynamic = "force-dynamic";

type CacheHealth = {
  mode?: "redis" | "memory" | "disabled" | "initializing";
  redisReady?: boolean;
  merchantId?: string | null;
  detail?: string;
  updatedAt?: string | null;
};

export async function GET() {
  const h: CacheHealth = (
    globalThis as unknown as { __sfCacheHealth?: CacheHealth }
  ).__sfCacheHealth ?? { mode: "initializing", redisReady: false };

  // "degraded" = we intended to use Redis but currently are not. Alert on this.
  const intendedRedis = !!process.env.REDIS_URL;
  const degraded = intendedRedis && h.mode !== "redis";

  return NextResponse.json(
    {
      mode: h.mode ?? "initializing",
      redisReady: !!h.redisReady,
      degraded,
      merchantId: h.merchantId ?? null,
      detail: h.detail ?? "",
      updatedAt: h.updatedAt ?? null,
    },
    { headers: { "cache-control": "no-store" } }
  );
}
