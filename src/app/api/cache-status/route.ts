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
 *                     merchant id / build id is missing so a shared namespace was
 *                     refused)
 *  - "disabled"     → REDIS_URL not set (feature off — expected in dev/single-pod)
 *  - "initializing" → the handler has not been constructed on THIS pod yet. This
 *                     is normal, not a fault — see below.
 *
 * WHY "initializing" IS NOT A FAULT
 * ---------------------------------
 * The cache handler is constructed lazily, on the first request that actually
 * touches the ISR/Data cache. This route is `force-dynamic`, so it never touches
 * the cache — meaning a pod that has only ever served *this* endpoint (a k8s probe,
 * a monitoring curl, a load-balancer health check) reports "initializing"
 * indefinitely while being perfectly healthy.
 *
 * Reporting that as degraded produces a false alarm indistinguishable from a real
 * refusal, so `degraded` deliberately EXCLUDES it and `initializing` is surfaced as
 * its own boolean. To force construction, request a cacheable page ("/") from the
 * pod, then re-read this endpoint.
 *
 * Always 200 so this can't fail a liveness probe; use `degraded` for alerting.
 * Never leaks the Redis URL/credentials — only coarse status.
 */
export const dynamic = "force-dynamic";

type CacheHealth = {
  mode?: "redis" | "memory" | "disabled" | "initializing";
  redisReady?: boolean;
  merchantId?: string | null;
  buildId?: string | null;
  writeFailures?: number;
  oomFailures?: number;
  lastWriteError?: string;
  detail?: string;
  updatedAt?: string | null;
};

export async function GET() {
  const h: CacheHealth = (
    globalThis as unknown as { __sfCacheHealth?: CacheHealth }
  ).__sfCacheHealth ?? { mode: "initializing", redisReady: false };

  const mode = h.mode ?? "initializing";
  const intendedRedis = !!process.env.REDIS_URL;

  // Lazy construction means "not built yet" and "refused" look identical if you
  // only inspect mode/buildId, so report the distinction explicitly.
  const initializing = mode === "initializing";

  // "degraded" = we intended to use Redis and have DECIDED not to. A pod that has
  // not constructed the handler yet has decided nothing, so it is not degraded.
  const degraded = intendedRedis && !initializing && mode !== "redis";

  return NextResponse.json(
    {
      mode,
      redisReady: !!h.redisReady,
      degraded,
      initializing,
      merchantId: h.merchantId ?? null,
      // Page cache keys are namespaced `nextjs:<merchantId>:<buildId>:<path>`, so
      // this is how you confirm which build's slot a pod is reading after a deploy.
      // Null while `initializing`. Null WITH `degraded: true` means the handler
      // refused the shared cache because the build id could not be resolved.
      buildId: h.buildId ?? null,
      // Rejected Redis writes since this pod started. Non-zero means pages are
      // rendering but NOT caching — which otherwise looks identical to a cold
      // cache. `oomFailures` is the subset where Redis refused because the node
      // is FULL: that needs capacity work, not a retry. Alert on both.
      writeFailures: h.writeFailures ?? 0,
      oomFailures: h.oomFailures ?? 0,
      lastWriteError: h.lastWriteError ?? "",
      detail: h.detail ?? "",
      updatedAt: h.updatedAt ?? null,
    },
    { headers: { "cache-control": "no-store" } }
  );
}
