# Generic "Ratio" Dummy Store — Design

**Date:** 2026-07-21
**Goal:** Turn this bblunt-branded storefront into a generic "Ratio" dummy store that (a) shows whatever collections the configured merchant has — no hardcoded handles — and (b) is branded "ratio" instead of "bblunt" throughout, including the theme folder name.

The work is split into two independently-shippable phases. **Phase 1 ships and is verified before Phase 2 starts.**

---

## Phase 1 — Generic collections-driven home page

### Problem

`src/themes/bblunt-2/templates/home/default.ts` wires the home page to ~12 hardcoded bblunt Shopify collection handles (`for-hair-fall-control-home-page-1`, `salon-secret-home-page-1`, …) via `COLLECTION` / `COLLECTION_BY_HANDLES` data sources, plus hardcoded "View all" handles and bblunt-branded content sections. A new merchant has none of those handles, so every carousel resolves empty → "no collections displayed". All sources are `required: false`, so the build succeeds but the page is empty.

### Approach

Replace the body of `home/default.ts` with a minimal, merchant-agnostic template modeled on the already-working `collection-list` template. Use `DATA_SOURCE_TYPES.COLLECTIONS` (empty `params`) — the builder's generic "multiple collections with pagination" source that returns the merchant's actual collections with no handles/IDs — feeding the existing `CollectionList` widget (grid of collection cards).

### Resulting template shape

```ts
export const template: PageConfig = {
  id: "bblunt-2-home", // (renamed to ratio-home in Phase 2)
  dataSources: {
    collectionsData: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: {},
      options: { params: { page: 1, limit: 12 } },
      required: false,
    },
  },
  sections: [
    {
      id: "home-collection-list-section",
      name: "Collection List",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {/* 0 padding */},
      },
      widgets: [
        {
          id: "home-collection-list",
          name: "Collection List",
          type: WIDGET_TYPES.CollectionList,
          dataSourceKey: "collectionsData",
          settings: {
            variant: "v1",
            heading: "Shop by Collection",
            pageSize: 12,
          },
        },
      ],
    },
  ],
};
```

### Removed

- All 12 hardcoded-handle data sources.
- Branded sections: Banner Carousel, Shop by Concerns, Shop by Categories, Hair Care BFFs, Shine Academy Banner, Testimonials.
- Every `t:bblunt-2_home_default.*` reference on this page (heading becomes a plain string to avoid coupling to bblunt locale files).

### What makes it generic

`COLLECTIONS` + empty `params` asks the data layer for the configured merchant's collections. Changing `NEXT_PUBLIC_MERCHANT_ID` shows that merchant's collections with zero code changes.

### Decisions

- **Count:** `limit: 12` with the widget's built-in pagination.
- **Heading:** plain string `"Shop by Collection"`.
- **Not touched in Phase 1:** header/footer chrome, other templates.

### Verification

Run the dev server against the configured `NEXT_PUBLIC_MERCHANT_ID` and confirm the home page renders that merchant's collections (real proof `COLLECTIONS` resolves for this backend). Confirm empty-merchant case still renders without error.

### Files touched

- `src/themes/bblunt-2/templates/home/default.ts` (body replaced).
- Possibly `src/themes/bblunt-2/locales/pages/home/*` (drop now-unused keys) — optional; unused keys are harmless.

---

## Phase 2 — Rename bblunt → ratio + delete bblunt-specific offer pages

Cosmetic/branding refactor. The store already works for any merchant regardless of folder name; this makes the identity "ratio". Full scope confirmed by user: theme identity + folders, i18n namespaces + `t:` keys, brand copy, internal code identifiers, and deletion of bblunt-specific offer templates.

### 2a. Trim the store to a minimal feature showcase

The dummy store keeps all **functional** features but drops marketing pages, extra static pages, and duplicate designs. Confirmed keep/remove:

**KEEP:**

- Core: `home`, `products` (+ `/products/[handle]` PDP, `/products`), `collection` (+ `/collections/[collectionname]` PLP), `collection-list` (`/collections` index)
- Static: `about-us` only
- Infra: `header`, `footer`, `not-found`
- Cart & checkout: `thank-you` + cart-drawer / kwikpass integrations
- Visual editor: `editor-preview/static` route + `editor-integration`
- Account & orders: `account`, `addresses`, `orders`, `order-details`, `order-history`
- Search: `search` (searchtap)

