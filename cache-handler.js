/**
 * Shared cross-pod cache handler (Next.js App Router, self-hosted on EKS).
 *
 * WHY THIS EXISTS
 * ---------------
 * By default Next.js stores its Data/ISR cache INSIDE each pod (memory + local
 * disk). A webhook that calls `revalidateTag()` only clears the ONE pod the load
 * balancer routed it to; the other pods keep serving stale content until their
 * own timer expires. That is the "changes take 5 minutes in production" bug.
 *
 * This handler points every pod at ONE shared Redis (AWS ElastiCache). A single
 * `revalidateTag()` on any pod is written to Redis and seen by ALL pods on their
 * next request — instant, cluster-wide invalidation.
 *
 * DESIGN GOALS (in priority order)
 * --------------------------------
 * 1. NEVER break the storefront. A Redis problem must never crash a render or
 *    take the site down. Every failure path degrades, it does not throw.
 * 2. NEVER reintroduce cross-pod staleness during normal operation. When Redis
 *    is healthy it is the single source of truth for reads AND invalidation.
 * 3. Survive Redis outages gracefully. If Redis drops, each pod keeps serving
 *    last-known content from a local in-memory mirror (== the storefront's
 *    pre-fix per-pod behavior) instead of stampeding the origin API, and the
 *    Redis client reconnects on its own so the shared cache auto-resumes.
 *
 * The `resilient` handler below implements exactly this: Redis-authoritative
 * reads with a local fallback used ONLY when Redis errors/times out (never on a
 * healthy miss, which would serve stale), dual writes to keep the mirror warm,
 * and no-throw writes/invalidations. The library's built-in `composite` handler
 * is intentionally NOT used: its read is first-non-null, which would either serve
 * stale from the local layer or throw on a Redis error.
 *
 * ENGAGEMENT: the handler is ALWAYS registered (next-config.js) but only uses
 * Redis when `REDIS_URL` is present AT RUNTIME. With `output: "standalone"` the
 * next.config is frozen at build time, so gating registration on REDIS_URL there
 * would ignore a URL injected only at K8s runtime. Without REDIS_URL it is a
 * plain in-memory LRU — functionally Next's default cache.
 *
 * OBSERVABILITY: current state is published on `global.__sfCacheHealth` and
 * surfaced by GET /api/cache-status for probes/dashboards.
 *
 * MULTI-TENANT: keys are namespaced by the unique NEXT_PUBLIC_MERCHANT_ID so many
 * storefronts can share one Redis without colliding. If REDIS_URL is set but the
 * id is missing, we REFUSE the shared namespace (would leak data across
 * merchants) and use in-memory instead.
 *
 * CommonJS (matches next.config.js), loaded by the standalone `node server.js`.
 *
 * @module cache-handler
 */

const { createClient } = require("redis");
const { PHASE_PRODUCTION_BUILD } = require("next/constants");
const { CacheHandler } = require("@fortedigital/nextjs-cache-handler");
const createRedisHandler =
  require("@fortedigital/nextjs-cache-handler/redis-strings").default;
const createLruHandler =
  require("@fortedigital/nextjs-cache-handler/local-lru").default;

// -----------------------------------------------------------------------------
// Health state (read by /api/cache-status). Same process as the server, so a
// plain global is shared with the route handler.
// -----------------------------------------------------------------------------
function setHealth(patch) {
  global.__sfCacheHealth = {
    ...(global.__sfCacheHealth || {}),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
}
setHealth({ mode: "initializing", redisReady: false });

const inMemory = (mode, detail) => {
  setHealth({ mode, redisReady: false, detail: detail || "" });
  return { handlers: [createLruHandler()] };
};

/**
 * Race a lock op against a short timeout so a slow-but-connected Redis can never
 * block a page render. On timeout the caller degrades to normal behavior; the
 * orphaned command is harmless (it only sets/clears a short-lived lock key).
 */
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("lock op timeout")), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

