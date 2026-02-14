# Integrations Architecture

> Platform-specific integrations for GoKwik services (authentication, checkout, cart).

## Overview

The `integrations/` folder contains self-contained, platform-specific integration modules. Each integration is designed to work independently with either **Shopify** or **Custom** (non-Shopify) backends.

## Folder Structure

```
integrations/
├── kwikpass-shopify/        # KwikPass authentication for Shopify
├── kwikpass-custom/         # KwikPass authentication for Custom platform
├── checkout-shopify/        # GoKwik checkout for Shopify
├── checkout-custom/         # GoKwik checkout for Custom platform
├── cart-drawer-shopify/     # Cart drawer UI for Shopify
├── cart-drawer-custom/      # Cart drawer UI for Custom platform
└── README.md                # This file
```

## Platform Types

| Platform | Description | Cart API | Checkout |
|----------|-------------|----------|----------|
| **Shopify** | Shopify Storefront API | GraphQL Cart API | Shopify Checkout URL or GoKwik |
| **Custom** | Custom backend (non-Shopify) | REST API | GoKwik only |

## Integration Categories

### 1. Authentication (`kwikpass-*`)
Handles user authentication via KwikPass (OTP-based login).

**Files:**
- `KwikPass{Platform}.tsx` - Main component (loads script)
- `KwikPassScript{Platform}.tsx` - Script loader
- `KwikPass{Platform}Service.ts` - Service class
- `useKwikPass{Platform}.ts` - React hook

### 2. Checkout (`checkout-*`)
Handles GoKwik checkout flow.

**Files:**
- `Checkout{Platform}.tsx` - Main component (loads script in layout)
- `CheckoutScript{Platform}.tsx` - Script loader
- `CheckoutButton{Platform}.tsx` - Checkout button component
- `BuyNowButton{Platform}.tsx` - Buy Now button component
- `{Platform}CheckoutService.ts` - Service class
- `useCustomCheckout.ts` - React hook
- `config.ts` - Environment configuration
- `events.ts` - Analytics event dispatchers
- `types.ts` - TypeScript interfaces

### 3. Cart Drawer (`cart-drawer-*`)
Slide-out cart UI with checkout integration.

**Files:**
- `{Platform}CartDrawer.tsx` - Main drawer component
- `components/` - UI components (CartItem, CartSummary, EmptyCartView, etc.)
- `coupons/` - Coupon-related components and hooks
- `types.ts` - TypeScript interfaces

---

## Naming Conventions

### Folders
```
{feature}-{platform}/
```
Examples: `checkout-custom/`, `cart-drawer-shopify/`

### Components
```
{Feature}{Platform}.tsx          # Main component
{Feature}Button{Platform}.tsx    # Button component
{Feature}Script{Platform}.tsx    # Script loader
```
Examples: `CheckoutCustom.tsx`, `CheckoutButtonCustom.tsx`, `CheckoutScriptCustom.tsx`

### Services & Hooks
```
{Platform}{Feature}Service.ts    # Service class
use{Platform}{Feature}.ts        # React hook
```
Examples: `CustomCheckoutService.ts`, `useCustomCheckout.ts`

---

## Script Loading Best Practices

### Critical: Load Scripts Early

**Always load checkout scripts in the layout** via the main component to ensure the SDK is available before the user interacts with checkout buttons.

```typescript
// app/layout.tsx
const CheckoutCustom = dynamic(
  () => import("@/integrations/checkout-custom").then((mod) => ({
    default: mod.CheckoutCustom,
  })),
  { ssr: false },
);

// In the layout body:
<CheckoutCustom />
```

### Do NOT Use Dynamic Import for Script Components in Buttons

Script components already have `"use client"` directive. Using `dynamic()` adds unnecessary async loading that causes timing issues.

```typescript
// ❌ BAD - causes timing issues
const CheckoutScriptCustom = dynamic(() => import("./CheckoutScriptCustom"), {
  ssr: false,
});

// ✅ GOOD - direct import
import CheckoutScriptCustom from "./CheckoutScriptCustom";
```

### Component Hierarchy

```
layout.tsx
├── CheckoutCustom                    ← Script loaded here FIRST
│   └── CheckoutScriptCustom
│
└── CustomCartDrawer (dynamic, ssr: false)
    └── CustomCartSummary
        └── CheckoutButtonCustom      ← Button enabled when script ready
            └── CheckoutScriptCustom  ← Direct import (backup)
```

### SDK Availability Polling

Hooks should poll for SDK availability with a timeout:

```typescript
useEffect(() => {
  const checkAvailability = () => {
    const available = CustomCheckoutService.isGokwikAvailable();
    if (available) {
      setIsGokwikAvailable(true);
      return true;
    }
    return false;
  };

  // Check immediately
  if (checkAvailability()) return;

  // Poll every 100ms
  const interval = setInterval(() => {
    if (checkAvailability()) {
      clearInterval(interval);
    }
  }, 100);

  // Timeout after 5 seconds
  const timeout = setTimeout(() => {
    clearInterval(interval);
  }, 5000);

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
}, []);
```

---

## Creating a New Integration

### Step 1: Create Folder Structure

```bash
mkdir -p src/integrations/{feature}-{platform}/{components,styles}
```

### Step 2: Create Core Files

1. **index.ts** - Public exports
2. **types.ts** - TypeScript interfaces
3. **{Feature}{Platform}.tsx** - Main component
4. **{Feature}Script{Platform}.tsx** - Script loader (if needed)

### Step 3: Add to Layout (if needed)

```typescript
// app/layout.tsx
const MyFeature = dynamic(
  () => import("@/integrations/my-feature-custom").then((mod) => ({
    default: mod.MyFeatureCustom,
  })),
  { ssr: false },
);
```

### Step 4: Update Tailwind Config

Ensure the integrations folder is included in Tailwind's content paths:

```typescript
// tailwind.config.ts
content: [
  // ... other paths
  "./src/integrations/**/*.{js,ts,jsx,tsx,mdx}",
],
```

---

## Environment Variables

Each integration may require specific environment variables. See the individual integration READMEs for details.

Common variables:
```env
# GoKwik
NEXT_PUBLIC_GOKWIK_MID=your-merchant-id
NEXT_PUBLIC_GOKWIK_ENV=production|sandbox

# KwikPass
NEXT_PUBLIC_KWIKPASS_CLIENT_ID=your-client-id
```

---

## Troubleshooting

### Script Not Loading / SDK Not Available

1. Ensure the main component (e.g., `<CheckoutCustom />`) is in the layout
2. Check browser console for script loading errors
3. Verify environment variables are set correctly
4. Check network tab for failed script requests

### Button Always Disabled

1. Check `isGokwikAvailable` in console logs
2. Verify script is loading before button component mounts
3. Don't use `dynamic()` for script components in button files
4. Increase polling timeout if script loads slowly

### Timing Issues

1. Load scripts in layout, not in lazy-loaded components
2. Use direct imports for script components
3. Add console logs to debug component mount order

---

## Related Documentation

- [AGENTS.md](../../AGENTS.md) - AI agent guide for all @shopkit packages
- [checkout-custom/README.md](./checkout-custom/README.md) - Checkout integration details
