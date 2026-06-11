# Static Pages — Feature Pack

Editor-compatible **static policy pages** for a ShopKit / storefront-starter
Next.js app: `privacy-policy`, `shipping-policy`, `cancellation-policy`,
`terms-of-use`. Each is a translation-only page (heading + rich-text body)
rendered through `tEditable`, so the copy is editable in the visual editor.

**This folder is the complete, self-contained home for the feature.** Every
authored file lives here — components, default copy, route logic, editor
registry entries, _and_ whole-file copies of the few framework files you must
touch to switch it on (see [`wiring/`](#the-wiring-folder)).

> **Nothing is wired by default.** Dropping this folder into a repo adds the
> code but does not yet create any routes. Follow [Wiring it up](#wiring-it-up)
> to switch the pages on — or just delete the folder if you don't want them.

> **Hand this folder to your repo's Claude** and say:
> _"Wire up the static-pages feature pack by following
> `src/feature-packs/static-pages/guide.md`."_

---

## What's in here

```
feature-packs/static-pages/
├── constants.ts          STATIC_PAGES_TEMPLATE_KEYS  (template-id slugs, as const)
├── registry.ts           STATIC_PAGES_REGISTRY       (lazy editor static-template entries)
├── templates/            the page components (client, use tEditable)
│   └── privacy-policy.tsx · shipping-policy.tsx · cancellation-policy.tsx · terms-of-use.tsx · about-us.tsx
├── locales/              default English copy, shaped { "<slug>": { title, content__rich } }
│   └── privacy-policy.en.json · … · terms-of-use.en.json · about-us.en.json
├── routes/               real route logic (server)
│   ├── shared.tsx        makeStaticPageMetadata() + renderStaticPage() helpers
│   └── privacy-policy.tsx · … · terms-of-use.tsx · about-us.tsx
├── wiring/               whole-file copies of the framework files you must touch
│   ├── app/<slug>/page.tsx.example          → copy to src/app/<slug>/page.tsx
│   ├── editor-integration/theme-constants.ts.example
│   └── editor-integration/registries/static-templates-registry.ts.example
└── guide.md              this file
```

`*.example` files are **not** compiled — they're reference copies you apply by
hand (see below), so the pack itself stays inert until you wire it.

---

<a name="the-wiring-folder"></a>

## Wiring it up

There are only **three** places the framework forces you to touch outside this
folder, and `wiring/` holds a copy of each. Apply them and the pages go live.

> Paths assume the standard storefront-starter layout (`@/*` → `src/*`, theme
> `dawn`). If your repo diverged, map to your equivalents — the shapes match.

### 1. Routes — copy 4 files into `app/`

Next.js registers a route from a file in the `app/` tree. Copy each reference
file, dropping the `.example` suffix:

```
wiring/app/privacy-policy/page.tsx.example       →  src/app/privacy-policy/page.tsx
wiring/app/shipping-policy/page.tsx.example      →  src/app/shipping-policy/page.tsx
wiring/app/cancellation-policy/page.tsx.example  →  src/app/cancellation-policy/page.tsx
wiring/app/terms-of-use/page.tsx.example         →  src/app/terms-of-use/page.tsx
```

Each is a 1-line re-export of the real route in `routes/` — no logic to merge.

### 2. Template ids — `src/editor-integration/theme-constants.ts`

See `wiring/editor-integration/theme-constants.ts.example`. Add **only** the two
`▶ ADD` lines to your existing file:

```ts
import { STATIC_PAGES_TEMPLATE_KEYS } from "@/feature-packs/static-pages/constants"; // ▶ ADD

export const THEMES = {
  DAWN: {
    id: "dawn",
    static_templates: {
      ABOUT_US: "about-us",
      ...STATIC_PAGES_TEMPLATE_KEYS, // ▶ ADD
    },
  },
} as const;
```

### 3. Editor registry — `src/editor-integration/registries/static-templates-registry.ts`

See `wiring/editor-integration/registries/static-templates-registry.ts.example`.
Add **only** the two `▶ ADD` lines to your existing file:

```ts
import { STATIC_PAGES_REGISTRY } from "@/feature-packs/static-pages/registry"; // ▶ ADD

export const STATIC_TEMPLATES_REGISTRY = {
  [THEMES.DAWN.id]: {
    [THEMES.DAWN.static_templates.ABOUT_US]: lazy(
      () => import("@/editor-integration/static-templates/about-us")
    ),
    ...STATIC_PAGES_REGISTRY, // ▶ ADD
  },
} as const;
```

### 4. Regenerate + verify

```bash
bun run generate        # refresh widget/template/i18n manifests
bun run tsc --noEmit    # typecheck
bun run dev             # visit /privacy-policy etc. — expect 200 + content
```

The pages render their bundled default copy out of the box (no editor backend
required) and remain editable in the visual editor.

### About Us (enhanced, pre-existing page) — optional

Unlike the 4 policy pages, **`about-us` already exists** in the base
storefront-starter app (its own `app/about-us/page.tsx`, template, registry
entry, and theme-constants key all ship with starter). This pack includes an
**enhanced** about-us (styled template + bundled default copy) as an _optional
drop-in replacement_ — it is **not** part of the `STATIC_PAGES_TEMPLATE_KEYS` /
`STATIC_PAGES_REGISTRY` spreads, so the base about-us never depends on the pack.

To switch the base about-us to the enhanced version:

1. Replace the contents of your existing `src/app/about-us/page.tsx` with
   `wiring/app/about-us/page.tsx.example` (a re-export of the pack route).
2. _(Optional, for the editor static-preview lane)_ repoint the existing
   `about-us` import in `static-templates-registry.ts` to
   `() => import("@/feature-packs/static-pages/templates/about-us")`.

To revert: restore your original `app/about-us/page.tsx` (and the registry
import). The base about-us in dev never referenced the pack, so there's nothing
else to undo.

---

## How content resolves at runtime

`routes/shared.tsx#renderStaticPage` builds the translation map as:

```
{ ...packDefaultLocaleJSON, ...getRouteTranslations({ staticTemplateId: slug }) }
```

- The **pack's default JSON** is the base → the page always renders copy, even
  with `NEXT_PUBLIC_ENABLE_EDITOR_CHANGES` unset / editor backend down.
- `getRouteTranslations` (common + any editor-backend overrides) layers on top,
  so a merchant's edited copy wins over the bundled default.

To change the default copy, edit the JSON in `locales/`.

---

## Customizing

- **Edit default copy** → `locales/<slug>.en.json` (`title`, `content__rich`).
- **Change layout/styling** → `templates/<slug>.tsx`.
- **Add another static page** → add a key to `constants.ts`, an entry to
  `registry.ts`, a `templates/<slug>.tsx`, a `locales/<slug>.en.json`, a
  `routes/<slug>.tsx` (copy an existing one), and a
  `wiring/app/<slug>/page.tsx.example`; then wire it per steps above.
- **Another locale** → today the routes import `*.en.json`. For multi-locale,
  extend `routes/shared.tsx` to pick the JSON by `locale`.

---

## Gotchas

- **`validate:route` (S8) will flag these routes once wired.** The route
  validator expects the literal `createPageBuildingEngine` page-builder
  bootstrap. Static pages legitimately don't use it — known CLI gap, not a bug.
  (The pre-existing `about-us` page fails the same check.)
- **`.generated/` is gitignored** — i18n / widget manifests are rebuilt by
  `bun run generate`. Never hand-edit them; they don't live in this pack.
- **`about-us` is a pre-existing upstream page.** The pack ships an _enhanced_
  about-us as an optional replacement (see above), kept out of the policy
  spreads so the base page never depends on the pack. The 4 policy pages, by
  contrast, are brand-new and fully owned by the pack.

---

## Removing the pack

Never wired it? Just `rm -rf src/feature-packs/static-pages` — there's nothing
else to undo, because the pack is inert until wired.

Already wired it and want it gone?

1. Delete the four `src/app/<slug>/page.tsx` route files.
2. Remove the two `▶ ADD` lines (import + `...spread`) from `theme-constants.ts`
   and `static-templates-registry.ts`.
3. `rm -rf src/feature-packs/static-pages`

Then `bun run generate && bun run tsc --noEmit`. No residue.
