# Environment Variables Guide

This guide explains all environment variables used in Storefront Starter.

## Quick Setup

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

---

## Merchant Configuration

| Variable                    | Required | Description                                  |
| --------------------------- | -------- | -------------------------------------------- |
| `NEXT_PUBLIC_MERCHANT_NAME` | Yes      | Merchant identifier (e.g., `bblunt`, `dawn`) |
| `NEXT_PUBLIC_PLATFORM`      | Yes      | Commerce platform: `shopify` or `custom`     |
| `NEXT_PUBLIC_THEME_NAME`    | Yes      | Active theme name (e.g., `dawn`)             |

```env
NEXT_PUBLIC_MERCHANT_NAME=bblunt
NEXT_PUBLIC_PLATFORM=custom
NEXT_PUBLIC_THEME_NAME=dawn
```

---

## Visual Editor Configuration

| Variable                     | Required | Description                                    |
| ---------------------------- | -------- | ---------------------------------------------- |
| `NEXT_PUBLIC_EDITOR_API_URL` | Optional | Visual editor backend URL                      |
| `ENABLE_EDITOR_CHANGES`      | Optional | Enable/disable editor changes (`true`/`false`) |

```env
NEXT_PUBLIC_EDITOR_API_URL=https://visual-editor-be.primathontech.co.in
ENABLE_EDITOR_CHANGES=false
```

---

## Collection & Product Configuration

| Variable                                      | Required | Description                                          |
| --------------------------------------------- | -------- | ---------------------------------------------------- |
| `FEATURED_COLLECTIONS`                        | Optional | Comma-separated collection handles for navigation    |
| `HOMEPAGE_FEATURED_COLLECTIONS`               | Optional | Comma-separated collection handles for homepage      |
| `HOMEPAGE_FEATURED_COLLECTIONS_PRODUCT_LIMIT` | Optional | Max products per homepage collection (default: `12`) |

```env
# Featured collections for navigation/sidebar
FEATURED_COLLECTIONS="all,new-launches,bestseller,combos,hair-care"

# Collections displayed on homepage
HOMEPAGE_FEATURED_COLLECTIONS="most-loved,bestsellers,new-arrivals"

# Limit products shown per collection on homepage
HOMEPAGE_FEATURED_COLLECTIONS_PRODUCT_LIMIT=12
```

---

## Shopify Configuration

Required when `NEXT_PUBLIC_PLATFORM=shopify` or using Shopify as data source:

### Server-side Variables

| Variable                          | Required | Description                      |
| --------------------------------- | -------- | -------------------------------- |
| `SHOPIFY_STORE_DOMAIN`            | Yes      | Shopify store domain             |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes      | Storefront API access token      |
| `SHOPIFY_API_VERSION`             | Optional | API version (default: `2025-04`) |

### Client-side Variables

| Variable                                      | Required | Description                      |
| --------------------------------------------- | -------- | -------------------------------- |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`            | Yes      | Same as server-side (for client) |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes      | Same as server-side (for client) |
| `NEXT_PUBLIC_SHOPIFY_API_VERSION`             | Optional | Same as server-side (for client) |

```env
# Server-side
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
SHOPIFY_API_VERSION="2025-04"

# Client-side (same values)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
NEXT_PUBLIC_SHOPIFY_API_VERSION="2025-04"
```

### How to Get Shopify Tokens

1. Go to **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **Develop apps** → **Create an app**
3. Configure **Storefront API** scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_content`
4. Install the app and copy the **Storefront API access token**

---

## GoKwik Configuration

### Merchant Identifiers

| Variable                  | Required | Description                       |
| ------------------------- | -------- | --------------------------------- |
| `NEXT_PUBLIC_GOKWIK_MID`  | Yes      | GoKwik Merchant ID                |
| `NEXT_PUBLIC_STORE_ID`    | Yes      | Store ID (usually same as MID)    |
| `NEXT_PUBLIC_MERCHANT_ID` | Yes      | Merchant ID (usually same as MID) |

