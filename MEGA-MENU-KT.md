# Mega Menu — how to build your header & footer

This storefront ships a **working, admin-managed header + footer** (desktop + mobile, mega menus and
all). Your job is **only to restyle it to your brand**. The data is already wired.

> Menu **content** (links, columns, mega panels, images) is managed by you in the **admin panel** —
> never in code. The storefront just renders whatever you publish.

---

## The whole data contract is ONE hook

```tsx
import { useNav } from "@shopkit/navigation/client";

const entries = useNav("main-menu"); // → NavEntry[], ready to render
```

`useNav(handle)` returns an array of **entries**. Each entry has a `kind`. You `switch` on it and
render your markup. **That's the entire API.** You never read the backend JSON, never call a helper,
never look at `resource_type` / `depth` / `url`.

```tsx
entries.map((e) => {
  switch (e.kind) {
    case "link":
      return <a href={e.href}>{e.label}</a>;
    case "external":
      return (
        <a href={e.href} target="_blank" rel="noopener noreferrer">
          {e.label}
        </a>
      );
    case "dropdown":
      return <MyDropdown label={e.label} items={e.items} />;
    case "mega":
      return <MyMegaPanel hero={e.panel.hero} columns={e.panel.columns} />;
  }
});
```

> **TypeScript guides you:** `NavEntry` is a discriminated union, so if you miss a `kind` your build
> fails. If the platform ever adds a kind, the compiler tells you. You don't need to memorize anything.

---

## The 4 kinds (what each entry gives you)

Every entry has: `id` (use as React key), `label` (display text), `ariaLabel` (accessibility, pre-built).

| `kind`     | extra fields                                                     | render as                                     |
| ---------- | ---------------------------------------------------------------- | --------------------------------------------- |
| `link`     | `href: string`                                                   | a normal link                                 |
| `external` | `href: string`                                                   | a link with `target="_blank"` (opens new tab) |
| `dropdown` | `href: string \| null`, `isExternal`, `items: Leaf[]`            | a trigger + a simple list of `items`          |
| `mega`     | `href: string \| null`, `isExternal`, `panel: { hero, columns }` | a trigger + a multi-column panel              |

For `dropdown`/`mega`, `href` is non-null when the **trigger is itself a link** (e.g. "Baby Care" → a
collection). When non-null: make the label a link **and** open the panel/list. When null: it's just a
label that opens the panel. If `isExternal` is `true`, that trigger link is external — render it with
`target="_blank" rel="noopener noreferrer"`.

A **`panel`** (mega) is: `{ hero: Image | null, columns: Column[] }`.
A **`Column`** is: `{ id, title?, href: string | null, isExternal, image: Image | null, items: Leaf[] }`.
A **`Leaf`** is: `{ id, title?, href: string, image: Image | null, isExternal }`.

Rendering rules baked into the data (you just read the fields):

- **Card vs text link:** a leaf/column with an `image` → render a card; otherwise a text link.
- **A column can itself be a link** (`column.href` set) — render its `title` as a link.
- **External links anywhere:** `isExternal` is on leaves, columns, **and** `dropdown`/`mega` triggers.
  Any menu item can be an external link — when `isExternal` is `true`, render it with
  `target="_blank" rel="noopener noreferrer"`. (The reference `Header/V1` + `Footer/V1` already do this.)
- **Hero** (`panel.hero`) — an optional featured image for the panel.

---

## What you actually do (your only work)

1. **Set one env var** (you already have `NEXT_PUBLIC_MERCHANT_ID`):

   ```
   NEXT_PUBLIC_NAV_MENU_API_URL=<gateway base incl. /api/v1>
   #   Prod: https://api-gateway.gokwik.io/api/v1
   #   QA:   https://api-gw-v4.dev.gokwik.io/qa/pi/pc/api/v1
   ```

   Unset → header/footer fall back gracefully (no crash), but you won't see live menus.

   > **Collection/product URLs:** admin returns those links as a bare handle; the storefront prepends
   > the route prefix. Defaults are `/collections` and `/products` (matching this app). If your store
   > uses a different scheme (e.g. singular `/collection`, `/product`), set it **once** on the provider
   > in `src/app/layout.tsx`:
   > `<NavigationProvider … routes={{ collection: "/collection", product: "/product" }}>`.

2. **Build your menus in admin** (`main-menu`, `footer`). No code.

