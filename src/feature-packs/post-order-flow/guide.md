# Post-Order Flow — Feature Pack

The customer post-purchase experience for a ShopKit / storefront-starter app:

- **Thank-you page** (`/orders`) — order confirmation after checkout
- **Account** (`/account`) — profile + dashboard
- **Addresses** (`/account/addresses`) — list / add / edit / delete addresses
- **Order history** (`/pages/orders`) — past orders + cancel flow
- **Order details** (`/pages/orders/[id]`) — single order view

It ships as **4 widgets** (Account, Addresses, Orders, OrderDetails), **4
page-builder templates**, **4 routes**, a `ProtectedRoute` guard, and a small
Sentry helper. All data is fetched **client-side, directly from the GoKwik
APIs** (no `api/v1/*` BFF proxy routes) using public `NEXT_PUBLIC_*` env vars.

---

## ⚠️ Why this pack is a STAGING kit (read first)

Unlike most code, widgets and templates **cannot just live anywhere** — the
ShopKit CLI discovers them by scanning fixed directories:

- `bun run generate:widgets` scans **`src/widgets/`** and writes a manifest that
  imports `from "../common/<Widget>"`.
- `bun run generate:templates` scans **`src/themes/<theme>/templates/`** to build
  `TEMPLATE_TYPES`, which the routes reference.

