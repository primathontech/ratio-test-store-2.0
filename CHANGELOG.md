# storefront-starter-app

## 0.2.34

### Patch Changes

- OS API gateway rate-limit readiness: `/api/v1/apps/installed` forwards the shopper's IP
  (`shopperForwardHeaders`) on its uncached upstream read; the editor template loader,
  translations, preview reads and A/B manifest reads send `gk-merchant-id`. New
  `src/utils/os-headers.ts`, AGENTS.md rules for calling OS APIs from route handlers, the
  correct production gateway host in `.env.example`, and `SKIP_BUILD_STATIC_PARAMS`
  documented there.
- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
  - @shopkit/ab@0.3.0
  - @shopkit/apps-platform-react@0.4.0
  - @shopkit/data-layer@1.7.0
  - @shopkit/editor-bridge@0.15.1

## 0.2.33

### Patch Changes

- Updated dependencies
  - @shopkit/data-layer@1.6.0

## 0.2.32

### Patch Changes

- Updated dependencies
  - @shopkit/apps-platform-react@0.3.0
  - @shopkit/apps-platform@0.3.0
  - @shopkit/editor-bridge@0.15.0
  - @shopkit/app-shell@2.1.0

## 0.2.31

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @shopkit/editor-bridge@0.14.0
  - @shopkit/apps-platform@0.2.0
  - @shopkit/apps-platform-react@0.2.0

## 0.2.30

### Patch Changes

- Updated dependencies [20f07ca]
- Updated dependencies
  - @shopkit/editor-bridge@0.13.0

## 0.2.29

### Patch Changes

- Updated dependencies
  - @shopkit/ab@0.2.0
  - @shopkit/events@0.15.0
  - @shopkit/analytics@1.4.0

## 0.2.28

### Patch Changes

- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
  - @shopkit/analytics@1.3.0
  - @shopkit/builder@0.2.0
  - @shopkit/cli@0.7.0
  - @shopkit/editor-bridge@0.12.0
  - @shopkit/events@0.14.0

## 0.2.27

### Patch Changes

- fix(storefront-starter): `validate:route` no longer fails on the custom-pages route

  No app code changes — this picks up the route-validation fix in `@shopkit/cli`.
  `src/app/(shop)/pages/[handle]/page.tsx` is a package-owned factory route
  (`createPagesRoute()`), so its routeContext and async default export live inside
  `@shopkit/editor-bridge` and are invisible to the validator's text scan. S8 read that as
  a violation and failed every full run and pre-commit that touched the file. The route is
  now excluded by full path suffix, so `products/[handle]` and `collections/[handle]` stay
  validated.

- Updated dependencies [b89982c]
  - @shopkit/cli@0.6.2

## 0.2.26

### Patch Changes

- Updated dependencies [1a6d591]
  - @shopkit/editor-bridge@0.11.0

## 0.2.25

### Patch Changes

- fix(storefront-starter): webhook purges now reach home pages, PLP facets and sitemaps

  No app code changes — this picks up the cache-tag fixes in `@shopkit/data-layer` and
  `@shopkit/webhooks`. What changes for a storefront on this version:

  - **Home pages built from `COLLECTION_BY_HANDLES` data sources now invalidate.** That
    read attached no cache tags, so a `product.updated` delivery that correctly refreshed
    the PDP and the collection page reached nothing on the home page, and an edited title
    or price kept rendering there for the rest of the route's `revalidate` window (an hour
    on a stock `revalidate = 3600`). Its entry now carries `collection:<handle>` for every
    collection it renders.
  - **PLP facets refresh with their collection.** `getCollectionFilters` now carries
    `collection:<handle>`, so a price or availability change updates the filter rail
    instead of leaving stale ranges behind.
  - **Sitemaps and search endpoints become purgeable.** `getProducts` now carries the broad
    `products` tag — the producer that tag never had, which is why
    `revalidateTag("products")` from an inventory route matched nothing. Creating,
    deleting or renaming a product now refreshes those surfaces instead of waiting for the
    ISR window.

  Nothing to configure. One caveat worth knowing: a product-field edit reaches a home-page
  grid only if the webhook delivery lists the product's collections **by handle** — the tag
  is `collection:<handle>`, so a payload carrying collection titles or ids still cannot
  match. Check a delivery's `purged.tags` in the logs if a grid looks stale.

- Updated dependencies [59c583f]
- Updated dependencies [413fad1]
  - @shopkit/data-layer@1.4.4
  - @shopkit/webhooks@0.5.1

## 0.2.24

### Patch Changes

