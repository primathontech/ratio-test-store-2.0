# Cart Drawer Custom Integration

> Slide-out cart drawer UI for Custom (non-Shopify) platform.

## Overview

This integration provides a fully-featured cart drawer UI for stores using a custom backend. It includes:

- Slide-out cart drawer with overlay
- Cart item list with quantity controls
- Cart summary with total
- Coupon/discount offers display
- Integration with `checkout-custom` for checkout button
- Loading states and empty cart view
- Custom cursor effect on overlay

## File Structure

```
cart-drawer-custom/
├── index.ts                    # Public exports
├── types.ts                    # TypeScript interfaces
│
├── CustomCartDrawer.tsx        # Main cart drawer component
│
├── components/                 # UI components
│   ├── index.ts               # Component exports
│   ├── CartItem.tsx           # Individual cart item row
│   ├── CustomCartSummary.tsx  # Summary with checkout button
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
const CustomCartDrawer = dynamic(
  () => import("@/integrations/cart-drawer-custom").then((mod) => ({
    default: mod.CustomCartDrawer,
  })),
  { ssr: false },
);

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppShell config={...}>
          {children}
          <CustomCartDrawer locale="en" />
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

### CustomCartDrawer

| Prop     | Type | Default | Description             |
| -------- | ---- | ------- | ----------------------- |
| `locale` | "en" | "en"    | Locale for translations |

## Exports

```typescript
// Main component
export { CustomCartDrawer } from "./CustomCartDrawer";

// Types
export type {
  CustomCartDrawerProps,
  CouponOffer,
  UseCouponsReturn,
} from "./types";
```

## Component Hierarchy

```
CustomCartDrawer
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
        └── CustomCartSummary
            └── CheckoutButtonCustom (from checkout-custom)
```

## Features

### Cart Items

- Product image, title, variant
- Quantity increment/decrement buttons
- Remove item button
- Individual loading states per item
- Price display with formatting

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

- `@shopkit/cart` - Cart state management
- `checkout-custom` - Checkout button integration
- `@/ui/atomic` - UI primitives (Box, Flex, Text, Button, Image)
- `@/utils` - Formatting utilities

## Differences from cart-drawer-shopify

| Feature          | cart-drawer-custom     | cart-drawer-shopify     |
| ---------------- | ---------------------- | ----------------------- |
| Checkout button  | `CheckoutButtonCustom` | `CheckoutButtonShopify` |
| Cart summary     | `CustomCartSummary`    | `ShopifyCartSummary`    |
| Price formatting | Custom format          | Shopify format          |
| Cart API         | Custom REST            | Shopify GraphQL         |

## Related Files

- `checkout-custom` - Provides the checkout button
- `@shopkit/cart` - Cart state and hooks
- `@/ui/atomic` - Shared UI components