### Configuration

| Variable                         | Required | Description                             |
| -------------------------------- | -------- | --------------------------------------- |
| `NEXT_PUBLIC_GOKWIK_ENVIRONMENT` | Yes      | `sandbox`, `qa`, or `production`        |
| `NEXT_PUBLIC_GOKWIK_TYPE`        | Optional | Integration type (e.g., `merchantInfo`) |
| `NEXT_PUBLIC_GOKWIK_SCRIPT_URL`  | Yes      | GoKwik SDK URL                          |
| `NEXT_PUBLIC_GOKWIK_ENABLED`     | Optional | Enable/disable GoKwik (`true`/`false`)  |

```env
# Merchant IDs
NEXT_PUBLIC_GOKWIK_MID="your-merchant-id"
NEXT_PUBLIC_STORE_ID="your-merchant-id"
NEXT_PUBLIC_MERCHANT_ID="your-merchant-id"

# Configuration
NEXT_PUBLIC_GOKWIK_ENVIRONMENT="qa"          # qa, sandbox, production
NEXT_PUBLIC_GOKWIK_TYPE="merchantInfo"
NEXT_PUBLIC_GOKWIK_SCRIPT_URL="https://qa.pdp.gokwik.co"
NEXT_PUBLIC_GOKWIK_ENABLED=true
```

### Environment URLs

| Environment | Script URL                      |
| ----------- | ------------------------------- |
| QA          | `https://qa.pdp.gokwik.co`      |
| Sandbox     | `https://sandbox.pdp.gokwik.co` |
| Production  | `https://pdp.gokwik.co`         |

### KwikCart (Side Cart)

GoKwik's KwikCart replaces the default custom cart drawer with a hosted side cart.

| Variable                               | Required           | Description                                                   |
| -------------------------------------- | ------------------ | ------------------------------------------------------------- |
| `NEXT_PUBLIC_KWIKCART_DISABLE`         | Optional           | Set to `true` to disable KwikCart and use default cart drawer |
| `NEXT_PUBLIC_KWIKCART_SCRIPT_URL`      | Yes (for KwikCart) | KwikCart SDK script URL                                       |
| `NEXT_PUBLIC_KWIKCART_CURRENCY`        | Optional           | Currency code (default: `INR`)                                |
| `NEXT_PUBLIC_KWIKCART_CURRENCY_FORMAT` | Optional           | Locale for currency formatting (default: `en-IN`)             |

```env
# KwikCart — Side Cart
NEXT_PUBLIC_KWIKCART_DISABLE=false                                              # true = use default cart drawer
NEXT_PUBLIC_KWIKCART_SCRIPT_URL="https://qa.kwikcart.gokwik.co/kwikcart/side-cart.js"
NEXT_PUBLIC_KWIKCART_CURRENCY="INR"
NEXT_PUBLIC_KWIKCART_CURRENCY_FORMAT="en-IN"
```

**Behavior**: When `NEXT_PUBLIC_KWIKCART_DISABLE` is `false` (or unset), KwikCart replaces the default `CustomCartDrawer`. Set to `true` to fall back to the built-in cart drawer.

---

## Custom Backend API Endpoints

Required when `NEXT_PUBLIC_PLATFORM=custom`:

| Variable                                   | Required | Description                     |
| ------------------------------------------ | -------- | ------------------------------- |
| `NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL`       | Yes      | Product service API base URL    |
| `NEXT_PUBLIC_CUSTOM_API_CART_URL`          | Yes      | Cart/Order service API base URL |
| `NEXT_PUBLIC_CUSTOM_API_CUSTOMER_URL`      | Optional | Customer service API base URL   |
| `NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL` | Optional | Order history service API       |
| `NEXT_PUBLIC_CUSTOM_API_INVENTORY_URL`     | Optional | Inventory service API           |
| `NEXT_PUBLIC_GOKWIK_DISCOUNT_API_URL`      | Optional | Discount service API            |