- fix(storefront-starter): a backend outage no longer caches a 404 over a good page

  All eight product and collection routes swallowed upstream failures and called
  `notFound()`. To Next.js that is a _successful_ render, so the 404 was written into
  the route cache under `revalidate = 3600` and served for an hour, replacing a page
  that had rendered fine minutes earlier.

  Next.js already keeps the last successfully generated page when a render **throws**,
  re-arms it with a 3-30s retry window, and retries on the next request. Nothing reached
  that path because every error was caught. So: the fetch wrapper now throws when the
  data layer reports `success: false`, and the page-level `catch (error) { notFound(); }`
  is removed — it turned any render error, including a page-builder or translation
  failure, into a cacheable 404.

  `if (!product) notFound()` is unchanged and is now the only route to a 404.

  Two visible consequences. Render bugs that used to surface as a quiet 404 now surface
  as a 500, and a backend outage during `next build` now fails the build instead of
  shipping prerendered 404s. Both are intended.

- fix(storefront-starter): floor the cache-handler retention age

  On a failed render Next re-sets the entry with `revalidate: 30` to retry sooner. The
  handler derives the Redis TTL from that same number (`staleAge * 1.5`), so the page
  being preserved was handed a 45-second lease and was evicted after one traffic gap —
  the next request then rendered cold against the down backend and 500'd. Verified in a
  local outage test: 5400s lease became 45s without this, 3600s with it.

  `estimateExpireAge` now floors retention at `SF_CACHE_MIN_EXPIRE_AGE` (default 3600).
  Retry cadence is unaffected; only expiry is floored.

- Updated dependencies
  - @shopkit/data-layer@1.4.3

## 0.2.23

### Patch Changes

- Updated dependencies

  - @shopkit/webhooks@0.5.0

  Raises the cache-invalidation body cap from 256 KB to 2 MB. 256 KB was set against
  "real payloads are a few KB" and sat below real traffic: an apparel merchant's
  `products/update` deliveries measured 268,602 and 300,558 bytes and were refused with 413. That gate runs _before_ signature verification, so those deliveries were dropped
  whole — no tag, no path, no warm — and the product's price and title never reached the
  storefront until the route's own `revalidate` window rolled over an hour later. The
  symptom was "the price sometimes doesn't update", with nothing pointing at the webhook.

  Also makes a 401 countable: it used to return directly, so it was the one outcome with
  no `cache invalidation rejected` log line, and grouping rejections by reason silently
  excluded the most common production failure. The response is unchanged and still terse.

  **Deployment note:** an ingress in front of the pod has its own body limit and the
  smaller of the two wins — nginx defaults `client_max_body_size` to 1 MB. That limit
  must be raised to at least 2 MB or this upgrade changes nothing.

  No route change: `route.ts` is untouched. Both the cap and the logging live inside
  `handleCacheInvalidation`.

## 0.2.22

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.12.0

## 0.2.21

### Patch Changes

- Updated dependencies

  - @shopkit/webhooks@0.4.1

  Actually restores commerce cache invalidation. 0.2.19 was supposed to, but shipped
  the GoKwik signature header format inferred rather than read, and the inference was
  wrong — so product and collection deliveries kept returning 401, now logging
  `Malformed cache-invalidation signature header` at length 80 instead of failing
  silently. Pages have still been refreshing on their ISR timer throughout, so content
  was stale-but-moving rather than frozen.

  The worker sends a comma-separated element list, `t=<unix_ts>,v1=<hex digest>`, not a
  bare digest. The parts 0.2.19 inferred — the signed string and hex encoding — were
  correct; only the header encoding was wrong.

  No route change: `route.ts` passes the whole `Headers` object already, and this is
  entirely inside the verifier. The mega menu and SEO config path is untouched, and
  replay protection is unchanged (±5 minutes, enforced against the signed `t=` value
  rather than the separate timestamp header — that header is not covered by the MAC).

## 0.2.20

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.11.0

## 0.2.19

### Patch Changes

- Updated dependencies

  - @shopkit/webhooks@0.4.0

  Restores commerce cache invalidation, which is **currently broken**. The GoKwik
  delivery worker now signs with `X-GoKwik-Signature` / `X-GoKwik-Timestamp`, and this
  route only understood `x-webhook-signature` — so every product and collection
  delivery has been returning 401 and purging nothing since that worker shipped.
  Pages have still been refreshing on their ISR timer, so content was stale-but-moving
  rather than frozen, and the origin has been taking more load than it should.

  The verifier now dispatches on which headers arrive, so **the mega menu and SEO
  config keep working unchanged** — they still sign the old way and that path is
  untouched.

  Commerce deliveries also gain replay protection: the timestamp is inside the signed
  string, so a captured delivery cannot be replayed outside a ±5 minute window.

  No env change. Still one endpoint, still one `WEBHOOK_SECRET`, shared by both
  producers.

  **Before deploying:** the GoKwik signed-string shape is inferred from the delivery
  worker's PR, not from a captured request. Confirm with the backend team, or verify
  against one real non-prod delivery, before relying on commerce invalidation in
  production — if the shape differs, deliveries keep 401ing (same as today, no
  regression, but no fix either).

## 0.2.18

### Patch Changes