So the feature's files **must end up under `src/`** to compile and run. They
cannot execute from inside this pack. Therefore this pack holds the entire
feature as an **install payload** under [`install/`](#whats-in-here) — every
file is suffixed `.example` and is **not compiled**. You (or your repo's Claude)
**install** them by copying into `src/` and running the generators.

> **Nothing here is live until you run the install steps below.** Don't want the
> post-order flow? Just `rm -rf` this folder — the app is untouched.

> **Hand this folder to your repo's Claude** and say:
> _"Install the post-order-flow feature pack by following
> `src/feature-packs/post-order-flow/guide.md`."_

---

<a name="whats-in-here"></a>

## What's in here

```
post-order-flow/
├── install/                         ← the feature, as *.example (copy into src/, strip suffix)
│   ├── widgets/common/              Account/ · Addresses/ · Orders/ · OrderDetails/   (54 files)
│   ├── themes/dawn/templates/       account/ · addresses/ · order-history/ · order-details/
│   ├── app/                         account/page · account/addresses/page ·
│   │                                pages/orders/page · pages/orders/[id]/page
│   ├── lib/sentry/utils.ts          Sentry capture helper
│   └── ui/components/ProtectedRoute.tsx   auth gate for account/order routes
├── modified-files/                  ← changes to files that ALREADY exist in the app
│   ├── app/orders/page.tsx.example          (thank-you route — replaces existing /orders page)
│   ├── themes/dawn/templates/orders/default.ts.example   (thank-you template)
│   ├── globals.css.diff                     (CSS variables to add)
│   └── CustomCheckoutService.ts.diff        (1 comment — optional)
└── guide.md                         this file
```

`install/` paths mirror `src/` exactly: `install/widgets/common/Account/…` →
`src/widgets/common/Account/…`.

---

## Installing

> Assumes the standard storefront-starter layout (`@/*` → `src/*`, theme
> `dawn`). If your repo diverged, map paths to your equivalents.

### 1. Copy the `install/` payload into `src/` (strip the `.example` suffix)

From the app root (`apps/storefront-starter`), run:

```bash
PACK=src/feature-packs/post-order-flow/install
find "$PACK" -name '*.example' | while read -r f; do
  rel="${f#"$PACK"/}"          # e.g. widgets/common/Account/index.tsx.example
  dest="src/${rel%.example}"    # e.g. src/widgets/common/Account/index.tsx
  mkdir -p "$(dirname "$dest")"
  cp "$f" "$dest"
done
```

This drops the 4 widgets, 4 templates, 4 routes, `ProtectedRoute`, and the
Sentry helper into their real locations.

### 2. Apply the changes to pre-existing files (`modified-files/`)

These touch files that already exist in the base app:

**a. `src/app/globals.css`** — add the CSS-variable block (Tailwind maps
`bg-black` / `rounded-*` utilities to these; undefined → transparent/square).
See `modified-files/globals.css.diff`. Add under the `@tailwind` lines:

```css
:root {
  --color-black: #000000;
  --color-white: #ffffff;

  --border-radius-none: 0;
  --border-radius-sm: 0.125rem;
  --border-radius: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;
  --border-radius-full: 9999px;
  --border-radius-10: 10px;
  --border-radius-20: 20px;
}
```

**b. `src/app/orders/page.tsx`** — the `/orders` route becomes the thank-you
page. Replace your existing file with
`modified-files/app/orders/page.tsx.example`.

**c. `src/themes/dawn/templates/orders/default.ts`** — the `orders` template
renders the thank-you widget. Replace with
`modified-files/themes/dawn/templates/orders/default.ts.example`.

**d. `src/integrations/checkout-custom/CustomCheckoutService.ts`** — _(optional)_
adds a 3-line comment noting order-confirmation email is a backend service. See
`modified-files/CustomCheckoutService.ts.diff`. Skippable.

### 3. Regenerate manifests + verify

```bash
bun run generate        # registers the 4 widgets + 4 templates (manifests are gitignored)
bun run tsc --noEmit    # typecheck
bun run dev             # visit /account, /pages/orders, and /orders after a test checkout
```

### 4. Env vars (already standard on GoKwik storefronts)

The widgets read these public vars directly — no BFF:

```
NEXT_PUBLIC_MERCHANT_ID
NEXT_PUBLIC_CUSTOM_API_CUSTOMER_URL        # profile + addresses  (…/v1/storefront/…)
NEXT_PUBLIC_CUSTOM_API_CART_URL            # order cancel / cancellable
NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL   # order history + details
```

`gk-access-token` is always sent as a **header** (never a query param).

---

## How data fetching works (no BFF)

Each widget owns an `api/` module that calls the GoKwik backend directly from
the browser:

- `Orders/api` → `${ORDER_HISTORY_URL}/api/v1/auth/customers/orders[/:id]`
- `Orders/components/OrderHistory` → `${CART_URL}/auth/customers/orders/:id/{cancellable,cancel}`
- `Account/api` + `Addresses/api` → `${CUSTOMER_URL}/v1/storefront/customers/profile`
  and `${CUSTOMER_URL}/v1/storefront/addresses`

Address snake_case↔camelCase mapping and the `{success,data,fieldErrors}`
envelope live in `Addresses/api/index.tsx`. (A previous revision proxied these
through `app/api/v1/*` routes; those were removed per review — call GoKwik
directly.)

---

## Uninstalling

1. Delete the installed files:
   ```bash
   rm -rf src/widgets/common/{Account,Addresses,Orders,OrderDetails} \
          src/themes/dawn/templates/{account,addresses,order-history,order-details} \
          src/app/account src/app/pages/orders \
          src/ui/components/ProtectedRoute.tsx src/lib/sentry/utils.ts
   ```
2. Revert the `modified-files/` changes (restore your original `globals.css`,
   `app/orders/page.tsx`, `themes/dawn/templates/orders/default.ts`, and
   `CustomCheckoutService.ts`).
3. `rm -rf src/feature-packs/post-order-flow`
4. `bun run generate && bun run tsc --noEmit`

---

## Gotchas

- **`.example` files are not compiled** — that's deliberate; they reference
  `WIDGET_TYPES` / `TEMPLATE_TYPES` that only exist once installed + generated.
- **`.generated/` is gitignored** — widget/template/i18n manifests are rebuilt by
  `bun run generate`; never hand-edit them.
- **`lib/sentry/utils.ts` is currently unused** (it served the removed BFF
  routes). Kept in the payload for reuse; safe to omit.
- **Run `bun run generate` after installing** — without it the widgets/templates
  aren't in the manifests and the pages won't render.
