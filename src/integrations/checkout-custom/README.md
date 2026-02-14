# Checkout Custom Integration

> GoKwik checkout integration for Custom (non-Shopify) platform.

## Overview

This integration provides GoKwik checkout functionality for stores using a custom backend (not Shopify). It handles:

- Loading the GoKwik SDK script
- Checkout button with SDK availability detection
- Buy Now button for single-product checkout
- Order completion events and analytics
- Cart clearing after successful checkout

## File Structure

```
checkout-custom/
├── index.ts                    # Public exports
├── types.ts                    # TypeScript interfaces
├── config.ts                   # Environment configuration
├── events.ts                   # Analytics event dispatchers
│
├── CheckoutCustom.tsx          # Main component (loads script in layout)
├── CheckoutScriptCustom.tsx    # GoKwik script loader
├── CheckoutButtonCustom.tsx    # Checkout button for cart
├── BuyNowButtonCustom.tsx      # Buy Now button for PDP
│
├── CustomCheckoutService.ts    # Service class for GoKwik SDK
├── useCustomCheckout.ts        # React hook for checkout flow
│
└── README.md                   # This file
```

## Usage

### 1. Add to Layout (Required)

The main component must be in the layout to ensure the script loads early:

```typescript
// app/layout.tsx
const CheckoutCustom = dynamic(
  () => import("@/integrations/checkout-custom").then((mod) => ({
    default: mod.CheckoutCustom,
  })),
  { ssr: false },
);

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppShell config={...}>
          <CheckoutCustom />  {/* Script loads here */}
          {children}
        </AppShell>
      </body>
    </html>
  );
}
```

### 2. Use Checkout Button in Cart

```typescript
import { CheckoutButtonCustom } from "@/integrations/checkout-custom";

function CartSummary() {
  return (
    <CheckoutButtonCustom
      className="bg-primary text-white px-4 py-2 rounded"
      onCheckoutSuccess={(order) => console.log("Order:", order)}
      onCheckoutError={(error) => console.error("Error:", error)}
    >
      Checkout
    </CheckoutButtonCustom>
  );
}
```

### 3. Use Buy Now Button on PDP

```typescript
import { BuyNowButtonCustom } from "@/integrations/checkout-custom";

function ProductPage({ product, selectedVariant }) {
  return (
    <BuyNowButtonCustom
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
    </BuyNowButtonCustom>
  );
}
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_GOKWIK_MID=your-merchant-id
NEXT_PUBLIC_GOKWIK_ENVIRONMENT=production  # or 'sandbox'
NEXT_PUBLIC_GOKWIK_SCRIPT_URL=https://cdn.gokwik.co
NEXT_PUBLIC_GOKWIK_TYPE=your-gokwik-type

# Optional
NEXT_PUBLIC_GOKWIK_STORE_ID=your-store-id
NEXT_PUBLIC_FB_PIXEL_ID=your-fb-pixel-id
NEXT_PUBLIC_GOKWIK_BANNER_MESSAGE_1=Free shipping on orders above ₹499
NEXT_PUBLIC_GOKWIK_BANNER_MESSAGE_2=Easy returns within 7 days

# Order History API (for /orders page)
NEXT_PUBLIC_MERCHANT_ID=your-merchant-id
NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL=https://your-api-url.com
```

## Component Props

### CheckoutButtonCustom

| Prop                 | Type                 | Default    | Description                     |
| -------------------- | -------------------- | ---------- | ------------------------------- |
| `children`           | ReactNode            | "Checkout" | Button content                  |
| `className`          | string               | -          | CSS classes                     |
| `style`              | CSSProperties        | -          | Inline styles                   |
| `disabled`           | boolean              | false      | Disable button                  |
| `onCheckoutStart`    | () => void           | -          | Called when checkout starts     |
| `onCheckoutSuccess`  | (order) => void      | -          | Called on success               |
| `onCheckoutError`    | (error) => void      | -          | Called on error                 |
| `clearCartOnSuccess` | boolean              | true       | Clear cart after success        |
| `closeCartOnSuccess` | boolean              | true       | Close cart drawer after success |
| `redirectPath`       | string               | -          | Custom redirect path            |
| `buttonProps`        | ButtonHTMLAttributes | -          | Additional button props         |

### BuyNowButtonCustom

| Prop                | Type                     | Required | Description                         |
| ------------------- | ------------------------ | -------- | ----------------------------------- |
| `variantId`         | string                   | Yes      | Product variant ID                  |
| `productId`         | string                   | Yes      | Product ID                          |
| `title`             | string                   | Yes      | Product title                       |
| `price`             | { amount, currencyCode } | Yes      | Product price                       |
| `quantity`          | number                   | Yes      | Quantity to purchase                |
| `imageUrl`          | string                   | No       | Product image URL                   |
| `children`          | ReactNode                | No       | Button content (default: "Buy Now") |
| `className`         | string                   | No       | CSS classes                         |
| `onCheckoutStart`   | () => void               | No       | Called when checkout starts         |
| `onCheckoutSuccess` | (order) => void          | No       | Called on success                   |
| `onCheckoutError`   | (error) => void          | No       | Called on error                     |
| `loadingContent`    | ReactNode                | No       | Custom loading state                |