```env
# Product Service
NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL="https://api.example.com/products"

# Cart/Order Service
NEXT_PUBLIC_CUSTOM_API_CART_URL="https://api.example.com/orders"

# Customer Service
NEXT_PUBLIC_CUSTOM_API_CUSTOMER_URL="https://api.example.com/customers"

# Order History Service
NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL="https://api.example.com/order-history"

# Inventory Service
NEXT_PUBLIC_CUSTOM_API_INVENTORY_URL="https://api.example.com/inventory"

# Discount Service
NEXT_PUBLIC_GOKWIK_DISCOUNT_API_URL="https://api.example.com/discounts"
```

### API Endpoint Requirements

Your custom APIs should implement these endpoints:

**Product Service** (`NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL`):

```
GET  /products                    # List products
GET  /products/:handle            # Single product by handle
GET  /collections                 # List collections
GET  /collections/:handle         # Collection with products
```

**Cart Service** (`NEXT_PUBLIC_CUSTOM_API_CART_URL`):

```
POST /cart                        # Create cart
GET  /cart/:id                    # Get cart
PUT  /cart/:id                    # Update cart
POST /cart/:id/items              # Add item to cart
DELETE /cart/:id/items/:itemId    # Remove item from cart
```

**Order History** (`NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL`):

```
GET  /orders                      # List orders for customer
GET  /orders/:id                  # Single order details
```

---

## Additional Integrations

### Video SDK

| Variable                        | Required | Description       |
| ------------------------------- | -------- | ----------------- |
| `NEXT_PUBLIC_VIDEO_APP_SDK_URL` | Optional | Video app SDK URL |

```env
NEXT_PUBLIC_VIDEO_APP_SDK_URL="https://cdn.example.com/video-sdk.js"
```

### Analytics & Tracking

| Variable                                  | Required | Description                                                                                                        |
| ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`           | Optional | Google Analytics 4 ID                                                                                              |
| `NEXT_PUBLIC_GA_ISOLATED`                 | Optional | When `"yes"`, scopes GA4 events to GA4 only via `send_to`; prevents fan-out to Google Ads on a shared `gtag`       |
| `NEXT_PUBLIC_GTM_ID`                      | Optional | Google Tag Manager ID                                                                                              |
| `NEXT_PUBLIC_GOOGLE_ADS_ID`               | Optional | Google Ads account ID, e.g. `AW-123456789`                                                                         |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | Optional | Legacy single-label config — applied to Purchase when `NEXT_PUBLIC_GOOGLE_ADS_EVENTS` has no `Purchase` entry      |
| `NEXT_PUBLIC_GOOGLE_ADS_EVENTS`           | Optional | JSON map of per-event conversion labels: `{"Purchase":"abc","AddToCart":"xyz"}` — each event = a conversion action |
| `NEXT_PUBLIC_MULTI_PIXEL_IDS`             | Optional | Comma-separated Facebook Pixel IDs                                                                                 |
| `NEXT_PUBLIC_EVENT_DEBUG`                 | Optional | Enable event debug logging in production (`true`/`false`)                                                          |

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_MULTI_PIXEL_IDS=1582841486258190,856034283724150

# Google Ads — per-event conversion labels (one conversion action per event)
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-123456789
NEXT_PUBLIC_GOOGLE_ADS_EVENTS={"Purchase":"abc","AddToCart":"xyz","BeginCheckout":"def"}

# Set to "yes" to scope GA4 events to GA4 only (prevents leaking to Ads as
# remarketing signals). Useful when the Google Ads SDK handles its own
# conversions and you want to avoid double-counting via GA4 → Ads import.
# NEXT_PUBLIC_GA_ISOLATED=yes

# Event debug logging (also available via browser console: window.__shopkit_debug = true)
# NEXT_PUBLIC_EVENT_DEBUG=true
```

### Facebook Conversions API (CAPI)

Server-side event dispatch to Facebook's Conversions API. Supports multi-pixel configurations.

