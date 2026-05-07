# storefront-starter-app

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
