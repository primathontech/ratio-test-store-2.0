# Checkout Shopify Integration

> GoKwik checkout integration for Shopify platform.

## Overview

This integration provides GoKwik checkout functionality for Shopify stores. It handles:

- Loading the GoKwik SDK script
- Checkout button with SDK availability detection
- Buy Now button for single-product checkout
- Order completion events and analytics
- Cart clearing after successful checkout
- Shopify-specific cart and customer handling

## File Structure

```
checkout-shopify/
├── index.ts                    # Public exports
├── types.ts                    # TypeScript interfaces
├── config.ts                   # Environment configuration
├── events.ts                   # Analytics event dispatchers
│
├── CheckoutShopify.tsx         # Main component (loads script in layout)
├── CheckoutScriptShopify.tsx   # GoKwik script loader
├── CheckoutButtonShopify.tsx   # Checkout button for cart
├── BuyNowButtonShopify.tsx     # Buy Now button for PDP
│
├── ShopifyCheckoutService.ts   # Service class for GoKwik SDK
├── useShopifyCheckout.ts       # React hook for checkout flow
│
└── README.md                   # This file
```

## Usage

### 1. Add to Layout (Required)

The main component must be in the layout to ensure the script loads early:

```typescript
// app/layout.tsx
const CheckoutShopify = dynamic(
  () => import("@/integrations/checkout-shopify").then((mod) => ({
    default: mod.CheckoutShopify,
  })),
  { ssr: false },
);

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppShell config={...}>
          <CheckoutShopify />  {/* Script loads here */}
          {children}
        </AppShell>
      </body>
    </html>
  );
}
```

### 2. Use Checkout Button in Cart

```typescript
import { CheckoutButtonShopify } from "@/integrations/checkout-shopify";

function CartSummary() {
  return (
    <CheckoutButtonShopify
      className="bg-primary text-white px-4 py-2 rounded"
      onCheckoutSuccess={(order) => console.log("Order:", order)}
      onCheckoutError={(error) => console.error("Error:", error)}
    >
      Checkout
    </CheckoutButtonShopify>
  );
}
```

### 3. Use Buy Now Button on PDP

```typescript
import { BuyNowButtonShopify } from "@/integrations/checkout-shopify";

function ProductPage({ product, selectedVariant }) {
  return (
    <BuyNowButtonShopify
      className="bg-primary text-white px-4 py-2 rounded"
      variantId={selectedVariant.id}
      productId={product.id}
      title={product.title}
      price={selectedVariant.price}
      quantity={1}
      imageUrl={product.featuredImage?.url}
      onCheckoutSuccess={(order) => console.log("Order:", order)}
      onCheckoutError={(error) => console.error("Error:", error)}
    >
      Buy Now
    </BuyNowButtonShopify>
  );
}
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_GOKWIK_MID=your-merchant-id
NEXT_PUBLIC_GOKWIK_ENV=production  # or 'sandbox'
NEXT_PUBLIC_GOKWIK_SCRIPT_URL=https://cdn.gokwik.co

# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token

# Optional
NEXT_PUBLIC_GOKWIK_STORE_ID=your-store-id
NEXT_PUBLIC_FB_PIXEL_ID=your-fb-pixel-id
```

## Component Props

### CheckoutButtonShopify

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | "Checkout" | Button content |
| `className` | string | - | CSS classes |
| `style` | CSSProperties | - | Inline styles |
| `disabled` | boolean | false | Disable button |
| `onCheckoutStart` | () => void | - | Called when checkout starts |
| `onCheckoutSuccess` | (order) => void | - | Called on success |
| `onCheckoutError` | (error) => void | - | Called on error |
| `clearCartOnSuccess` | boolean | true | Clear cart after success |
| `closeCartOnSuccess` | boolean | true | Close cart drawer after success |
| `redirectPath` | string | - | Custom redirect path |
| `buttonProps` | ButtonHTMLAttributes | - | Additional button props |

### BuyNowButtonShopify

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variantId` | string | Yes | Product variant ID (Shopify GID) |
| `productId` | string | Yes | Product ID (Shopify GID) |
| `title` | string | Yes | Product title |
| `price` | { amount, currencyCode } | Yes | Product price |
| `quantity` | number | Yes | Quantity to purchase |
| `imageUrl` | string | No | Product image URL |
| `children` | ReactNode | No | Button content (default: "Buy Now") |
| `className` | string | No | CSS classes |
| `onCheckoutStart` | () => void | No | Called when checkout starts |
| `onCheckoutSuccess` | (order) => void | No | Called on success |
| `onCheckoutError` | (error) => void | No | Called on error |
| `loadingContent` | ReactNode | No | Custom loading state |

## Exports

```typescript
// Main component
export { CheckoutShopify } from "./CheckoutShopify";

// Button components
export { CheckoutButtonShopify } from "./CheckoutButtonShopify";
export { BuyNowButtonShopify } from "./BuyNowButtonShopify";

// Service & Hook
export { ShopifyCheckoutService } from "./ShopifyCheckoutService";
export { useShopifyCheckout, convertCartItemsForCheckout } from "./useShopifyCheckout";

// Config & Events
export { getCheckoutConfig } from "./config";
export { dispatchCartViewEvent, dispatchCheckoutStartEvent, dispatchCheckoutCompleteEvent } from "./events";

// Types
export type { CheckoutButtonShopifyProps, BuyNowButtonShopifyProps } from "./types";
export type { CartItem, CheckoutConfig, CheckoutEventHandlers } from "./ShopifyCheckoutService";
```

## Differences from checkout-custom

| Feature | checkout-shopify | checkout-custom |
|---------|-----------------|-----------------|
| Cart API | Shopify GraphQL | Custom REST |
| Variant IDs | Shopify GIDs | Custom IDs |
| Customer auth | Shopify Multipass | KwikPass only |
| Checkout fallback | Shopify Checkout URL | None |

## Related Files

- `@shopkit/cart` - Cart state management (Shopify adapter)
- `@shopkit/analytics` - Event publishing
- `ShopifyCartSummary.tsx` - Uses this integration in cart drawer