3. **Restyle** `Header/V1` + `Footer/V1` (markup + CSS). Keep the `useNav(...)` call and the
   `switch (kind)`; change everything visual. Swap `"Store"` for your logo.

That's it. You write **no** data-fetching code — `src/app/layout.tsx` already fetches and provides the
menus, and auto-fetches any handle your chrome references.

---

## You cannot take the site down

The platform handles every failure for you:

- **No env / backend down / 404 / timeout / bad data** → `useNav` returns `[]` → render your small
  fallback (see `FALLBACK_NAV` in `Header/V1`). The page never blanks.
- **Broken links, missing titles/urls** → already filtered / safely defaulted in the data.
- **A render-time crash** (even a bug in your own header) → the `<NavBoundary>` around the chrome in
  `layout.tsx` catches it and hides just the header/footer. **The rest of the page stays up.**

So: keep a fallback for the empty case, and you're done.

---

## Test locally

```
NEXT_PUBLIC_NAV_MENU_API_URL=<qa or prod url> bun run dev
```

- Desktop: hover a `mega` item → panel opens.
- Mobile (< 768px): hamburger → drawer → expand a group.
- Footer: column link groups.
- Unset the URL → fallback nav renders (no crash).

---

## Editing header/footer in the visual editor

Header + footer are **shared chrome** — rendered once by `layout.tsx` (`renderChrome()`), not page
sections. To set that up (and make chrome editable), do all of:

**1. Put the chrome in its own templates.** Create `templates/header/default.ts` (announcement bar +
header sections) and `templates/footer/default.ts` (footer + bottom bar), each a `PageConfig`:

```ts
// templates/header/default.ts
export const template: PageConfig = {
  id: "<theme>-header",
  dataSources: {},
  sections: [
    {
      id: "header-section",
      name: "Header",
      type: SECTION_TYPES.HEADER_SECTION,
      settings: {
        /* … */
      },
      widgets: [
        {
          id: "<theme>-header",
          name: "Header",
          type: WIDGET_TYPES.Header,
          settings: { variant: "v1", menuHandle: "main-menu" },
        },
      ],
    },
  ],
};
```

**2. Strip chrome OUT of every page template.** Delete the header/footer/announcement/bottom-bar
sections from `home`, `products`, `collection`, … so pages are body-only:

```ts
// templates/home/default.ts → sections
- { id: "announcement-bar-section", … },   // ← delete
- { id: "header-section", … },             // ← delete (now in header template)
  { id: "hero-section", … },               //   keep body sections
- { id: "footer-section", … },             // ← delete (now in footer template)
- { id: "bottom-bar-section", … },         // ← delete
```

**3. Strip chrome from static page components too** (React components, not pageConfig):

```tsx
// static-templates/about-us.tsx
- return (<><AnnouncementBar/><Header/><main>…</main><Footer/><BottomBar/></>);
+ return (<main>…</main>);   // the layout adds chrome around children
```

> Skip step 2 or 3 and chrome renders **twice** (once from the layout, once inline).

**4. Register the chrome templates** in `themes/<theme>/theme-registry.ts` so the editor can find them
— `routeContext.type` must be exactly `"header"` / `"footer"` (the editor keys on it):

```ts
[TEMPLATE_TYPES.header]: { default: {
  templatePath: "/themes/<theme>/templates/header/default.ts",
  routeContext: { templateName: "header", type: "header", path: "/", params: {}, query: {} },
}}, // …same for footer (type: "footer")
```

**5. Regenerate + migrate** (seeds chrome into the DB + theme structure the editor reads):

```bash
bun run generate:templates
MERCHANT_ID=<id> EDITOR_API_BASE_URL=<editor-be-url> bun run migrate:theme <theme>
```

- **Order:** deploy the storefront (with chrome) **first**, migrate **last** — else the editor edits a
  header the live store ignores.
- Set `NEXT_PUBLIC_ENABLE_EDITOR_CHANGES=true` so the store reads DB templates (editor-saved chrome shows live).

---

## Reference

- **Copy this app's `Header/V1` + `Footer/V1`** — the canonical example of `useNav` → markup. Restyle them.
- Need lower-level control than `useNav` gives you? Advanced helpers live in
  **`@shopkit/navigation/advanced`** — you almost never need them for a normal header/footer.
