/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-empty-function -- CommonJS test (Node's built-in `node --test` runner) exercising a CommonJS module; require() and empty mock methods are intentional. */
/**
 * Unit tests for the resilient cache handler's SINGLE-FLIGHT regeneration.
 *
 * Runs on Node's built-in test runner (no extra deps): `node --test cache-handler.test.js`
 * (also wired as `bun run test` / `npm test` in package.json).
 *
 * We exercise the pure factory `__createResilientHandler(redis, mirror, rawClient, opts)`
 * exported from cache-handler.js, injecting fake redis/mirror/raw-client and a fixed
 * clock so the lock logic is fully deterministic — no real Redis, no Next runtime.
 *
 * The design under test (see the cache-tag RFC §9.13):
 * - A STALE entry (now >= entry.lifespan.staleAt) triggers a cross-pod lock.
 * - Lock winner returns the entry AS-IS (this pod regenerates; set() releases the lock).
 * - Lock loser returns { ...entry, lastModified: now } so Next sees it as FRESH and does
 *   NOT kick off a duplicate background regeneration on that pod (it still serves stale).
 * - Cold miss / fresh entry / flag off / null lifespan / not-ready / any Redis error
 *   all fall through to today's behavior (never block a render).
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { __createResilientHandler } = require("./cache-handler.js");

// Fixed clock: 10_000_000 ms == 10_000 s. Entries with staleAt < 10_000 are stale.
const NOW_MS = 10_000_000;
const now = () => NOW_MS;

const LOCK_PREFIX = "sf-lock:";
const KEY = "/collections/summer";
const LOCK_KEY = LOCK_PREFIX + KEY;

/** A CacheHandlerValue as @fortedigital stores/returns it. */
function makeEntry({
  staleAt = 9_000,
  lastModified = 8_000_000,
  lifespanNull = false,
} = {}) {
  const value = { kind: "APP_PAGE", html: "<html>stale</html>", rscData: null };
  return {
    lastModified, // ms
    lifespan: lifespanNull
      ? null
      : {
          lastModifiedAt: Math.floor(lastModified / 1000),
          staleAt, // Unix seconds
          expireAt: staleAt + 15,
          staleAge: 30,
          expireAge: 45,
          revalidate: 30,
        },
    tags: [],
    value,
  };
}

function makeRedis({ entry = null, getThrows = false } = {}) {
  const calls = { get: 0, set: [], revalidateTag: [], delete: [] };
  return {
    calls,
    async get() {
      calls.get++;
      if (getThrows) {
        throw new Error("redis down");
      }
      return entry;
    },
    async set(k, d, c) {
      calls.set.push({ k, d, c });
    },
    async revalidateTag(t) {
      calls.revalidateTag.push(t);
    },
    async delete(k) {
      calls.delete.push(k);
    },
  };
}

function makeMirror({ entry = null } = {}) {
  const calls = { get: 0, set: [] };
  return {
    calls,
    async get() {
      calls.get++;
      return entry;
    },
    async set(k, d, c) {
      calls.set.push({ k, d, c });
    },
    async revalidateTag() {},
    async delete() {},
  };
}

/**
 * Fake node-redis v5 client. `set(key, val, { condition: "NX", expiration })`
 * returns "OK" when the key was absent, null when it already exists (real NX
 * semantics). `del` removes it. Optionally throw or hang to test degradation.
 */
function makeRawClient({
  ready = true,
  throwOn = null,
  hangOn = null,
  seedLock = false,
} = {}) {
  const store = new Map();
  if (seedLock) {
    store.set(LOCK_KEY, "1");
  }
  const calls = { set: [], del: [] };
  return {
    isReady: ready,
    calls,
    _has: (k) => store.has(k),
    async set(key, value, opts) {
      calls.set.push({ key, value, opts });
      if (throwOn === "set") {
        throw new Error("redis set failed");
      }
      if (hangOn === "set") {
        return new Promise(() => {});
      } // never settles
      const nx = opts?.condition === "NX" || opts?.NX === true;
      if (nx && store.has(key)) {
        return null;
      }
      store.set(key, value);
      return "OK";
    },
    async del(key) {
      calls.del.push(key);
      if (throwOn === "del") {
        throw new Error("redis del failed");
      }
      const existed = store.has(key);
      store.delete(key);
      return existed ? 1 : 0;
    },
  };
}

const baseOpts = () => ({
  singleFlight: true,
  lockKeyPrefix: LOCK_PREFIX,
  lockTtlMs: 10_000,
  lockOpTimeoutMs: 250,
  now,
});

test("winner: stale entry with a free lock is returned as-is and the lock is acquired", async () => {
  const entry = makeEntry({ staleAt: 9_000 });
  const raw = makeRawClient();
  const h = __createResilientHandler(
    makeRedis({ entry }),
    makeMirror(),
    raw,
    baseOpts()
  );

  const result = await h.get(KEY, { implicitTags: [] });

  assert.equal(result, entry, "winner gets the exact stale entry (unbumped)");
  assert.equal(result.lastModified, entry.lastModified);
  assert.equal(raw._has(LOCK_KEY), true, "lock acquired");
  assert.equal(raw.calls.set.length, 1);
  assert.equal(raw.calls.set[0].opts.condition, "NX");
  assert.deepEqual(raw.calls.set[0].opts.expiration, {
    type: "PX",
    value: 10_000,
  });
});

test("loser: stale entry with a held lock is returned with bumped lastModified (regen suppressed)", async () => {
  const entry = makeEntry({ staleAt: 9_000, lastModified: 8_000_000 });
  const raw = makeRawClient({ seedLock: true });
  const h = __createResilientHandler(
    makeRedis({ entry }),
    makeMirror(),
    raw,
    baseOpts()
  );

  const result = await h.get(KEY, { implicitTags: [] });

  assert.notEqual(result, entry, "loser gets a copy, not the original");
  assert.equal(
    result.lastModified,
    NOW_MS,
    "lastModified bumped to now → Next sees it fresh"
  );
  assert.equal(result.value, entry.value, "same stale content is still served");
  assert.equal(raw.calls.set.length, 1, "lock was attempted");
});

test("set() releases the single-flight lock", async () => {
  const entry = makeEntry({ staleAt: 9_000 });
  const raw = makeRawClient();
  const redis = makeRedis({ entry });
  const mirror = makeMirror();
  const h = __createResilientHandler(redis, mirror, raw, baseOpts());

  await h.get(KEY, { implicitTags: [] }); // winner acquires lock
  assert.equal(raw._has(LOCK_KEY), true);

  await h.set(KEY, entry, { revalidate: 30 });

  assert.equal(raw._has(LOCK_KEY), false, "lock deleted on set");
  assert.ok(raw.calls.del.includes(LOCK_KEY));
  assert.equal(redis.calls.set.length, 1, "still writes through to redis");
  assert.equal(mirror.calls.set.length, 1, "still writes through to mirror");
});

test("degrades safely when the lock write throws (returns entry as-is, never throws)", async () => {
  const entry = makeEntry({ staleAt: 9_000 });
  const raw = makeRawClient({ throwOn: "set" });
  const h = __createResilientHandler(
    makeRedis({ entry }),
    makeMirror(),
    raw,
    baseOpts()
  );

  const result = await h.get(KEY, { implicitTags: [] });

  assert.equal(
    result,
    entry,
    "on lock error, behave exactly as without single-flight"
  );
  assert.equal(result.lastModified, entry.lastModified, "not bumped");
});

test("degrades safely when the lock write hangs (timeout → entry as-is)", async () => {
  const entry = makeEntry({ staleAt: 9_000 });
  const raw = makeRawClient({ hangOn: "set" });
  const h = __createResilientHandler(makeRedis({ entry }), makeMirror(), raw, {
    ...baseOpts(),
    lockOpTimeoutMs: 50,
  });

  const started = now();
  const result = await h.get(KEY, { implicitTags: [] });

  assert.equal(result, entry, "a slow lock must never block the render");
  assert.equal(result.lastModified, entry.lastModified);
  // (started is a fixed clock; real wall-clock timeout is asserted by the test not hanging)
  void started;
});

test("fresh entry: no lock is attempted", async () => {
  const entry = makeEntry({ staleAt: 20_000 }); // staleAt in the future
  const raw = makeRawClient();
  const h = __createResilientHandler(
    makeRedis({ entry }),
    makeMirror(),
    raw,
    baseOpts()
  );

  const result = await h.get(KEY, { implicitTags: [] });

  assert.equal(result, entry);
  assert.equal(raw.calls.set.length, 0, "no single-flight for a fresh entry");
});

test("cold miss (null entry): no lock is attempted", async () => {
  const raw = makeRawClient();
  const h = __createResilientHandler(
    makeRedis({ entry: null }),
    makeMirror(),
    raw,
    baseOpts()
  );

  const result = await h.get(KEY, { implicitTags: [] });

  assert.equal(result, null);
  assert.equal(raw.calls.set.length, 0);
});

test("flag OFF: stale entry is untouched and no lock is attempted", async () => {
  const entry = makeEntry({ staleAt: 9_000 });
  const raw = makeRawClient();
  const h = __createResilientHandler(makeRedis({ entry }), makeMirror(), raw, {
    ...baseOpts(),
    singleFlight: false,
  });

  const result = await h.get(KEY, { implicitTags: [] });

  assert.equal(result, entry);
  assert.equal(result.lastModified, entry.lastModified);
  assert.equal(raw.calls.set.length, 0);
});

test("null lifespan (fallback:false page): never stale → no lock", async () => {
  const entry = makeEntry({ lifespanNull: true });
  const raw = makeRawClient();
  const h = __createResilientHandler(
    makeRedis({ entry }),
    makeMirror(),
    raw,
    baseOpts()
  );

  const result = await h.get(KEY, { implicitTags: [] });

  assert.equal(result, entry);
  assert.equal(raw.calls.set.length, 0);
});

test("raw client not ready: no lock is attempted", async () => {
  const entry = makeEntry({ staleAt: 9_000 });
  const raw = makeRawClient({ ready: false });
  const h = __createResilientHandler(
    makeRedis({ entry }),
    makeMirror(),
    raw,
    baseOpts()
  );

  const result = await h.get(KEY, { implicitTags: [] });

  assert.equal(result, entry);
  assert.equal(raw.calls.set.length, 0);
});

test("redis read error falls back to the local mirror (no single-flight on the fallback)", async () => {
  const mirrorEntry = makeEntry({ staleAt: 9_000 });
  const raw = makeRawClient();
  const h = __createResilientHandler(
    makeRedis({ getThrows: true }),
    makeMirror({ entry: mirrorEntry }),
    raw,
    baseOpts()
  );

  const result = await h.get(KEY, { implicitTags: [] });

  assert.equal(
    result,
    mirrorEntry,
    "serves last-known from the mirror during a Redis outage"
  );
  assert.equal(
    raw.calls.set.length,
    0,
    "does not try to lock against a down Redis"
  );
});