- Updated dependencies

  - @shopkit/webhooks@0.3.0

  **ACTION REQUIRED — set `WEBHOOK_SECRET` in every environment that receives webhooks
  (production and sandbox included) before deploying this.** The handler now fails
  closed: with the secret missing or blank it refuses every cache-invalidation delivery
  with a 401, logging that the secret is not set. It previously accepted **unsigned**
  deliveries whenever `NODE_ENV` was not exactly `"production"` — which included an
  unset `NODE_ENV`, so a bare `node server.js` or a container that forgot the variable
  was an anonymous cache-invalidation surface, and a forged `cache.clear_all` is a
  full-site regeneration DoS. Do **not** set `WEBHOOK_ALLOW_UNSIGNED=1` outside local
  development; it is read only when `WEBHOOK_SECRET` is absent.

  `^0.2.2` would not have resolved 0.3.0 (a caret range on 0.x stops at the next
  minor), so this bump is required to pick the release up at all.

  Security fixes in this release, all reachable from this app's mounted route:

  - A `seo.updated` payload of `{"path":"/layout"}` had the same blast radius as
    `cache.clear_all`. `revalidatePath` does not resolve a route — it writes into
    Next's implicit-tag namespace, and every rendered page carries `_N_T_/layout`, so
    a reserved final path segment purged the whole site. Route groups are real
    segments too, making `/(shop)/layout` a subtree purge.
  - `revalidateChangedPage` and `warmPaths` were exported from the package root while
    performing no signature check at all — importing either gave unauthenticated
    invalidation without defeating the HMAC. Both are now internal.
  - Bodies over 256KB are rejected with 413 before the HMAC runs over them, and the
    signature header format is anchored, so a valid digest with junk appended no
    longer verifies.

  Reliability and correctness:

  - The page-warming fetch is bounded (10s timeout, max 16 concurrent per pod). It
    had no timeout, so a slow storefront pinned a socket and its closure for the life
    of the process — a steady leak on the highest-frequency events, invisible because
    the endpoint still returned 200. Concurrency was unbounded across deliveries, so
    a large catalog sync aimed one render per delivery at our own origin while it was
    already regenerating what those deliveries had purged.
  - A product rename now purges the old handle; `previousHandle` was parsed and then
    ignored, leaving the old URL serving a stale PDP.
  - Handle case is normalised, so the interpolated path matches the tag. Next route
    matching is case-sensitive, so a handle like `Shade-3` purged tag
    `product:shade-3` but path `/products/Shade-3`, which matched nothing while the
    response reported it as purged.
  - `custom_collections/*` and `smart_collections/*` deliveries now resolve — six of
    twelve mapped topics previously could not find their entity and returned 400.
  - Every 4xx now logs a reason, each delivery carries a correlation id echoed in the
    response, and a failure logs one entry with the stack, the request context, and
    how much of the plan had already been applied.

  **`search.reindex` was removed and now returns 400.** It purged a tag no fetch in
  the platform attaches, so it could only ever return 200 having invalidated nothing.
  If search results need invalidating, tag the search read in `@shopkit/data-layer`
  first, then re-add the event — in that order.

  This app's own route (`src/app/api/webhooks/cache-invalidation/route.ts`) is already
  updated for the renamed config option (`warm: { baseUrl }` → `warmBaseUrl`).

## 0.2.17

### Patch Changes

- Updated dependencies

  - @shopkit/data-layer@1.4.2
  - @shopkit/webhooks@0.2.2

  Product cache invalidation now works across every product URL. Product reads
  emit a `product:<handle>` tag, so the `product.updated` webhook reaches the A/B
  variant and the nested `/collections/[collectionname]/products/[handle]` routes
  as well as the canonical PDP — previously only the canonical path was purged.

  Cache-invalidation webhooks are also no longer silent: signature mismatches,
  successful purges, deliveries that purged nothing, and page-warming failures all
  log now, and the response body reports what was invalidated.

## 0.2.16

### Patch Changes

- Updated dependencies

  - @shopkit/navigation@1.5.1
  - @shopkit/seo@1.2.1

  Both config fetches raised their Data Cache TTL from 300s to 3600s. Because
  Next.js takes the lowest `revalidate` across a route — and the `(shop)` layout
  calls `getNavMenus()` on every request — 300s was silently capping every route
  that renders chrome, so pages exporting `revalidate = 3600` were served with a
  300s window. Those pages now get the window they declare.

  Menu and SEO-config freshness now depends on the `navigation.updated` /
  `seo.updated` webhooks rather than the timer; without them, propagation moves
  from 5 minutes to 1 hour.

## 0.6.1

### Patch Changes

- fix(cli): route validation no longer fails on editor preview lanes or `getPageBuilder()` pages
  - `validate:route` now excludes the `editor-preview` and `internal-preview` segments in
    both the directory walk and explicit file lists (`--staged-only` / `--files`). These are
    package-owned editor lanes, not shopper routes, so the static generation contract
    (routeContext, async default export, server-only) does not apply. Previously a full run
    skipped `editor-preview` inconsistently and pre-commit failed on both lanes.
  - S8's page-builder check now accepts `getPageBuilder()` — the app's bootstrap wrapper
    around `createPageBuildingEngine()` — so migrated pages stop reporting false positives.

