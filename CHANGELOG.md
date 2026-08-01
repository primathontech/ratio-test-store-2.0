# storefront-starter-app

## 0.1.30

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

## 0.1.29

### Patch Changes

- Updated dependencies [e1d08af]
- Updated dependencies
  - @shopkit/core@0.1.7
  - @shopkit/data-layer@1.4.0
  - @shopkit/webhooks@0.2.0

## 0.1.28

### Patch Changes

- Updated dependencies
  - @shopkit/navigation@1.5.0

## 0.1.27

### Patch Changes

- Updated dependencies [2761b96]
- Updated dependencies
  - @shopkit/editor-bridge@0.8.0

## 0.1.26

### Patch Changes

- Updated dependencies
- Updated dependencies [29bfef6]
  - @shopkit/navigation@1.4.0
  - @shopkit/seo@1.2.0

## 0.1.25

### Patch Changes

- Updated dependencies
- Updated dependencies [29bfef6]
  - @shopkit/editor-bridge@0.7.0
  - @shopkit/navigation@1.2.0

## 0.1.24

### Patch Changes

- Updated dependencies
  - @shopkit/editor-bridge@0.6.0

## 0.1.23

### Patch Changes

- Updated dependencies
- Updated dependencies [29bfef6]
  - @shopkit/navigation@1.2.0

## 0.1.22

### Patch Changes

- Updated dependencies [9ef1b38]
  - @shopkit/editor-bridge@0.5.0

## 0.1.21

### Patch Changes

- Updated dependencies
- Updated dependencies [1bfd207]
  - @shopkit/navigation@1.1.0

## 0.1.20

### Patch Changes

- Updated dependencies
  - @shopkit/navigation@1.0.0
  - @shopkit/builder@0.1.5

## 0.1.19

### Patch Changes

- Updated dependencies
  - @shopkit/data-layer@1.3.0

## 0.1.18

### Patch Changes

- Updated dependencies [045346f]
- Updated dependencies
  - @shopkit/cli@0.4.0

## 0.1.17

### Patch Changes

- Updated dependencies
  - @shopkit/cli@0.3.0

## 0.1.15

### Patch Changes

- Updated dependencies [d939fba]
  - @shopkit/events@0.10.0
  - @shopkit/app-shell@2.0.0

## 0.1.14

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.9.5
  - @shopkit/app-shell@1.0.5
  - @shopkit/builder@0.1.4
  - @shopkit/core@0.1.4
  - @shopkit/i18n@0.1.4
  - @shopkit/webhooks@0.1.1
  - @shopkit/asset-cache@1.0.1

## 0.1.13

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.9.4
  - @shopkit/app-shell@1.0.4

## 0.1.12

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.9.3
  - @shopkit/app-shell@1.0.4

## 0.1.11

### Patch Changes

- Updated dependencies
  - @shopkit/app-shell@1.0.4

## 0.1.10

### Patch Changes

- Updated dependencies
  - @shopkit/app-shell@1.0.3

## 0.1.9

### Patch Changes

- Updated dependencies
  - @shopkit/app-shell@1.0.2

## 0.1.8

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.9.2
  - @shopkit/app-shell@1.0.1

## 0.1.7

### Patch Changes

- Updated dependencies
  - @shopkit/events@0.9.1
  - @shopkit/app-shell@1.0.1

## 0.1.6

### Patch Changes

- Updated dependencies
  - @shopkit/cart@0.1.4

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