/**
 * Redis-authoritative handler with a local mirror used only when Redis is down.
 * Implements the Next.js cache Handler interface (get/set/revalidateTag/delete).
 *
 * SINGLE-FLIGHT REGENERATION (opt-in via SF_SINGLE_FLIGHT=1)
 * ---------------------------------------------------------
 * When an ISR entry goes stale, EVERY pod that serves a request would otherwise
 * kick off its own background regeneration → N pods = N identical renders hitting
 * the origin at once (the "stale-page wave" that drives pod autoscaling). To
 * collapse that to ONE regeneration cluster-wide, a stale read takes a short Redis
 * lock (SET NX PX):
 *   - winner → serve the stale entry AS-IS; Next regenerates on THIS pod; the lock
 *              is released when the fresh value lands in set().
 *   - loser  → serve the SAME stale bytes but with `lastModified` bumped to now, so
 *              Next core treats the entry as fresh and does NOT start a duplicate
 *              background regeneration on that pod.
 * The bump is per-response only (never written back to Redis), so the moment the
 * winner writes the fresh entry, every pod naturally serves fresh again.
 *
 * The staleness signal is @fortedigital's own `entry.lifespan.staleAt` (Unix
 * seconds), which round-trips through get()/set() automatically — no extra state.
 * `lifespan.expireAt` eviction (in the library's wrapper) still uses the untouched
 * `lifespan`, so bumping `lastModified` cannot leak an entry past its hard expiry.
 * See the cache-tag RFC §9.13.
 *
 * SAFETY (non-negotiable):
 * - OFF by default (SF_SINGLE_FLIGHT !== "1").
 * - Any lock error/timeout, a not-ready client, or a mirror-served read falls
 *   straight through to today's behavior — a render is never blocked or failed.
 * - Short lock TTL (PX) so a crashed/slow regenerator self-releases.
 *
 * @param redis      the @fortedigital redis handler (source of truth)
 * @param mirror     local LRU, read only when Redis is unavailable
 * @param rawClient  the raw node-redis client, for SET NX / DEL (optional)
 * @param options    single-flight config (see defaults below)
 */
function createResilientHandler(redis, mirror, rawClient, options = {}) {
  const {
    singleFlight = process.env.SF_SINGLE_FLIGHT === "1",
    lockKeyPrefix = "",
    lockTtlMs = Number(process.env.SF_SINGLE_FLIGHT_LOCK_TTL_MS) || 10000,
    lockOpTimeoutMs = Number(process.env.SF_SINGLE_FLIGHT_LOCK_OP_TIMEOUT_MS) ||
      250,
    now = Date.now,
  } = options;

  // Flag-gated, log-only diagnostics: lets us confirm the real get()/set() ctx and
  // entry shapes (lastModified, lifespan.staleAt/expireAt) on live traffic without
  // touching behavior. Enable with SF_DEBUG_CACHE=1.
  const debug = (method, key, ctx, entry) => {
    if (!process.env.SF_DEBUG_CACHE) {
      return;
    }
    try {
      const ls = entry && entry.lifespan;
      const staleAt =
        ls && typeof ls.staleAt === "number" ? ls.staleAt : undefined;
      console.info(
        "[sf-cache]",
        method,
        JSON.stringify({
          key,
          ctxKeys: ctx ? Object.keys(ctx) : null,
          hasEntry: !!entry,
          lastModified: entry?.lastModified,
          lifespanNull: entry ? ls === null : undefined,
          staleAt,
          expireAt: ls?.expireAt,
          revalidate: ls?.revalidate,
          nowSec: Math.floor(now() / 1000),
          stale:
            typeof staleAt === "number" ? now() / 1000 >= staleAt : undefined,
        })
      );
    } catch {
      // diagnostics must never throw
    }
  };

  // Eligible for single-flight only once past the stale window. A null lifespan
  // (e.g. fallback:false pages) is treated as never-stale.
  const isStale = (entry) => {
    const staleAt = entry && entry.lifespan && entry.lifespan.staleAt;
    return typeof staleAt === "number" && now() / 1000 >= staleAt;
  };

  // Self-contained and non-throwing: a lock problem can never fall through to the
  // mirror path or fail a render. Returns the value to hand back to Next.
  const applySingleFlight = async (key, entry) => {
    if (!singleFlight || !entry || !rawClient?.isReady || !isStale(entry)) {
      return entry;
    }
    try {
      const acquired = await withTimeout(
        rawClient.set(lockKeyPrefix + key, "1", {
          condition: "NX",
          expiration: { type: "PX", value: lockTtlMs },
        }),
        lockOpTimeoutMs
      );
      const won = acquired === "OK"; // node-redis returns "OK" on set, null on NX-miss
      if (process.env.SF_DEBUG_CACHE) {
        console.info(
          "[sf-cache] single-flight",
          won ? "WINNER" : "LOSER",
          key,
          `reply=${JSON.stringify(acquired)}`
        );
      }
      if (!won) {
        // Another pod already owns the regeneration → suppress ours by presenting
        // the (identical) stale content as fresh for this one response.
        return { ...entry, lastModified: now() };
      }
      // We own the regeneration; hand back the stale entry unchanged so Next
      // regenerates on this pod. set() releases the lock when the render lands.
      return entry;
    } catch {
      // Lock unavailable/slow → behave exactly as if single-flight were off.
      return entry;
    }
  };

  return {
    name: "resilient-redis-lru",
    async get(key, ctx) {
      let entry;
      try {
        // Redis is the source of truth. Its get() already checks shared tag
        // timestamps, so a null here means genuine miss OR cross-pod invalidation
        // — either way we must NOT consult the mirror (that would serve stale).
        entry = await redis.get(key, ctx);
      } catch (e) {
        // Redis unavailable/slow (throws or times out) → serve last-known from
        // the local mirror so the pod stays up and does not stampede origin.
        if (global.__sfCacheHealth?.redisReady) {
          setHealth({
            redisReady: false,
            detail: `read fallback: ${e?.message || e}`,
          });
        }
        try {
          return await mirror.get(key, ctx);
        } catch {
          return null; // last resort: cache miss (Next renders from origin)
        }
      }
      debug("get", key, ctx, entry);
      // Single-flight applies only on the healthy-Redis path, never the mirror.
      return applySingleFlight(key, entry);
    },
    async set(key, data, ctx) {
      debug("set", key, ctx, data);
      // Write to both so the mirror is warm for an outage. Never throw: a cache
      // write failure must not break the response.
      await Promise.allSettled([
        redis.set(key, data, ctx),
        mirror.set(key, data, ctx),
      ]);
      // Fresh value is in place → release the single-flight lock so the NEXT stale
      // cycle can elect a new regenerator (best-effort; the lock's PX TTL clears it
      // anyway if this DEL is lost).
      if (singleFlight && rawClient?.isReady) {
        try {
          await withTimeout(
            rawClient.del(lockKeyPrefix + key),
            lockOpTimeoutMs
          );
        } catch {
          // ignore: the short lock TTL guarantees the lock clears on its own
        }
      }
    },
    async revalidateTag(tag) {
      // Invalidate both. Redis is what other pods read; the mirror keeps this
      // pod consistent while Redis is healthy.
      await Promise.allSettled([
        redis.revalidateTag(tag),
        mirror.revalidateTag(tag),
      ]);
    },
    async delete(key) {
      await Promise.allSettled([redis.delete?.(key), mirror.delete?.(key)]);
    },
  };
}