## 0.2.15

### Patch Changes

- Updated dependencies
  - @shopkit/cli@0.6.0
  - @shopkit/editor-bridge@0.10.0

## 0.2.14

### Patch Changes

- Updated dependencies [e1d08af]
- Updated dependencies
  - @shopkit/core@0.1.7
  - @shopkit/data-layer@1.4.0
  - @shopkit/webhooks@0.2.0

## 0.2.13

### Patch Changes

- Updated dependencies
  - @shopkit/builder@0.1.6

## 0.2.12

### Patch Changes

- Render each top-level nav item's own image (icon/featured) in the reference Header (desktop + mobile) via `entry.image`; data-gated so no image means no markup change.
- Updated dependencies
  - @shopkit/navigation@1.5.0

## 0.2.11

### Patch Changes

- Updated dependencies [2761b96]
- Updated dependencies
  - @shopkit/editor-bridge@0.8.0

## 0.2.10

### Patch Changes

- Updated dependencies
- Updated dependencies [29bfef6]
  - @shopkit/editor-bridge@0.7.0
  - @shopkit/navigation@1.2.0

## 0.2.9

### Patch Changes

- Updated dependencies
  - @shopkit/editor-bridge@0.6.0

## 0.2.7

### Patch Changes

- Updated dependencies [9ef1b38]
  - @shopkit/editor-bridge@0.5.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @shopkit/navigation@1.0.0
  - @shopkit/builder@0.1.5

## 0.2.4

### Enhancements

- **Editor-compatible static policy pages** — added `privacy-policy`, `shipping-policy`, `cancellation-policy`, and `terms-of-use` as static pages (heading + rich-text body rendered via `tEditable`).
  - Packaged as a **self-contained feature pack** at `src/feature-packs/static-pages/` — every authored file (templates, default locale copy, route logic, editor registry entries) lives in that one folder, with a `guide.md` runbook. Downstream/merchant repos pull the folder cleanly (no scattered edits to conflict on) and wire it via the guide, or `rm -rf` the folder to opt out. See the guide's "Removing the pack" section.
  - The only touchpoints outside the pack are framework-mandated pointers: a 1-line re-export `app/<slug>/page.tsx` per route, and a one-line `...spread` of the pack's exports in `theme-constants.ts` + `static-templates-registry.ts`.
  - Pages render their bundled default copy out of the box (no editor backend required); editor-backend overrides still layer on top.
  - Added a default `about-us` locale (the app previously shipped the `about-us` page without one) and aligned its heading/body typography with the policy pages.

## 0.2.3

### Enhancements

- **KwikPass `page_view_kp` retargeting events wired end-to-end.** KwikEngage retargeting flows (Home / Collection / Product / Cart) listen for a `page_view_kp` DOM CustomEvent on every page; this release adds the missing dispatchers and mounts them across all 8 product/collection routes (top-level + nested under collections, both `/products` and `/products-b` variants).
  - Two new client trackers in `integrations/kwikpass-custom/`: `KwikPassProductView` and `KwikPassCollectionView`. Both fire on mount + every SPA navigation, no-op when `cartToken` is absent, and extract the KwikEngage payload from the commerce-client product/collection prop.
  - `KwikPassCustom` now fires `PAGE_VIEW` (mapped to `type: "other"`) only when the path isn't a product/collection page AND a `cartToken` exists. Cart access switched from `getCartToken()` (sync localStorage) to `useCartStore()` (Zustand).
  - `events.ts` consolidated to a single sink (the `page_view_kp` DOM event). Drops the legacy `window.gokwik.track` and FB Pixel paths, drops the `LOGIN`/`LOGOUT` enum members + dispatchers, drops the `KwikPassEvent` envelope. `KWIK_ENGAGE_TYPE_MAP` is a typed `Record` so TS enforces map completeness.
  - Dropped the unused `useCheckoutToken` hook (zero callers).
- **New optional env var**: `NEXT_PUBLIC_KP_EVENT_ALLOWED` (`"yes"` default, `"no"` to opt out). Replaces the previous `NEXT_PUBLIC_GOKWIK_ENABLED` gate.

### Patch Changes

- Updated dependencies [045346f]
- Updated dependencies
  - @shopkit/cli@0.4.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @shopkit/cli@0.3.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @shopkit/cli@1.0.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @shopkit/editor-bridge@0.3.0

## 0.2.0

### Enhancements

