# storefront-starter-app

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