| Variable                            | Required       | Description                                                                   |
| ----------------------------------- | -------------- | ----------------------------------------------------------------------------- |
| `FACEBOOK_MULTI_CAPI_ACCESS_TOKENS` | Yes (for CAPI) | Multi-pixel config. Format: `pixelId1:accessToken1,pixelId2:accessToken2`     |
| `FACEBOOK_CAPI_BASE_URL`            | Optional       | Override Graph API base URL (default: `https://graph.facebook.com/v21.0`)     |
| `NEXT_PUBLIC_CAPI_HMAC_SECRET`      | Recommended    | HMAC secret for signing CAPI requests. Prevents unauthorized event injection. |

```env
# Single pixel
FACEBOOK_MULTI_CAPI_ACCESS_TOKENS="123456789012345:EAAxxxxxxxx"

# Multiple pixels
FACEBOOK_MULTI_CAPI_ACCESS_TOKENS="123456789012345:EAAxxxxxxxx,987654321098765:EAAyyyyyyyy"

# Optional: override Graph API URL (for testing/proxying)
# FACEBOOK_CAPI_BASE_URL="https://graph.facebook.com/v21.0"

# HMAC secret for CAPI endpoint security (generate a random string)
NEXT_PUBLIC_CAPI_HMAC_SECRET="your-random-secret-here"
```

**CAPI endpoint security:** When `NEXT_PUBLIC_CAPI_HMAC_SECRET` is set, the Meta Pixel SDK signs each request with HMAC-SHA256 and the CAPI route verifies the signature. This prevents unauthorized parties from sending fake events. Generate a random secret (e.g., `openssl rand -hex 32`). If not set, the endpoint accepts all requests (backward compatible).

**How to get your CAPI access token:**

1. Go to **Facebook Events Manager** → **Settings** → **Conversions API**
2. Click **Generate access token**
3. Copy the token and your Pixel ID

---

## Environment-Specific Files

Next.js loads environment files in this order:

| File                     | Environment     | Git         |
| ------------------------ | --------------- | ----------- |
| `.env`                   | All             | ✓ Commit    |
| `.env.local`             | All (overrides) | ✗ Gitignore |
| `.env.development`       | Development     | ✓ Commit    |
| `.env.development.local` | Development     | ✗ Gitignore |
| `.env.production`        | Production      | ✓ Commit    |
| `.env.production.local`  | Production      | ✗ Gitignore |

**Best Practice**: Use `.env.local` for secrets (gitignored), `.env.example` as template.

---

## Complete Examples

### Custom Platform (Development/QA)

```env
# =============================================================================
# MERCHANT CONFIGURATION
# =============================================================================
NEXT_PUBLIC_MERCHANT_NAME=bblunt
NEXT_PUBLIC_PLATFORM=custom
NEXT_PUBLIC_THEME_NAME=dawn

# =============================================================================
# VISUAL EDITOR CONFIGURATION
# =============================================================================
NEXT_PUBLIC_EDITOR_API_URL=https://visual-editor-be.primathontech.co.in
ENABLE_EDITOR_CHANGES=false

# =============================================================================
# COLLECTION & PRODUCT CONFIGURATION
# =============================================================================
FEATURED_COLLECTIONS="all,new-launches,bestseller,combos,hair-care"
HOMEPAGE_FEATURED_COLLECTIONS="most-loved,for-hair-fall,for-dry-hair"
HOMEPAGE_FEATURED_COLLECTIONS_PRODUCT_LIMIT=12

# =============================================================================
# SHOPIFY CONFIGURATION (Data Source)
# =============================================================================
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
SHOPIFY_API_VERSION="2025-04"

NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
NEXT_PUBLIC_SHOPIFY_API_VERSION="2025-04"

# =============================================================================
# GOKWIK CONFIGURATION
# =============================================================================
NEXT_PUBLIC_GOKWIK_MID="your-merchant-id"
NEXT_PUBLIC_STORE_ID="your-merchant-id"
NEXT_PUBLIC_MERCHANT_ID="your-merchant-id"

NEXT_PUBLIC_GOKWIK_ENVIRONMENT="qa"
NEXT_PUBLIC_GOKWIK_TYPE="merchantInfo"
NEXT_PUBLIC_GOKWIK_SCRIPT_URL="https://qa.pdp.gokwik.co"
NEXT_PUBLIC_GOKWIK_ENABLED=true

# =============================================================================
# CUSTOM BACKEND API ENDPOINTS
# =============================================================================
NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL="https://api.dev.example.com/products"
NEXT_PUBLIC_CUSTOM_API_CART_URL="https://api.dev.example.com/orders"
NEXT_PUBLIC_CUSTOM_API_CUSTOMER_URL="https://api.dev.example.com/customers"
NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL="https://api.dev.example.com/order-history"
NEXT_PUBLIC_CUSTOM_API_INVENTORY_URL="https://api.dev.example.com/inventory"
NEXT_PUBLIC_GOKWIK_DISCOUNT_API_URL="https://api.dev.example.com/discounts"
```