- **Editor-bridge wireup via `@shopkit/editor-bridge`.** Every merchant cloned from this version of starter ships editor preview support.
  - `<EditorHostMount />` mounts once in `app/layout.tsx`. EditorHost gates internally on `?editor=true`, so customer traffic pays only the ~500 B gate; the bridge runtime lazy-loads only inside editor iframes.
  - `app/api/editor-preview/cache/route.ts` exports `createPreviewCacheRoute()`. The cache singleton lives inside the package; `createPreviewCacheRoute` (writer) and `readEditorPreviewState` (reader) share the same instance. Same-origin POST, no CORS.
  - `app/editor-preview/static/page.tsx` exports `createStaticPreviewPage(...)` for the deprecated static-template lane.
  - `bootstrap/next-config.js` composes the `frame-ancestors` CSP via `buildFrameAncestorsHeaders` from `@shopkit/editor-bridge/next`. CSP and the runtime origin gate read the same constants from `editor-integration/editor-bridge-config.js`.
  - `bootstrap/builder.ts` splits widget manifests by editor vs production. The editor manifest routes every widget through a `"use client"` shim so the page builder renders client components inside the editor iframe; the production manifest stays server-rendered. `getPageBuilder({ isEditor })` picks the cache.
  - `ui/layout/SectionWrapper.tsx` imports `SectionWrapperEditor` from the package; the local copy is deleted. Selection between editor and core wrapper continues to read `NEXT_PUBLIC_ENABLE_EDITOR_CHANGES` (`"true"` → editor wrapper, otherwise → core), matching the existing convention.
- **New required env var**: `NEXT_PUBLIC_EDITOR_ORIGIN`. Sets the one allowed editor origin. Unset → empty allowlist → bridge fails closed.
- **New dependency**: `@shopkit/editor-bridge` at `^0.2.0`.
- **Automatic static generation via `@shopkit/data-layer`** — all 8 dynamic route pages (`collections`, `collections-b`, `products`, `products-b`, and all 4 nested collection-product variants) now use factory functions from `@shopkit/data-layer` instead of reading `FEATURED_COLLECTIONS` env vars. At build time, all collection and product handles are fetched from the commerce backend automatically — no manual configuration needed.
- **Removed `FEATURED_COLLECTIONS`, `HOMEPAGE_FEATURED_COLLECTIONS`, `HOMEPAGE_FEATURED_COLLECTIONS_PRODUCT_LIMIT` env vars** — these are no longer read anywhere in the app.

### Theme-team follow-ups (per editable template)

- Thread `readEditorPreviewState<PageConfig>(searchParams)` into each editable `page.tsx` you want the editor to drive. Cache miss falls through to the normal template-load path silently.

## 0.1.12

### Enhancements

- **GTM (Google Tag Manager) SDK** — new `gtm-pixel-sdk.js` self-registers with PixelRuntime, loads the merchant's GTM container, and mirrors all 13 standard events to `window.dataLayer` using the GA4 Enhanced Ecommerce schema (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`, etc.).
  - Applies **Consent Mode v2 defaults (granted)** before the container loads so future cookie-banner integrations can downgrade via `gtag('consent', 'update', …)`. Consent values are validated — invalid entries (e.g. `"yes"` instead of `"granted"`) log an error rather than being silently dropped.
  - **`page_type` auto-attached to every dataLayer push** (`product` / `collection` / `cart` / `search` / `thank_you` / `home` / `page`, derived from the URL at push time). Lets merchants build triggers like _event equals `view_item` AND page_type equals `product`_ without regex matching on paths or data-layer-variable scoping tricks. Auto-attach skips the no-event `{ ecommerce: null }` clear pushes and any payload that already sets its own `page_type`.
  - **Ecommerce clear pushes follow Google's official pattern** — `{ ecommerce: null }` with no `event` field — preventing merchants from accidentally binding tags to a `_clear` event.
  - **Debug-gated logging.** Production-grade: `[GTMSDK]` debug/info logs are silent in production by default. Auto-enables on `localhost` / `window.__shopkit_debug === true`, or force-on via `NEXT_PUBLIC_GTM_DEBUG=true`. Errors are always emitted via `console.error` (Sentry-compatible).
  - **Configurable default currency.** Multi-merchant deployments override via `NEXT_PUBLIC_CURRENCY` (default `INR`).
  - **Resilient container injection.** On `script.onerror` (adblock / CSP block / network) the `__OPEN_STORE_GTM_LOADED__` idempotency flag is reset so a later SPA re-hydration can retry. Errors logged with the container ID for fast diagnosis.
  - **Custom `dataLayerName` honored end-to-end.** When a merchant overrides the default dataLayer name, consent commands route through a private gtag that pushes to the correct dataLayer (not `window.dataLayer`).
  - **Push wrapper is non-mutating** — clones payloads before adding `page_type` so callers passing shared/frozen objects don't break.
  - Supports GTM Server-Side env auth/preview via optional `NEXT_PUBLIC_GTM_AUTH` / `NEXT_PUBLIC_GTM_PREVIEW`. New env vars: `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CURRENCY`, `NEXT_PUBLIC_GTM_DEBUG`.

## 0.1.11

### Enhancements

