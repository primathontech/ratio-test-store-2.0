# KwikPass Shopify Integration

> KwikPass authentication integration for Shopify platform.

## Overview

This integration provides KwikPass OTP-based authentication for Shopify stores. It handles:

- Loading the KwikPass SDK script
- User login via OTP
- Shopify Multipass token handling
- Customer access token retrieval
- User logout
- Session management with Shopify Customer API
- Analytics events for login/logout

## File Structure

```
kwikpass-shopify/
├── index.ts                    # Public exports
├── config.ts                   # Environment configuration
├── events.ts                   # Analytics event dispatchers
├── utils.tsx                   # Utility functions and icons
├── AuthUtils.ts                # Shopify-specific auth utilities
│
├── KwikPassShopify.tsx         # Main component (loads script in layout)
├── KwikPassScriptShopify.tsx   # KwikPass script loader
├── KwikpassLoginShopify.tsx    # Login UI component
│
└── README.md                   # This file
```

## Usage

### 1. Add to Layout (Required)

The main component must be in the layout to ensure the script loads early:

```typescript
// app/layout.tsx
const KwikPassShopify = dynamic(
  () => import("@/integrations/kwikpass-shopify").then((mod) => ({
    default: mod.KwikPassShopify,
  })),
  { ssr: false },
);

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppShell config={...}>
          <KwikPassShopify />  {/* Script loads here */}
          {children}
        </AppShell>
      </body>
    </html>
  );
}
```

### 2. Use Login Component

```typescript
import { KwikpassLoginShopify } from "@/integrations/kwikpass-shopify";

function Header() {
  return (
    <nav>
      <KwikpassLoginShopify />
    </nav>
  );
}
```

### 3. Get Customer Access Token

```typescript
import { getCustomerAccessToken, getCustomerAccessTokenMultipass } from "@/integrations/kwikpass-shopify";

// Get token from KwikPass response
const accessToken = await getCustomerAccessToken(kwikpassToken);

// Or via Multipass
const accessToken = await getCustomerAccessTokenMultipass(multipassToken);
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_KWIKPASS_MID=your-merchant-id
NEXT_PUBLIC_KWIKPASS_ENV=production  # or 'sandbox'
NEXT_PUBLIC_KWIKPASS_SCRIPT_URL=https://cdn.gokwik.co

# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
SHOPIFY_MULTIPASS_SECRET=your-multipass-secret

# Optional
NEXT_PUBLIC_FB_PIXEL_ID=your-fb-pixel-id
```

## Exports

```typescript
// Main components
export { KwikPassShopify } from "./KwikPassShopify";
export { KwikPassScriptShopify } from "./KwikPassScriptShopify";
export { KwikpassLoginShopify } from "./KwikpassLoginShopify";

// Config
export { getKwikPassConfig } from "./config";

// Auth utilities (Shopify-specific)
export {
  decodeKpToken,
  getCustomerAccessToken,
  getCustomerAccessTokenMultipass,
} from "./AuthUtils";

// Events
export {
  dispatchProductViewEvent,
  dispatchCollectionViewEvent,
  dispatchPageViewEvent,
  dispatchLoginEvent,
  dispatchLogoutEvent,
  KwikPassEventType,
} from "./events";

// Utils
export {
  KwikPassLogo,
  Close,
  LogOut,
  ShoppingBag,
  fireUserEngagementEvent,
  handleKwikpassLogin,
  getCartToken,
} from "./utils";
```

## Auth Utilities (Shopify-specific)

### `decodeKpToken(token)`
Decode and validate a KwikPass JWT token.

### `getCustomerAccessToken(kpToken)`
Exchange KwikPass token for Shopify Customer Access Token.

### `getCustomerAccessTokenMultipass(multipassToken)`
Exchange Multipass token for Shopify Customer Access Token.

## Events

### Analytics Events Dispatched

| Event | When | Data |
|-------|------|------|
| `PRODUCT_VIEW` | Product page viewed | productId, title, price |
| `COLLECTION_VIEW` | Collection page viewed | collectionId, title |
| `PAGE_VIEW` | Page viewed | path, title |
| `LOGIN` | User logged in | userId, phone, shopifyCustomerId |
| `LOGOUT` | User logged out | userId |

### Window Events

| Event | When | Detail |
|-------|------|--------|
| `kwikpassLoginSuccess` | Login successful | User data + Shopify token |
| `kwikpassLogout` | User logged out | - |

## Differences from kwikpass-custom

| Feature | kwikpass-shopify | kwikpass-custom |
|---------|------------------|-----------------|
| Customer auth | Shopify Multipass | Custom backend |
| Session storage | Shopify Customer API | localStorage |
| Token decoding | Multipass + JWT | Basic JWT |
| Customer data | Shopify Customer object | Custom user object |
| Auth utilities | `AuthUtils.ts` exports | None |

## Authentication Flow

```
1. User clicks login
   └── KwikPass modal opens
       └── User enters phone number
           └── OTP sent & verified

2. KwikPass returns token
   └── decodeKpToken() validates token
       └── getCustomerAccessToken() exchanges for Shopify token
           └── Shopify Customer Access Token stored

3. User is now authenticated
   └── Can access order history
   └── Can use saved addresses
   └── Checkout pre-fills customer info
```

## Related Files

- `@shopkit/core/context` - AuthProvider integration
- `checkout-shopify` - Uses KwikPass auth for checkout
- `@shopkit/data-layer` - Shopify Customer API
