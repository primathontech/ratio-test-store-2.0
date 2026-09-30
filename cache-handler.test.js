/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-empty-function -- CommonJS test (Node's built-in `node --test` runner) exercising a CommonJS module; require() and empty mock methods are intentional. */
/**
 * Unit tests for the resilient cache handler.
 *
 * Runs on Node's built-in test runner (no extra deps):
 *   node --test cache-handler.test.js
 * (also wired as `bun run test` / `npm test` in package.json).
 *
 * Two things are under test:
 *
 * 1. BUILD-ID SCOPING (the 3 Aug outage). Rendered HTML embeds the chunk
 *    filenames of the build that produced it. Redis survives deployments; pods
 *    do not. With an unscoped key a pod from build C could read build A's HTML
 *    and serve it, so the browser then asked build C for build A's filenames and
 *    got 404s — a blank page. Page keys are therefore namespaced per build.
 *
 *    Fetch/API entries are deliberately NOT namespaced: that data is
 *    build-independent and expensive to refill, so it must survive a deploy.
 *
 * 2. RESILIENCE. Redis is authoritative while healthy; a Redis error (never a
 *    healthy miss, which would serve stale) falls back to the local mirror. No
 *    path may throw — a cache problem must not break a render.
 *
 * The pure factory `__createResilientHandler(redis, mirror, opts)` is exported
 * from cache-handler.js, so no real Redis and no Next runtime are involved.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { __createResilientHandler } = require("./cache-handler.js");

// Page keys always start with "/" (Next normalises them). Fetch keys are bare
// sha256 hex. That shape difference is the only discriminator the handler needs.
const PAGE_KEY = "/collections/summer";
const FETCH_KEY =
  "a3f1c9e07b5d2148aa90ce31bf6470d2e8c5419a7b03fd6e2c8b1a4d5f6079e3";

/** A CacheHandlerValue in the shape @fortedigital stores and returns. */
function makeEntry(html = "<html>build-a</html>") {
  return {
    lastModified: 8_000_000,
    lifespan: {
      lastModifiedAt: 8_000,
      staleAt: 11_600,
      expireAt: 13_400,
      staleAge: 3600,
      expireAge: 5400,
      revalidate: 3600,
    },
    tags: [],
    value: { kind: "APP_PAGE", html, rscData: null },
  };
}

/**
 * A single Redis, shared by every pod — exactly as in production. Keyed by the
 * literal key string it is handed, so a scoping bug shows up as a real collision
 * rather than being hidden by a per-instance mock.
 */
function makeSharedRedis({ getThrows = false } = {}) {
  const store = new Map();
  const calls = { get: [], set: [], revalidateTag: [], delete: [] };
  return {
    store,
    calls,
    async get(key) {
      calls.get.push(key);
      if (getThrows) {
        throw new Error("redis down");
      }
      return store.has(key) ? store.get(key) : null;
    },
    async set(key, data) {
      calls.set.push(key);
      store.set(key, data);
    },
    async revalidateTag(tag) {
      calls.revalidateTag.push(tag);
    },
    async delete(key) {
      calls.delete.push(key);
      store.delete(key);
    },
  };
}

function makeMirror({ entry = null } = {}) {
  const calls = { get: [], set: [], revalidateTag: [], delete: [] };
  return {
    calls,
    async get(key) {
      calls.get.push(key);
      return entry;
    },
    async set(key, data) {
      calls.set.push({ key, data });
    },
    async revalidateTag(tag) {
      calls.revalidateTag.push(tag);
    },
    async delete(key) {
      calls.delete.push(key);
    },
  };
}

/** The health snapshot the handler publishes, read by GET /api/cache-status. */
const health = () => globalThis.__sfCacheHealth ?? {};

/** A pod running `buildId`, wired to the shared Redis. */
function podFor(buildId, redis, mirror = makeMirror()) {
  return {
    handler: __createResilientHandler(redis, mirror, { buildId }),
    mirror,
  };
}

// ---------------------------------------------------------------------------
// 1. Build-ID scoping — the outage
// ---------------------------------------------------------------------------

test("a pod CANNOT read a page entry written by a DIFFERENT build", async () => {
  const redis = makeSharedRedis();
  const podA = podFor("buildA", redis);
  const podC = podFor("buildC", redis);

  const buildAPage = makeEntry("<html>build-a chunks</html>");
  await podA.handler.set(PAGE_KEY, buildAPage, {});

  const seenByC = await podC.handler.get(PAGE_KEY, { implicitTags: [] });

  assert.equal(
    seenByC,
    null,
    "build C must MISS and render its own page rather than serve build A's HTML"
  );
  assert.equal(
    redis.store.get(`buildA:${PAGE_KEY}`),
    buildAPage,
    "build A's entry is untouched — unreachable, not deleted"
  );
});

test("page writes are namespaced by buildId", async () => {
  const redis = makeSharedRedis();
  const { handler } = podFor("7L902T7DDMf5bSHq5wTZs", redis);

  await handler.set(PAGE_KEY, makeEntry(), {});

  assert.deepEqual(redis.calls.set, [`7L902T7DDMf5bSHq5wTZs:${PAGE_KEY}`]);
});

test("pods of the SAME build still share page entries", async () => {
  const redis = makeSharedRedis();
  const pod1 = podFor("buildA", redis);
  const pod2 = podFor("buildA", redis);

  const page = makeEntry();
  await pod1.handler.set(PAGE_KEY, page, {});

  assert.equal(
    await pod2.handler.get(PAGE_KEY, { implicitTags: [] }),
    page,
    "same build = same namespace, so one render still serves the whole cluster"
  );
});

test("fetch writes are NOT namespaced — API data must survive a deploy", async () => {
  const redis = makeSharedRedis();
  const { handler } = podFor("buildA", redis);

  await handler.set(FETCH_KEY, { kind: "FETCH", data: {} }, {});

  assert.deepEqual(
    redis.calls.set,
    [FETCH_KEY],
    "a bare sha256 key is left unscoped"
  );
});

test("pods of DIFFERENT builds still share fetch entries", async () => {
  const redis = makeSharedRedis();
  const podA = podFor("buildA", redis);
  const podC = podFor("buildC", redis);

  const apiJson = { kind: "FETCH", data: { price: 499 } };
  await podA.handler.set(FETCH_KEY, apiJson, {});

  assert.equal(
    await podC.handler.get(FETCH_KEY, { implicitTags: [] }),
    apiJson,
    "the new build reuses cached API data instead of refetching from origin"
  );
});

test("deletes target the build-scoped page key", async () => {
  const redis = makeSharedRedis();
  const { handler } = podFor("buildA", redis);

  await handler.set(PAGE_KEY, makeEntry(), {});
  await handler.delete(PAGE_KEY);

  assert.deepEqual(redis.calls.delete, [`buildA:${PAGE_KEY}`]);
  assert.equal(redis.store.has(`buildA:${PAGE_KEY}`), false);
});

test("without a buildId, keys are left unscoped (safe fallback, no crash)", async () => {
  const redis = makeSharedRedis();
  const { handler } = podFor(undefined, redis);

  await handler.set(PAGE_KEY, makeEntry(), {});

  assert.deepEqual(
    redis.calls.set,
    [PAGE_KEY],
    "a missing buildId must degrade to today's behaviour, never throw"
  );
});

test("a non-string key is passed through untouched", async () => {
  const redis = makeSharedRedis();
  const { handler } = podFor("buildA", redis);

  await assert.doesNotReject(() =>
    handler.get(undefined, { implicitTags: [] })
  );
});

// ---------------------------------------------------------------------------
// 2. Resilience
// ---------------------------------------------------------------------------

test("a Redis read error falls back to the local mirror", async () => {
  const mirrorEntry = makeEntry("<html>last known</html>");
  const redis = makeSharedRedis({ getThrows: true });
  const mirror = makeMirror({ entry: mirrorEntry });
  const { handler } = podFor("buildA", redis, mirror);

  const result = await handler.get(PAGE_KEY, { implicitTags: [] });

  assert.equal(
    result,
    mirrorEntry,
    "during a Redis outage the pod keeps serving rather than stampeding origin"
  );
});

test("a healthy Redis MISS does NOT consult the mirror (that would serve stale)", async () => {
  const redis = makeSharedRedis();
  const mirror = makeMirror({ entry: makeEntry("<html>stale</html>") });
  const { handler } = podFor("buildA", redis, mirror);

  const result = await handler.get(PAGE_KEY, { implicitTags: [] });

  assert.equal(result, null, "a miss must be a miss");
  assert.deepEqual(
    mirror.calls.get,
    [],
    "the mirror is not read on a healthy miss"
  );
});

test("writes go to BOTH stores so the mirror is warm for an outage", async () => {
  const redis = makeSharedRedis();
  const mirror = makeMirror();
  const { handler } = podFor("buildA", redis, mirror);

  await handler.set(PAGE_KEY, makeEntry(), {});

  assert.deepEqual(redis.calls.set, [`buildA:${PAGE_KEY}`]);
  assert.equal(mirror.calls.set.length, 1);
  assert.equal(
    mirror.calls.set[0].key,
    `buildA:${PAGE_KEY}`,
    "the mirror uses the same scoped key so a fallback read hits"
  );
});

test("a failing Redis write never throws", async () => {
  const redis = makeSharedRedis();
  redis.set = async () => {
    throw new Error("redis write failed");
  };
  const { handler } = podFor("buildA", redis);

  await assert.doesNotReject(() => handler.set(PAGE_KEY, makeEntry(), {}));
});

test("a failing Redis write is COUNTED and logged, not discarded", async (t) => {
  const logged = [];
  t.mock.method(console, "error", (...args) => logged.push(args.join(" ")));
  const before = health().writeFailures ?? 0;

  const redis = makeSharedRedis();
  redis.set = async () => {
    throw new Error("connection timeout");
  };
  const { handler } = podFor("buildA", redis);

  await handler.set(PAGE_KEY, makeEntry(), {});

  assert.equal(
    health().writeFailures,
    before + 1,
    "a discarded write is how thousands of failures went unnoticed — it must be counted"
  );
  assert.match(health().lastWriteError, /connection timeout/);
});

test("an OOM rejection is counted SEPARATELY — the node is full, not slow", async (t) => {
  t.mock.method(console, "error", () => {});
  const before = health().oomFailures ?? 0;

  const redis = makeSharedRedis();
  redis.set = async () => {
    throw new Error("OOM command not allowed when used memory > 'maxmemory'.");
  };
  const { handler } = podFor("buildA", redis);

  await handler.set(PAGE_KEY, makeEntry(), {});

  assert.equal(
    health().oomFailures,
    before + 1,
    "OOM means Redis is FULL — that needs capacity work, not a retry, so it is tracked apart"
  );
});

test("a successful write records no failure", async (t) => {
  t.mock.method(console, "error", () => {});
  const before = health().writeFailures ?? 0;

  const { handler } = podFor("buildA", makeSharedRedis());
  await handler.set(PAGE_KEY, makeEntry(), {});

  assert.equal(health().writeFailures ?? 0, before);
});

test("a mirror-only failure does NOT count as a Redis write failure", async (t) => {
  t.mock.method(console, "error", () => {});
  const before = health().writeFailures ?? 0;

  const mirror = makeMirror();
  mirror.set = async () => {
    throw new Error("lru exploded");
  };
  const { handler } = podFor("buildA", makeSharedRedis(), mirror);

  await assert.doesNotReject(() => handler.set(PAGE_KEY, makeEntry(), {}));
  assert.equal(
    health().writeFailures ?? 0,
    before,
    "the mirror is a local convenience; only the shared store's failure matters"
  );
});

test("revalidateTag invalidates both Redis and the mirror", async () => {
  const redis = makeSharedRedis();
  const mirror = makeMirror();
  const { handler } = podFor("buildA", redis, mirror);

  await handler.revalidateTag("collection:summer");

  assert.deepEqual(redis.calls.revalidateTag, ["collection:summer"]);
  assert.deepEqual(mirror.calls.revalidateTag, ["collection:summer"]);
});

test("a failing revalidateTag never throws", async () => {
  const redis = makeSharedRedis();
  redis.revalidateTag = async () => {
    throw new Error("hscan timed out");
  };
  const { handler } = podFor("buildA", redis);

  await assert.doesNotReject(() => handler.revalidateTag("seo"));
});

// ---------------------------------------------------------------------------
// 3. prepare() must be forwarded, or the library's boot-time sweep is a no-op
// ---------------------------------------------------------------------------

test("prepare() is forwarded to the underlying handlers", async () => {
  const redis = makeSharedRedis();
  let redisPrepared = false;
  redis.prepare = async () => {
    redisPrepared = true;
  };
  const mirror = makeMirror();
  const { handler } = podFor("buildA", redis, mirror);

  assert.equal(
    typeof handler.prepare,
    "function",
    "the library calls handler.prepare?.() — without it the sweep silently never runs"
  );
  await handler.prepare();
  assert.equal(redisPrepared, true);
});

test("a failing prepare() is logged, not thrown", async (t) => {
  // prepare() deliberately console.warn()s the failure. Capture it rather than
  // letting it print: a warning in a passing test run trains you to ignore
  // warnings, which is how a real one gets missed. t.mock auto-restores.
  const warnings = [];
  t.mock.method(console, "warn", (...args) => warnings.push(args.join(" ")));

  const redis = makeSharedRedis();
  redis.prepare = async () => {
    throw new Error("hscan failed");
  };
  const { handler } = podFor("buildA", redis);

  await assert.doesNotReject(
    () => handler.prepare(),
    "a boot-time sweep failure must not stop the pod from starting"
  );
  assert.equal(
    warnings.some((w) => w.includes("hscan failed")),
    true,
    "the failure must still be surfaced — swallowing it silently is how the missing prepare() went unnoticed"
  );
});