- **Google Ads SDK — per-event conversion labels** — `events` config map lets merchants assign a unique conversion label per event (Purchase, AddToCart, BeginCheckout, etc.). Each conversion action in Google Ads has its own label; the SDK now supports them all via one config. Legacy `conversionLabel` still works as Purchase fallback. New env var: `NEXT_PUBLIC_GOOGLE_ADS_EVENTS`.
- **GA4 SDK — `isolated` flag** — set `isolated: true` to scope GA4 events to GA4 only (via `send_to: measurementId`), preventing fan-out to Google Ads on a shared `window.gtag`. Default is `false` (fan-out enabled) which matches the Shopify Google channel behavior. New env var: `NEXT_PUBLIC_GA_ISOLATED`.

### Bug Fixes

- **Phantom page_view to Google Ads** — gtag.js was auto-firing a page_view to the Ads conversion ID before our explicit `send_page_view: false` config could apply. Fixed by pushing `gtag('set', { send_page_view: false })` as a global default before injecting gtag.js.
- **Page view routing** — GA4 SDK now uses gtag's built-in `send_page_view: true` (scoped to GA4 measurementId) instead of a manual subscription. Page views land in GA4 only; SPA route changes are handled by GA4 Enhanced Measurement on the property side.
- **Production-grade hardening of Google Ads SDK** — idempotent registration guard, debug-gated info logs, value coercion to numbers, currency fallback configurable per merchant, CSP / adblock error reporting via `script.onerror`, `gtag('config', ..., { groups: 'google-ads' })` to avoid clobbering GA4 settings.

## 0.1.10

### Bug Fixes

- **Meta Pixel SPA PageViews** — `meta-pixel-sdk.js` now sets `fbq.disablePushState = true` and `fbq.allowDuplicatePageViews = true` before `fbq('init')`. Without these flags, fbevents.js auto-fired an extra un-deduplicated PageView on every SPA navigation (pushState patch), and then silently dropped all subsequent manual PageView calls due to its internal dedup cache (`ca[pixelId]`).
- Bump `@shopkit/events` to `^0.9.3`

## 0.1.9

### Enhancements

- **Experiment tracking** — A/B test cookies automatically captured on every event via `@shopkit/events@0.9.0` experiment middleware. SDKs receive experiment data in `metadata.experiment`.
- **SDK logging overhaul** (meta-pixel-sdk.js, ga4-pixel-sdk.js):
  - Consistent category format: `[SDK] [Category] message` — categories: `Init`, `Event`, `CAPI`, `Auth`
  - Colored output for quick scanning
  - Full event object logged (expandable in console) — replaces cherry-picked field logging
  - Removed `JSON.stringify` and unused `eid()` helper
- Bump `@shopkit/events` to `^0.9.0`

## 0.1.8

### Patch Changes

- Add **KwikCart** side cart integration (`integrations/kwikcart-custom/`)
  - Replaces default `CustomCartDrawer` when `NEXT_PUBLIC_KWIKCART_DISABLE` is `false` (default)
  - New env vars: `NEXT_PUBLIC_KWIKCART_SCRIPT_URL`, `NEXT_PUBLIC_KWIKCART_CURRENCY`, `NEXT_PUBLIC_KWIKCART_CURRENCY_FORMAT`
  - `KwikCartEmitter` captures `AddToCart` events from side cart quantity increments
- Remove duplicate `@shopkit/analytics` `publishEvent()` calls from 8 integration files — `@shopkit/events` emitters already fire the same events

## 0.1.7

### Patch Changes

- CAPI endpoint security — HMAC signature authentication
  - **HMAC signing** — Meta Pixel SDK signs every CAPI request with HMAC-SHA256 using a shared secret (`NEXT_PUBLIC_CAPI_HMAC_SECRET`)
  - **Server verification** — CAPI route verifies signature at Step 0:AUTH before processing events, returns 401 on failure
  - **Time-window tokens** — 5-minute token windows with lazy refresh, compatible with `sendBeacon` (no async at flush time)
  - **Backward compatible** — if `NEXT_PUBLIC_CAPI_HMAC_SECRET` is not set, all requests pass through

## 0.1.6

### Patch Changes

- CAPI route rewrite with structured logging and multi-pixel support
  - **Structured logging** — all lines use `[CAPI:<requestId>]` prefix with step tags (`Step 1:RECEIVE` through `Step 6:RESULT`) for easy grep-based debugging
  - **Payload logging** — raw payload logged at Step 1, enriched/hashed payload at Step 4 for end-to-end debugging
  - **Multi-pixel dispatch** — supports `FACEBOOK_MULTI_CAPI_ACCESS_TOKENS` env var for dispatching to multiple Facebook pixels in parallel
  - **Uses `@shopkit/events/meta`** — PII hashing via shared `MetaParamsBuilder` instead of inline crypto
  - **EMQ validation** — dev-mode warnings for missing email/phone (reduces Event Match Quality)
  - Updated dependencies
    - @shopkit/events@0.6.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.5.0
  - @shopkit/app-shell@1.0.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.4.0
  - @shopkit/app-shell@1.0.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @shopkit/cli@0.2.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @shopkit/cart@0.1.1
  - @shopkit/discounts@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies
  - @shopkit/app-shell@0.1.1
  - @shopkit/builder@0.1.1
  - @shopkit/discounts@0.1.1

