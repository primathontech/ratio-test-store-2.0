# Mega Menu — Merchant KT (how to build your header & footer)

This storefront ships with a **working, admin-managed header + footer menu** out of the box
(desktop + mobile). Your job is **only to restyle it to your brand** — the data wiring is done.

> The menu **content** (links, columns, mega panels, images) is managed by you in the **admin
> panel** — never in code. This storefront just renders whatever you publish there.

---

## What you get for free (already wired — don't touch)

- `src/app/layout.tsx` already fetches the menus and provides them (`getNavMenus` + `NavigationProvider`).
- `main-menu` + `footer` (the backend's default/protected menus) are fetched automatically by the
  package. Any **other** menu a widget references (e.g. `sales-menu`) is also fetched
  automatically — the layout derives the handles from your chrome config (`menuHandle` settings). No handle list to maintain.
- The chrome templates (`src/themes/dawn/templates/header` & `/footer`) already select the menu via `menuHandle`.
- The **Header** and **Footer** widgets already consume the menu and render every menu type.

So you do **not** write any data-fetching code.

---

## What you need to do

### 1. Set ONE env var
You already have `NEXT_PUBLIC_MERCHANT_ID`. Add the nav API URL (the only new one):

```
NEXT_PUBLIC_NAV_MENU_API_URL=<gateway base, including /api/v1>
#   Prod: https://api-gateway.gokwik.io/api/v1
#   QA:   https://api-gw-v4.dev.gokwik.io/qa/pi/pc/api/v1
```
If it's unset, the header/footer fall back gracefully (no crash) — but you won't see live menus.

### 2. Create your menus in admin
Build `main-menu` (header) and `footer` in the admin panel. No code.

### 3. Restyle the header & footer to your brand — **this is your only real work**
Edit these files — change the **look**, keep the **data calls**:

| File | Restyle | Keep |
|---|---|---|
| `src/widgets/common/Header/V1/index.tsx` + `style.css` | logo/brand, colors, spacing, mega-panel layout, mobile drawer look | `useMenu(...)`, `getRenderStrategy`, `getEffectiveUrl`, `hasImage`, `getMegaMenuColumns` |
| `src/widgets/common/Footer/V1/index.tsx` + `style.css` | columns layout, colors, spacing | `useMenu("footer")`, `getEffectiveUrl`, `isBrokenLink` |

Swap the `"Store"` brand text for your logo (Header `brandName` setting / markup). Everything else
is CSS + markup.

---

## The 4 rules you must NOT break

1. **Import from `@shopkit/navigation/client`** only — never `@shopkit/navigation` (server-only; it
   will fail the build if imported in a widget — that's the guard working).
2. Drive each top-level item off **`getRenderStrategy(item)`** → `"link" | "dropdown" | "external" | "mega-menu"`.
3. Decide a leaf is a **card vs. a text link with `hasImage(item)`** — **never** `resource_type`.
   (The menu has no price/cart fields; a "product" leaf is just image + title + link.)
4. Keep a **graceful fallback** when `useMenu()` returns null/empty (see `FALLBACK_NAV` in the
   Header). This keeps the header non-blank when there's no data — including inside the editor preview.

---

## Helpers & hooks — the entire API you use

Everything imports from **`@shopkit/navigation/client`**. You never read the raw API or touch
`resource_type`/`url`/`external_url` directly — these helpers answer the questions for you.

```ts
import {
  useMenu,
  getRenderStrategy,
  getEffectiveUrl,
  getMegaMenuColumns,
  hasImage,
  isBrokenLink,
  getAriaLabel,
  type NavMenu,
  type NavItem,
} from "@shopkit/navigation/client";
```

### The hook

| Hook | Signature | Returns / use |
|---|---|---|
| `useMenu` | `useMenu(handle: string): NavMenu \| null` | The menu for a handle (`"main-menu"`, `"footer"`, …). **May be `null`** (no env / backend down / handle missing / editor preview) — always guard: `const items = menu?.items ?? []`. |
| `useMenuHandles` | `useMenuHandles(): string[]` | The handles currently available (rarely needed). |

### The helpers (operate on a `NavItem`)

| Helper | Signature | What it answers / when to use |
|---|---|---|
| **`getRenderStrategy`** | `(item) => "mega-menu" \| "dropdown" \| "external" \| "link"` | **The main one.** How a *top-level* item should render. `switch` on it. |
| **`getEffectiveUrl`** | `(item) => string \| null` | The href for any item — works for all resource types (uses `url`, or `external_url` for external). Fallback: `getEffectiveUrl(item) ?? "/"`. |
| **`hasImage`** | `(item) => boolean` | Render a **card** (image) or a **text link**? Use this for leaf card-vs-text — **never** `resource_type`. |
| **`getMegaMenuColumns`** | `(item) => NavItem[]` | The columns of a mega-menu item (its depth-1 children). |
| **`isBrokenLink`** | `(item) => boolean` | Skip this item? (upstream resource deleted). `if (isBrokenLink(item)) return null;` |
| **`getAriaLabel`** | `(item) => string` | Accessibility label with a strategy-aware suffix (e.g. "…, opens in new tab"). |
| `isExternalLink` | `(item) => boolean` | True if it opens in a new tab (HTTP). (Usually you just switch on `getRenderStrategy`.) |
| `isMegaMenuTrigger` | `(item) => boolean` | True if this opens a mega panel. (Covered by `getRenderStrategy`.) |
| `isMegaMenuColumn` | `(item) => boolean` | True if a depth-1 item is a mega column. (Edge cases.) |

### The types you'll touch

```ts
NavMenu  = { handle, title, items: NavItem[], … }
NavItem  = {
  id: string;            // ← React key (use this, NOT resource_id)
  title: string;         // ← display text
  items: NavItem[];      // ← children (columns / leaves)
  image?: { src; alt_text?; width?; height? };   // ← present only if attached
  // url / resource_type / external_url exist but you read them via helpers, not directly
}
```

### The recipe (top-level loop + leaf) — this is the whole pattern

```tsx
const menu = useMenu("main-menu");
(menu?.items ?? []).map((item) => {
  if (isBrokenLink(item)) return null;            // skip deleted
  switch (getRenderStrategy(item)) {              // decide how to render
    case "mega-menu":
      return <Panel key={item.id} columns={getMegaMenuColumns(item)} />;
    case "dropdown":
      return <Dropdown key={item.id} items={item.items} />;
    case "external":
      return <a key={item.id} href={getEffectiveUrl(item)!} target="_blank" rel="noopener noreferrer">{item.title}</a>;
    case "link":
      return <Link key={item.id} href={getEffectiveUrl(item) ?? "/"}>{item.title}</Link>;
  }
});

// a leaf inside a mega column:
hasImage(leaf)                                     // card vs text — by image, not type
  ? <Card image={leaf.image!} title={leaf.title} href={getEffectiveUrl(leaf) ?? "/"} />
  : <Link href={getEffectiveUrl(leaf) ?? "/"}>{leaf.title}</Link>;
```

That's it — `useMenu` + ~5 helpers cover every menu the admin can produce (and any future
resource type, which falls back to a link). The working version is in `Header/V1/index.tsx`.

> **A mega-menu trigger can also be a link** (e.g. "Baby Care" → a collection): the backend sends a `url`
> on the trigger when the merchant made it clickable. The reference Header handles it — when
> `getEffectiveUrl(item)` is non-null it renders the trigger title as a `<Link>` (still opening the
> panel); on mobile the row is a label-link + a separate expand caret. When there's no url it's a plain
> label. Keep this branch if you restyle; the helpers cover it and there's no data work on your side.

---

## Cases the reference already handles (so you don't have to think about them)

- **Top level:** plain link, dropdown (children), external link (opens in a new tab), mega menu.
- **Mega panel:** multiple columns; a column hero image; text-link columns; product/image **cards**
  (driven by `hasImage`).
- **Mobile:** hamburger → slide-in drawer → accordion (mega columns + dropdown children flattened).
- **Broken links** (`broken_link: true`) are skipped automatically.
- **No data / backend down / editor preview:** falls back to `FALLBACK_NAV`, never crashes or blanks.

Just restyle these — the logic is already correct.

---

## How to test locally
```
NEXT_PUBLIC_NAV_MENU_API_URL=<qa or prod url> bun run dev
```
- Desktop: hover a mega-menu item → panel opens.
- Mobile (resize < 768px): hamburger → drawer → expand a group.
- Footer: column link groups.
- Unset the URL → header still renders the fallback nav (no crash).

---

## Deeper reference
- **Widget Author Contract + full flow:** `plans/0001-mega-menu/README.md` (§4.1 is the contract; read the rest for the why).
- **The reference code to copy:** this app's `Header/V1` + `Footer/V1`.