### Shopify Platform (Production)

```env
# =============================================================================
# MERCHANT CONFIGURATION
# =============================================================================
NEXT_PUBLIC_MERCHANT_NAME=mystore
NEXT_PUBLIC_PLATFORM=shopify
NEXT_PUBLIC_THEME_NAME=dawn

# =============================================================================
# SHOPIFY CONFIGURATION
# =============================================================================
SHOPIFY_STORE_DOMAIN=mystore.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxx
SHOPIFY_API_VERSION="2025-04"

NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=mystore.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxx
NEXT_PUBLIC_SHOPIFY_API_VERSION="2025-04"

# =============================================================================
# GOKWIK CONFIGURATION
# =============================================================================
NEXT_PUBLIC_GOKWIK_MID="prod-merchant-id"
NEXT_PUBLIC_STORE_ID="prod-merchant-id"
NEXT_PUBLIC_MERCHANT_ID="prod-merchant-id"

NEXT_PUBLIC_GOKWIK_ENVIRONMENT="production"
NEXT_PUBLIC_GOKWIK_TYPE="merchantInfo"
NEXT_PUBLIC_GOKWIK_SCRIPT_URL="https://pdp.gokwik.co"
NEXT_PUBLIC_GOKWIK_ENABLED=true

# =============================================================================
# ANALYTICS
# =============================================================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MULTI_PIXEL_IDS=1582841486258190,856034283724150
```

---

## Troubleshooting

### "Environment variable not found"

1. Check the variable is in `.env.local`
2. Restart the dev server (`bun run dev`)
3. For `NEXT_PUBLIC_*` vars, they must start with that prefix to be available client-side

### "Invalid Shopify credentials"

1. Verify the store domain doesn't include `https://`
2. Check the Storefront API token has correct scopes
3. Ensure the app is installed on your store

### "GoKwik checkout not loading"

1. Verify `NEXT_PUBLIC_GOKWIK_MID` is correct
2. Check `NEXT_PUBLIC_GOKWIK_ENVIRONMENT` matches your GoKwik dashboard
3. Ensure `NEXT_PUBLIC_GOKWIK_SCRIPT_URL` is correct for your environment
4. Check `NEXT_PUBLIC_GOKWIK_ENABLED=true`

### "Custom API calls failing"

1. Verify all `NEXT_PUBLIC_CUSTOM_API_*` URLs are correct
2. Check CORS is enabled on your API servers
3. Ensure APIs are accessible from browser (for client-side calls)

---

## Security Notes

1. **Never commit** `.env.local` or any file with real credentials
2. **Use different tokens** for development and production
3. **Rotate tokens** if they're accidentally exposed
4. **Server-side variables** (without `NEXT_PUBLIC_`) are never sent to the browser
5. **API keys in `NEXT_PUBLIC_*`** are visible to users - only use public/storefront tokens