## 0.1.6

### Patch Changes

- Updated dependencies [d939fba]
  - @shopkit/events@0.10.0
  - @shopkit/app-shell@2.0.0

## 0.1.14

### Enhancements

- **Affiliate / UTM attribution wired end-to-end via `@shopkit/events/affiliate`** — mount `<AffiliateTracker autoCapture />` in the root layout to capture UTM parameters and platform click IDs (`gclid`, `fbclid`, `msclkid`, `ttclid`, `twclid`, `li_fat_id`) on landing. Captured data lands in `sessionStorage` under the `affiliate_data` key, where the existing `userEnricherMiddleware` already reads from — so every pixel event (Meta, GA4, Google Ads, GTM) gets attribution context attached automatically with no per-pixel wiring.
- **GoKwik checkout now carries affiliate context.** `CustomCheckoutService.initializeCheckout` reads `getAffiliateParams()` and passes the snapshot as `attributes` on the `commerceClient.createCheckout` payload, so the merchant's checkout API receives the attribution data alongside the cart token.

## 0.1.13

### Bug Fixes

- **Declare 5 `@radix-ui/*` packages that were pulled transitively** — `@radix-ui/react-checkbox`, `react-label`, `react-select`, `react-slot`, `react-tabs` are imported directly from storefront-starter source (admin theme blocks, builder UI) but were never declared in `package.json`. They worked locally because the monorepo's workspace hoisting surfaced them anyway; on the synced standalone target (and consumer forks) `bun install` failed with undeclared-dep errors. Declared at the same versions used by sibling apps (e.g. momsco). No code change required.

## 0.1.12

### Enhancements

- **GTM (Google Tag Manager) SDK** — new `gtm-pixel-sdk.js` self-registers with PixelRuntime, loads the merchant's GTM container, and mirrors all 13 standard events to `window.dataLayer` using the GA4 Enhanced Ecommerce schema (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`, etc.).
  - Applies **Consent Mode v2 defaults (granted)** before the container loads so future cookie-banner integrations can downgrade via `gtag('consent', 'update', …)`. Consent values are validated — invalid entries (e.g. `"yes"` instead of `"granted"`) log an error rather than being silently dropped.
  - **`page_type` auto-attached to every dataLayer push** (`product` / `collection` / `cart` / `search` / `thank_you` / `home` / `page`, derived from the URL at push time). Lets merchants build triggers like _event equals `view_item` AND page_type equals `product`_ without regex matching on paths or data-layer-variable scoping tricks. Auto-attach skips the no-event `{ ecommerce: null }` clear pushes and any payload that already sets its own `page_type`.
  - **Ecommerce clear pushes follow Google's official pattern** — `{ ecommerce: null }` with no `event` field — preventing merchants from accidentally binding tags to a `_clear` event.
  - **Debug-gated logging.** Production-grade: `[GTMSDK]` debug/info logs are silent in production by default. Auto-enables on `localhost` / `window.__shopkit_debug === true`, or force-on via `NEXT_PUBLIC_GTM_DEBUG=true`. Errors are always emitted via `console.error` (Sentry-compatible).
  - **Configurable default currency.** Multi-merchant deployments override via `NEXT_PUBLIC_CURRENCY` (default `INR`).
  - **Resilient container injection.** On `script.onerror` (adblock / CSP block / network) the `__OPEN_STORE_GTM_LOADED__` idempotency flag is reset so a later SPA re-hydration can retry. Errors logged with the container ID for fast diagnosis.
  - **Custom `dataLayerName` honored end-to-end.** When a merchant overrides the default dataLayer name, consent commands route through a private gtag that pushes to the correct dataLayer (not `window.dataLayer`).
  - **Push wrapper is non-mutating** — clones payloads before adding `page_type` so callers passing shared/frozen objects don't break.
  - Supports GTM Server-Side env auth/preview via optional `NEXT_PUBLIC_GTM_AUTH` / `NEXT_PUBLIC_GTM_PREVIEW`. New env vars: `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CURRENCY`, `NEXT_PUBLIC_GTM_DEBUG`.

## 0.1.11

### Enhancements

- **Google Ads SDK — per-event conversion labels** — `events` config map lets merchants assign a unique conversion label per event (Purchase, AddToCart, BeginCheckout, etc.). Each conversion action in Google Ads has its own label; the SDK now supports them all via one config. Legacy `conversionLabel` still works as Purchase fallback. New env var: `NEXT_PUBLIC_GOOGLE_ADS_EVENTS`.
- **GA4 SDK — `isolated` flag** — set `isolated: true` to scope GA4 events to GA4 only (via `send_to: measurementId`), preventing fan-out to Google Ads on a shared `window.gtag`. Default is `false` (fan-out enabled) which matches the Shopify Google channel behavior. New env var: `NEXT_PUBLIC_GA_ISOLATED`.

