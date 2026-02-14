# KwikPass Custom Integration

> KwikPass authentication integration for Custom (non-Shopify) platform.

## Overview

This integration provides KwikPass OTP-based authentication for stores using a custom backend. It handles:

- Loading the KwikPass SDK script
- User login via OTP
- User logout
- Session management
- Analytics events for login/logout

## File Structure

```
kwikpass-custom/
├── index.ts                    # Public exports
├── config.ts                   # Environment configuration
├── events.ts                   # Analytics event dispatchers
├── utils.tsx                   # Utility functions and icons
│
├── KwikPassCustom.tsx          # Main component (loads script in layout)
├── KwikPassScriptCustom.tsx    # KwikPass script loader
├── KwikpassLoginCustom.tsx     # Login UI component
│
└── README.md                   # This file
```

## Usage

### 1. Add to Layout (Required)

The main component must be in the layout to ensure the script loads early:

```typescript
// app/layout.tsx
const KwikPassCustom = dynamic(
  () => import("@/integrations/kwikpass-custom").then((mod) => ({
    default: mod.KwikPassCustom,
  })),
  { ssr: false },
);

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppShell config={...}>
          <KwikPassCustom />  {/* Script loads here */}
          {children}
        </AppShell>
      </body>
    </html>
  );
}
```

### 2. Use Login Component

```typescript
import { KwikpassLoginCustom } from "@/integrations/kwikpass-custom";

function Header() {
  return (
    <nav>
      <KwikpassLoginCustom />
    </nav>
  );
}
```

### 3. Handle Login Events

```typescript
import { handleKwikpassLogin, fireUserEngagementEvent } from "@/integrations/kwikpass-custom";

// Listen for login success
window.addEventListener("kwikpassLoginSuccess", (event) => {
  const userData = event.detail;
  console.log("User logged in:", userData);
});
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_KWIKPASS_MID=your-merchant-id
NEXT_PUBLIC_KWIKPASS_ENV=production  # or 'sandbox'
NEXT_PUBLIC_KWIKPASS_SCRIPT_URL=https://cdn.gokwik.co

# Optional
NEXT_PUBLIC_FB_PIXEL_ID=your-fb-pixel-id
```

## Exports

```typescript
// Main components
export { KwikPassCustom } from "./KwikPassCustom";
export { KwikPassScriptCustom } from "./KwikPassScriptCustom";
export { KwikpassLoginCustom } from "./KwikpassLoginCustom";

// Config
export { getKwikPassConfig } from "./config";

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

## Events

### Analytics Events Dispatched

| Event | When | Data |
|-------|------|------|
| `PRODUCT_VIEW` | Product page viewed | productId, title, price |
| `COLLECTION_VIEW` | Collection page viewed | collectionId, title |
| `PAGE_VIEW` | Page viewed | path, title |
| `LOGIN` | User logged in | userId, phone |
| `LOGOUT` | User logged out | userId |

### Window Events

| Event | When | Detail |
|-------|------|--------|
| `kwikpassLoginSuccess` | Login successful | User data |
| `kwikpassLogout` | User logged out | - |

## Utility Functions

### `handleKwikpassLogin(userData)`
Process login response and store user session.

### `fireUserEngagementEvent(eventName, data)`
Fire custom engagement events to KwikPass.

### `getCartToken()`
Get the current cart token for checkout.

## Icon Components

The integration exports reusable icon components:
- `KwikPassLogo` - KwikPass branding
- `Close` - Close/X icon
- `LogOut` - Logout icon
- `ShoppingBag` - Shopping bag icon

## Differences from kwikpass-shopify

| Feature | kwikpass-custom | kwikpass-shopify |
|---------|-----------------|------------------|
| Customer auth | Custom backend | Shopify Multipass |
| Session storage | localStorage | Shopify Customer API |
| Token decoding | Basic | Multipass decode |

## Related Files

- `@shopkit/core/context` - AuthProvider integration
- `checkout-custom` - Uses KwikPass auth for checkout
