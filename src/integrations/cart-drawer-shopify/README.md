# Cart Drawer Shopify Integration

> Slide-out cart drawer UI for Shopify platform.

## Overview

This integration provides a fully-featured cart drawer UI for Shopify stores. It includes:

- Slide-out cart drawer with overlay
- Cart item list with quantity controls
- Cart summary with total
- Coupon/discount offers display
- Integration with `checkout-shopify` for checkout button
- Loading states and empty cart view
- Custom cursor effect on overlay
- Shopify-specific price and variant handling

## File Structure

```
cart-drawer-shopify/
├── index.ts                    # Public exports
├── types.ts                    # TypeScript interfaces
│
├── ShopifyCartDrawer.tsx       # Main cart drawer component
│
├── components/                 # UI components
│   ├── index.ts               # Component exports
│   ├── CartItem.tsx           # Individual cart item row
│   ├── ShopifyCartSummary.tsx # Summary with checkout button
│   ├── EmptyCartView.tsx      # Empty cart state
│   ├── CustomCursor.tsx       # Custom cursor on overlay
│   └── LoadingSpinner.tsx     # Loading progress bar
│
├── coupons/                    # Coupon feature
│   ├── index.ts               # Coupon exports
│   ├── CouponOffersComponent.tsx  # Coupon offers display
│   ├── CouponCardSkeleton.tsx     # Loading skeleton
│   └── useCoupons.ts              # Coupon data hook
│
└── README.md                   # This file
```

## Usage

### Add to Layout

```typescript
// app/layout.tsx
const ShopifyCartDrawer = dynamic(
  () => import("@/integrations/cart-drawer-shopify").then((mod) => ({
    default: mod.ShopifyCartDrawer,
  })),
  { ssr: false },
);

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppShell config={...}>
          {children}
          <ShopifyCartDrawer locale="en" />
        </AppShell>
      </body>
    </html>
  );
}
```

### Open/Close Cart

The cart drawer uses `@shopkit/cart` store for state:

```typescript
import { useCartStore } from "@shopkit/cart";

function CartIcon() {
  const { openCart, itemCount } = useCartStore();

  return (
    <button onClick={openCart}>
      Cart ({itemCount})
    </button>
  );
}
```

## Props

### ShopifyCartDrawer

| Prop     | Type | Default | Description             |
| -------- | ---- | ------- | ----------------------- |
| `locale` | "en" | "en"    | Locale for translations |

## Exports

```typescript
// Main component
export { ShopifyCartDrawer } from "./ShopifyCartDrawer";

// Types
export type {
  ShopifyCartDrawerProps,
  CouponOffer,
  UseCouponsReturn,
} from "./types";
```

## Component Hierarchy

```
ShopifyCartDrawer
├── LoadingSpinner              # Top loading bar
├── CustomCursor                # Custom cursor on overlay
├── Overlay (click to close)
└── Drawer Panel
    ├── Header (title + close button)
    ├── Content (scrollable)
    │   ├── CouponOffersComponent
    │   ├── Error state (if any)
    │   └── Cart items OR EmptyCartView
    │       └── CartItem (for each item)
    └── Footer
        └── ShopifyCartSummary
            └── CheckoutButtonShopify (from checkout-shopify)
```

## Features

### Cart Items

- Product image, title, variant options
- Quantity increment/decrement buttons
- Remove item button
- Individual loading states per item
- Shopify Money formatting
- Variant option display (size, color, etc.)

### Coupon Offers

- Fetches available coupons via `useCoupons` hook
- Displays coupon cards with copy functionality
- Loading skeletons during fetch
- Horizontal scroll for multiple coupons

### Custom Cursor

- Shows a close icon when hovering over the overlay
- Follows mouse position
- Hidden when over the cart drawer or modals

### Body Scroll Lock

- Prevents body scrolling when cart is open
- Restores scroll on close

## Styling

The component uses Tailwind CSS classes. Ensure the integrations folder is in your Tailwind content config:

```typescript
// tailwind.config.ts
content: [
  // ... other paths
  "./src/integrations/**/*.{js,ts,jsx,tsx,mdx}",
],
```

### Key CSS Classes

| Element   | Classes                                             |
| --------- | --------------------------------------------------- |
| Overlay   | `fixed inset-0 bg-cart-overlay-dark`                |
| Drawer    | `fixed top-0 right-0 max-w-[460px] h-full bg-white` |
| Animation | `transition-transform translate-x-0/full`           |

## Dependencies

- `@shopkit/cart` - Cart state management (Shopify adapter)
- `checkout-shopify` - Checkout button integration
- `@/ui/atomic` - UI primitives (Box, Flex, Text, Button, Image)
- `@/utils` - Formatting utilities

## Shopify-Specific Features

### Price Formatting

Uses Shopify Money object with currencyCode:

```typescript
{
  amount: "29.99",
  currencyCode: "USD"
}
```

### Variant Options

Displays variant options like:

- Size: Medium
- Color: Blue

### Compare at Price

Shows original price when item is on sale.

### Inventory

Can show stock levels based on Shopify inventory.

## Differences from cart-drawer-custom

| Feature         | cart-drawer-shopify     | cart-drawer-custom     |
| --------------- | ----------------------- | ---------------------- |
| Checkout button | `CheckoutButtonShopify` | `CheckoutButtonCustom` |
| Cart summary    | `ShopifyCartSummary`    | `CustomCartSummary`    |
| Price format    | Shopify Money           | Custom format          |
| Cart API        | Shopify GraphQL         | Custom REST            |
| Variant display | Shopify options         | Custom fields          |

## Related Files

- `checkout-shopify` - Provides the checkout button
- `@shopkit/cart` - Cart state and hooks (Shopify adapter)
- `@/ui/atomic` - Shared UI components
- `@shopkit/data-layer` - Shopify Storefront API