CacheHandler.onCreation(() => {
  // The library calls onCreation once, but guard the config/promise on global
  // scope so we never open more than one Redis connection per process.
  if (global.__sfCacheHandlerConfig) {
    return global.__sfCacheHandlerConfig;
  }
  if (global.__sfCacheHandlerPromise) {
    return global.__sfCacheHandlerPromise;
  }

  // No Redis wanted → in-memory only. Never touch Redis. (Local dev, or any env
  // that simply hasn't opted in via REDIS_URL.)
  if (process.env.NODE_ENV === "development" || !process.env.REDIS_URL) {
    return inMemory("disabled", "REDIS_URL not set");
  }

  // Tenant isolation is mandatory on a shared Redis. NEXT_PUBLIC_MERCHANT_ID is
  // the guaranteed-unique key (the nav service already uses it). If it is absent
  // we must NOT fall back to a shared literal namespace — that would serve one
  // merchant's cached pages to another. Degrade to in-memory instead.
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
  if (!merchantId) {
    console.error(
      "[cache-handler] REDIS_URL is set but NEXT_PUBLIC_MERCHANT_ID is missing — " +
        "refusing to share a Redis namespace across merchants; using in-memory cache. " +
        "Inject NEXT_PUBLIC_MERCHANT_ID into the runtime env to enable the shared cache."
    );
    return inMemory("memory", "missing NEXT_PUBLIC_MERCHANT_ID");
  }
  const NS = `nextjs:${merchantId}:`;
  setHealth({ merchantId });

  global.__sfCacheHandlerPromise = (async () => {
    let redisClient = null;

    // Do NOT open Redis during `next build` — the build phase writes the initial
    // cache to disk; runtime pods are what need the shared store.
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
      // Flips true after the first successful connect. Gates the reconnect policy:
      // fail fast BEFORE we ever connect (so a down Redis at boot doesn't hang the
      // pod), but reconnect indefinitely AFTER (so a live pod self-heals through
      // an ElastiCache failover instead of dying until manual restart).
      let connectedOnce = false;

      try {
        redisClient = createClient({
          // TLS is inferred from the scheme: redis:// (dev, plaintext in-VPC) vs
          // rediss:// (prod, encrypted in transit). No code change between envs.
          url: process.env.REDIS_URL,
          pingInterval: 10000, // keep the connection warm through idle periods
          // Cache semantics: never buffer commands while disconnected. If Redis is
          // down/reconnecting, commands reject immediately so the resilient handler
          // falls straight to the local mirror instead of queuing (and growing
          // memory / delaying responses) until reconnect.
          disableOfflineQueue: true,
          socket: {
            connectTimeout: 3000,
            reconnectStrategy: (retries) => {
              if (!connectedOnce) {
                // Startup: give up after a couple attempts so connect() rejects
                // and we boot on the in-memory mirror rather than hang forever.
                return retries > 1 ? false : Math.min(retries * 200, 500);
              }
              // Runtime: never give up — reconnect with capped backoff so the
              // shared cache resumes automatically when Redis comes back.
              return Math.min(retries * 200, 3000);
            },
          },
          // Optional AUTH — set REDIS_ACCESS_KEY only where the cluster requires it.
          ...(process.env.REDIS_ACCESS_KEY && {
            password: process.env.REDIS_ACCESS_KEY,
          }),
        });

        // Observability: publish state TRANSITIONS (not every retry) so a degraded
        // pod is visible without spamming logs during an outage.
        redisClient.on("ready", () => {
          connectedOnce = true;
          if (!global.__sfCacheHealth?.redisReady) {
            setHealth({ mode: "redis", redisReady: true, detail: "" });
            console.info(
              "[cache-handler] Redis connected — shared cross-pod cache active."
            );
          }
        });
        redisClient.on("error", (e) => {
          if (global.__sfCacheHealth?.redisReady) {
            setHealth({
              redisReady: false,
              detail: `redis error: ${e?.message}`,
            });
            console.warn(
              "[cache-handler] Redis connection lost — reconnecting; serving from local mirror meanwhile:",
              e?.message
            );
          } else if (process.env.NEXT_PRIVATE_DEBUG_CACHE) {
            console.warn("[cache-handler] redis error:", e?.message);
          }
        });

        console.info("[cache-handler] connecting to Redis…");
        await redisClient.connect();
      } catch (e) {
        console.warn(
          "[cache-handler] Redis unavailable at startup, using in-memory cache:",
          e?.message
        );
        try {
          await redisClient?.disconnect();
        } catch {
          // best-effort cleanup; nothing to do if disconnect also fails
        }
        redisClient = null;
      }
    }

    // Startup could not reach Redis → per-pod in-memory only (site stays up;
    // cross-pod invalidation resumes when the pod is restarted or, if it later
    // connects, on the next process). Never blocks the site.
    if (!redisClient?.isReady) {
      global.__sfCacheHandlerPromise = null;
      global.__sfCacheHandlerConfig = inMemory(
        "memory",
        "redis unreachable at startup"
      );
      return global.__sfCacheHandlerConfig;
    }

    const redisHandler = createRedisHandler({
      client: redisClient,
      keyPrefix: NS,
      // The library prepends keyPrefix to these, so plain names yield the intended
      // `nextjs:<id>:tags` / `nextjs:<id>:tagsTtl` (no double prefix).
      sharedTagsKey: "tags",
      sharedTagsTtlKey: "tagsTtl",
      // Per-operation ceiling: if Redis goes slow mid-request, the op rejects fast
      // and the resilient handler falls back to the local mirror instead of blocking.
      timeoutMs: 1000,
    });

    // Local mirror: warm standby the resilient handler reads from only when Redis
    // is unavailable. Not consulted while Redis is healthy, so it cannot cause
    // cross-pod staleness during normal operation. Bounded explicitly (the library
    // default is ~100MB/1000 items) so the mirror can't threaten pod memory — it
    // only needs to hold the hottest pages to cushion an outage. Tunable via env.
    const mirror = createLruHandler({
      maxItemsNumber: Number(process.env.SF_CACHE_MIRROR_MAX_ITEMS) || 500,
      // NOTE: the library applies this as the LRU's TOTAL maxSize (not per-item).
      maxItemSizeBytes:
        Number(process.env.SF_CACHE_MIRROR_MAX_BYTES) || 50 * 1024 * 1024, // 50MB/pod
    });

    setHealth({ mode: "redis", redisReady: true, detail: "" });
    global.__sfCacheHandlerPromise = null;
    global.__sfCacheHandlerConfig = {
      handlers: [
        // Pass the RAW redis client too (the @fortedigital wrapper doesn't expose
        // SET NX / DEL, which single-flight needs). Lock keys are namespaced under
        // the same per-merchant prefix so they never collide across tenants and are
        // easy to tell apart from cache/tag keys. Single-flight itself stays OFF
        // until SF_SINGLE_FLIGHT=1 is set in the runtime env.
        createResilientHandler(redisHandler, mirror, redisClient, {
          lockKeyPrefix: `${NS}sf-lock:`,
        }),
      ],
    };
    return global.__sfCacheHandlerConfig;
  })();

  return global.__sfCacheHandlerPromise;
});

module.exports = CacheHandler;
// Exposed for unit tests only (Next.js uses the default CacheHandler export).
module.exports.__createResilientHandler = createResilientHandler;