## How It Works

### Script Loading Flow

```
1. Layout renders <CheckoutCustom />
   └── Renders <CheckoutScriptCustom />
       └── Loads GoKwik SDK script via Next.js <Script>
       └── window.gokwikSdk becomes available

2. Cart drawer opens (later)
   └── <CheckoutButtonCustom /> mounts
       └── useCustomCheckout() hook runs
           └── Polls for window.gokwikSdk.initCheckout
           └── Sets isGokwikAvailable = true when found
       └── Button becomes enabled
```

### Checkout Flow

```
1. User clicks checkout button
   └── handleCheckout() called
       └── Validates cart and SDK availability
       └── Publishes INITIATE_CHECKOUT event
       └── Calls startCheckout()

2. startCheckout()
   └── CustomCheckoutService.initializeCheckout()
       └── Calls commerceClient.createCheckout() API
       └── Dispatches cart view event
       └── Attaches event listeners (gokwikSdk.on('order-complete'))
       └── Calls gokwikSdk.initCheckout() with config

3. GoKwik modal opens
   └── User completes checkout
   └── gokwikSdk fires 'order-complete' event

4. Order complete
   └── Event listener receives order data
       └── Triggers Trackier & Google Ads conversion tracking
       └── Triggers checkout complete event
       └── Clears cart storage (localStorage)
       └── Calls onOrderComplete callback
       └── Closes GoKwik modal
       └── Redirects to /orders page with order details
```

## Service Class API

### CustomCheckoutService

```typescript
// Check if GoKwik SDK is available
CustomCheckoutService.isGokwikAvailable(): boolean

// Initialize and start checkout
CustomCheckoutService.initializeCheckout(config: CheckoutConfig): Promise<void>

// Close checkout modal
CustomCheckoutService.closeCheckout(): void

// Reset event listeners (cleanup)
CustomCheckoutService.resetEventListeners(): void
```

### CheckoutConfig Interface

```typescript
interface CheckoutConfig {
  cartToken: string; // Cart token (not cart ID)
  items: CartItem[];
  total: number;
  currencyCode: string;
  eventHandlers?: {
    onOrderComplete?: (order: any) => void;
    onPaymentSuccess?: (data: any) => void;
    onCheckoutComplete?: (data: any) => void;
    onUserLogin?: (data: any) => void;
    onAddressSelected?: (data: any) => void;
    onPaymentMethodSelected?: (data: any) => void;
    onError?: (error: Error) => void;
  };
}
```

## Troubleshooting

### Button is Always Disabled

**Cause:** `isGokwikAvailable` is false because the SDK hasn't loaded.

**Solutions:**

1. Ensure `<CheckoutCustom />` is in the layout (not lazy-loaded)
2. Check browser console for script errors
3. Verify environment variables are set

**Debug:** Add console logs to see the state:

```typescript
console.log("isGokwikAvailable:", isGokwikAvailable);
console.log("window.gokwikSdk:", !!window.gokwikSdk);
console.log("gokwikSdk.initCheckout:", !!window.gokwikSdk?.initCheckout);
```

### Script Loading Timing Issue

**Cause:** Button component mounts before script loads.

**Solution:** Don't use `dynamic()` for `CheckoutScriptCustom` inside button components. Use direct import:

```typescript
// ❌ BAD
const CheckoutScriptCustom = dynamic(() => import("./CheckoutScriptCustom"), {
  ssr: false,
});

// ✅ GOOD
import CheckoutScriptCustom from "./CheckoutScriptCustom";
```

### Checkout Modal Not Opening

**Causes:**

1. `window.gokwikSdk` is not defined
2. Cart token is missing or invalid
3. `createCheckout` API call failed
4. GoKwik SDK error

**Debug:**

```typescript
console.log("cartToken:", cartToken);
console.log("gokwikSdk:", !!window.gokwikSdk);
console.log("initCheckout:", typeof window.gokwikSdk?.initCheckout);
```

### Order Success Not Firing

**Cause:** Event listener not receiving `orderSuccess` message.

**Debug:** Check if message listener is attached:

```typescript
// In CustomCheckoutService.attachEventListeners()
console.log("orderSuccess event listener added");
```

## Analytics Events

The integration dispatches these events:

| Event                 | When                      | Data                       |
| --------------------- | ------------------------- | -------------------------- |
| `INITIATE_CHECKOUT`   | Checkout button clicked   | cartValue, currency, items |
| `ADD_PAYMENT_INFO`    | Checkout started          | cartValue, paymentType     |
| `STARTED_CHECKOUT_GK` | GoKwik checkout initiated | cartValue, currency        |
| `PURCHASE`            | Order completed           | orderId, cartValue, items  |
| `ORDER_COMPLETED`     | Order success             | orderId, amount, currency  |

## Related Files

- `@shopkit/cart` - Cart state management
- `@shopkit/analytics` - Event publishing
- `CustomCartSummary.tsx` - Uses this integration in cart drawer
- `/orders` page - Order confirmation page (redirected after checkout)
- `ThankYou` widget - Displays order details on confirmation page