### Bug Fixes

- **Phantom page_view to Google Ads** — gtag.js was auto-firing a page_view to the Ads conversion ID before our explicit `send_page_view: false` config could apply. Fixed by pushing `gtag('set', { send_page_view: false })` as a global default before injecting gtag.js.
- **Page view routing** — GA4 SDK now uses gtag's built-in `send_page_view: true` (scoped to GA4 measurementId) instead of a manual subscription. Page views land in GA4 only; SPA route changes are handled by GA4 Enhanced Measurement on the property side.
- **Production-grade hardening of Google Ads SDK** — idempotent registration guard, debug-gated info logs, value coercion to numbers, currency fallback configurable per merchant, CSP / adblock error reporting via `script.onerror`, `gtag('config', ..., { groups: 'google-ads' })` to avoid clobbering GA4 settings.

## 0.1.10

### Bug Fixes

- **Meta Pixel SPA PageViews** — `meta-pixel-sdk.js` now sets `fbq.disablePushState = true` and `fbq.allowDuplicatePageViews = true` before `fbq('init')`. Without these flags, fbevents.js auto-fired an extra un-deduplicated PageView on every SPA navigation (pushState patch), and then silently dropped all subsequent manual PageView calls due to its internal dedup cache (`ca[pixelId]`).
- Bump `@shopkit/events` to `^0.9.3`

## 0.1.9

### Enhancements

- **Experiment tracking** — A/B test cookies automatically captured on every event via `@shopkit/events@0.9.0` experiment middleware. SDKs receive experiment data in `metadata.experiment`.
- **SDK logging overhaul** (meta-pixel-sdk.js, ga4-pixel-sdk.js):
  - Consistent category format: `[SDK] [Category] message` — categories: `Init`, `Event`, `CAPI`, `Auth`
  - Colored output for quick scanning
  - Full event object logged (expandable in console) — replaces cherry-picked field logging
  - Removed `JSON.stringify` and unused `eid()` helper
- Bump `@shopkit/events` to `^0.9.0`

## 0.1.8

### Patch Changes

- Add **KwikCart** side cart integration (`integrations/kwikcart-custom/`)
  - Replaces default `CustomCartDrawer` when `NEXT_PUBLIC_KWIKCART_DISABLE` is `false` (default)
  - New env vars: `NEXT_PUBLIC_KWIKCART_SCRIPT_URL`, `NEXT_PUBLIC_KWIKCART_CURRENCY`, `NEXT_PUBLIC_KWIKCART_CURRENCY_FORMAT`
  - `KwikCartEmitter` captures `AddToCart` events from side cart quantity increments
- Remove duplicate `@shopkit/analytics` `publishEvent()` calls from 8 integration files — `@shopkit/events` emitters already fire the same events

## 0.1.7

### Patch Changes

- CAPI endpoint security — HMAC signature authentication
  - **HMAC signing** — Meta Pixel SDK signs every CAPI request with HMAC-SHA256 using a shared secret (`NEXT_PUBLIC_CAPI_HMAC_SECRET`)
  - **Server verification** — CAPI route verifies signature at Step 0:AUTH before processing events, returns 401 on failure
  - **Time-window tokens** — 5-minute token windows with lazy refresh, compatible with `sendBeacon` (no async at flush time)
  - **Backward compatible** — if `NEXT_PUBLIC_CAPI_HMAC_SECRET` is not set, all requests pass through

## 0.1.6

### Patch Changes

- CAPI route rewrite with structured logging and multi-pixel support
  - **Structured logging** — all lines use `[CAPI:<requestId>]` prefix with step tags (`Step 1:RECEIVE` through `Step 6:RESULT`) for easy grep-based debugging
  - **Payload logging** — raw payload logged at Step 1, enriched/hashed payload at Step 4 for end-to-end debugging
  - **Multi-pixel dispatch** — supports `FACEBOOK_MULTI_CAPI_ACCESS_TOKENS` env var for dispatching to multiple Facebook pixels in parallel
  - **Uses `@shopkit/events/meta`** — PII hashing via shared `MetaParamsBuilder` instead of inline crypto
  - **EMQ validation** — dev-mode warnings for missing email/phone (reduces Event Match Quality)
  - Updated dependencies
    - @shopkit/events@0.6.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.5.0
  - @shopkit/app-shell@1.0.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.4.0
  - @shopkit/app-shell@1.0.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @shopkit/cli@0.2.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @shopkit/cart@0.1.1
  - @shopkit/discounts@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies
  - @shopkit/app-shell@0.1.1
  - @shopkit/builder@0.1.1
  - @shopkit/discounts@0.1.1