**REMOVE:**

- Offer/sale (18): `aff-get4-freebies`, `aff-offer-flat250`, `affiliate-flat250-off-above698`, `bau-offer-page`, `combo-kit`, `crm-shine-squad-mega`, `fb-advance-smoothening-category-sale`, `fb-hair-colour-category-sale`, `fb-hairfall-category-sale`, `fb-heat-protection-category-sale`, `fb-intense-moisture-category-sale`, `flat3`, `flat4`, `shine-squad-b2g2`, `shine-squad-bb30-offer`, `shine-squad-get999`, `shine-squad-mega-offer`, `shine-squad-weekly-offer`
- Extra static: `privacy-policy`, `return-policy`, `terms-and-conditions`
- Duplicate `-b` variants: `home-b`, `collection-b`, `products-b` + routes `collections-b/*`, `products-b/*`

For each removed item: delete the template folder `src/themes/<theme>/templates/<name>/`, its locale folder `locales/pages/<name>/`, the corresponding app route under `src/app/(shop)/...`, and remove references (`variant-registry.ts`, header/footer nav links pointing at removed routes). Regenerate templates + i18n. Verify build after this sub-step before starting the rename.

### 2b. Theme identity + folders

- `git mv src/themes/bblunt-2 → src/themes/ratio`
- `git mv public/bblunt-2 → public/ratio` (fonts, images, section-previews, svg, videos)
- `.env` / `.env.example`: `NEXT_PUBLIC_THEME_NAME` and `NEXT_PUBLIC_MERCHANT_NAME` → `ratio`; default in `src/utils/index.ts` `getThemeName()` → `ratio`.
- Update ~40 `src/app/**` literal imports `@/themes/bblunt-2/...` → `@/themes/ratio/...`.
- Update `public/bblunt-2/...` asset references (`src/app/fonts.tsx` + any others) → `public/ratio/...`.
- Widget/editor namespace folders: `git mv src/widgets/bblunt-2 → src/widgets/ratio`; `git mv src/editor-integration/sections/bblunt-2 → src/editor-integration/sections/ratio`; update imports.

### 2c. i18n namespaces + `t:` keys

- i18n namespaces (`bblunt-2_<page>_default`) are generated from the theme name. After the folder rename, regenerate (`bun run generate:i18n`) so manifests become `ratio_<page>_default`.
- Update every hardcoded `t:bblunt-2_*` string in templates → `t:ratio_*`. Verify no raw keys render.

### 2d. Internal code identifiers

- `BbluntHeader` → `RatioHeader`, `BbluntFooter` → `RatioFooter`, `BbluntProductInfo` → `RatioProductInfo`, `bblunt-cart-drawer` → `ratio-cart-drawer`, and similar.
- Rename source files/folders + update all imports. Regenerate widget manifests (`bun run generate:widgets`) so generated client-shims (`.generated/client-shims/Bblunt*.tsx`) regenerate under new names. Never hand-edit generated files.

### 2e. Brand copy

- Replace user-facing `BBLUNT` / `BBlunt` display text with `Ratio`.
- **Explicitly excluded** (would break if changed): external URLs/handles `bbluntindia`, `bbluntsalons`, `bblunt.com` and any real API/analytics endpoints. Leave these as-is or address separately with the user.

### Phase 2 verification

- `bun run generate` (all manifests) succeeds.
- `bun run perf:check` / `next build` succeeds.
- Grep for residual `bblunt` shows only intentionally-excluded external URLs.
- Dev server renders home, collection, product, and account pages with correct branding and translations (no raw `t:` keys).

---

## Sequencing

1. Phase 1 → implement → verify → commit.
2. Phase 2 → detailed plan → implement in the sub-steps above → verify → commit.

Each phase is a separate commit series on the current `sandbox` branch (or a dedicated branch if preferred).

## Risks

- **Rename breaks build via missed reference / generated artifact** → mitigate by regenerating manifests and running the full build after each sub-step (2a→2e), not at the end.
- **Brand-copy replace clobbers external URLs** → exclusion list; replace display text only, verify links.
- **Translation keys silently fall back to raw strings** → post-rename visual/route check for `t:` leakage.
