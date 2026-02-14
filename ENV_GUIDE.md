# Environment Variables Guide

This guide explains all environment variables used in Storefront Starter.

## Quick Setup

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

## Variable Reference

### Platform Configuration

| Variable        | Required | Description                              |
| --------------- | -------- | ---------------------------------------- |
| `PLATFORM`      | Yes      | Commerce platform: `shopify` or `custom` |
| `MERCHANT_NAME` | Yes      | Theme/merchant identifier (e.g., `dawn`) |

```env
PLATFORM=shopify
MERCHANT_NAME=dawn
```

---

### Shopify Configuration

Required when `PLATFORM=shopify`:

| Variable                                      | Required | Description                             |
| --------------------------------------------- | -------- | --------------------------------------- |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`            | Yes      | Your Shopify store domain               |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes      | Storefront API access token             |
| `SHOPIFY_STORE_DOMAIN`                        | Yes      | Same as above (server-side)             |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN`             | Yes      | Same as above (server-side)             |
| `SHOPIFY_ADMIN_ACCESS_TOKEN`                  | Optional | Admin API token (for advanced features) |
| `SHOPIFY_API_VERSION`                         | Optional | API version (default: `2025-04`)        |

```env
# Public (client-side)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-04

# Server-side
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_admin_xxxxxxxxxxxxx
SHOPIFY_API_VERSION=2025-04
```

#### How to Get Shopify Tokens

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

### Custom Backend Configuration

Required when `PLATFORM=custom`:

| Variable                     | Required | Description                      |
| ---------------------------- | -------- | -------------------------------- |
| `NEXT_PUBLIC_CUSTOM_API_URL` | Yes      | Base URL for your custom API     |
| `NEXT_PUBLIC_MERCHANT_ID`    | Yes      | Your merchant identifier         |
| `CUSTOM_API_SECRET`          | Optional | API secret for server-side calls |

```env
NEXT_PUBLIC_CUSTOM_API_URL=https://api.yourstore.com
NEXT_PUBLIC_MERCHANT_ID=your-merchant-id
CUSTOM_API_SECRET=your-api-secret
```

#### Custom API Requirements

Your custom API should implement these endpoints:

```
GET  /products              # List products
GET  /products/:handle      # Single product
GET  /collections           # List collections
GET  /collections/:handle   # Single collection with products
POST /cart                  # Create cart
PUT  /cart/:id              # Update cart
GET  /cart/:id              # Get cart
POST /checkout              # Create checkout
```

---

### GoKwik Checkout Integration

| Variable                              | Required | Description                                |
| ------------------------------------- | -------- | ------------------------------------------ |
| `NEXT_PUBLIC_GOKWIK_MID`              | Yes      | GoKwik Merchant ID                         |
| `NEXT_PUBLIC_GOKWIK_ENVIRONMENT`      | Yes      | `sandbox` or `production`                  |
| `NEXT_PUBLIC_GOKWIK_TYPE`             | Optional | Integration type                           |
| `NEXT_PUBLIC_GOKWIK_SCRIPT_URL`       | Optional | CDN URL (default: `https://cdn.gokwik.co`) |
| `NEXT_PUBLIC_GOKWIK_BANNER_MESSAGE_1` | Optional | Banner message 1                           |
| `NEXT_PUBLIC_GOKWIK_BANNER_MESSAGE_2` | Optional | Banner message 2                           |

```env
NEXT_PUBLIC_GOKWIK_MID=GK_MERCHANT_123
NEXT_PUBLIC_GOKWIK_ENVIRONMENT=sandbox
NEXT_PUBLIC_GOKWIK_TYPE=standard
NEXT_PUBLIC_GOKWIK_SCRIPT_URL=https://cdn.gokwik.co
NEXT_PUBLIC_GOKWIK_BANNER_MESSAGE_1=Free shipping on orders above ₹499
NEXT_PUBLIC_GOKWIK_BANNER_MESSAGE_2=Easy returns within 7 days
```

---

### GoKwik KwikPass (Authentication)

| Variable                           | Required | Description               |
| ---------------------------------- | -------- | ------------------------- |
| `NEXT_PUBLIC_KWIKPASS_MID`         | Yes      | KwikPass Merchant ID      |
| `NEXT_PUBLIC_KWIKPASS_ENVIRONMENT` | Yes      | `sandbox` or `production` |
| `NEXT_PUBLIC_KWIKPASS_SCRIPT_URL`  | Optional | CDN URL                   |

```env
NEXT_PUBLIC_KWIKPASS_MID=KP_MERCHANT_123
NEXT_PUBLIC_KWIKPASS_ENVIRONMENT=sandbox
NEXT_PUBLIC_KWIKPASS_SCRIPT_URL=https://cdn.gokwik.co
```

---

### Order History API

| Variable                                   | Required | Description               |
| ------------------------------------------ | -------- | ------------------------- |
| `NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL` | Optional | API URL for order history |

```env
NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL=https://api.yourstore.com/orders
```

---

### Analytics & Tracking

| Variable                              | Required | Description                 |
| ------------------------------------- | -------- | --------------------------- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`       | Optional | Google Analytics 4 ID       |
| `NEXT_PUBLIC_GTM_ID`                  | Optional | Google Tag Manager ID       |
| `NEXT_PUBLIC_FB_PIXEL_ID`             | Optional | Facebook Pixel ID           |
| `NEXT_PUBLIC_GOOGLE_ADS_ID`           | Optional | Google Ads conversion ID    |
| `NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL` | Optional | Google Ads conversion label |

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-123456789
NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL=AbCdEfGhIjKlMnOp
```

---

### Theme Configuration

| Variable                     | Required | Description                    |
| ---------------------------- | -------- | ------------------------------ |
| `NEXT_PUBLIC_THEME_NAME`     | Optional | Active theme (default: `dawn`) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Optional | Default locale (default: `en`) |

```env
NEXT_PUBLIC_THEME_NAME=dawn
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

---

### Caching (Optional)

| Variable    | Required | Description                            |
| ----------- | -------- | -------------------------------------- |
| `REDIS_URL` | Optional | Redis connection URL for caching       |
| `CACHE_TTL` | Optional | Cache TTL in seconds (default: `3600`) |

```env
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
```

---

### App Configuration

| Variable              | Required | Description                   |
| --------------------- | -------- | ----------------------------- |
| `NEXT_PUBLIC_APP_URL` | Optional | App URL (for og:url, sitemap) |
| `NODE_ENV`            | Auto     | `development` or `production` |

```env
NEXT_PUBLIC_APP_URL=https://yourstore.com
NODE_ENV=development
```

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

### Shopify Store (Production)

```env
# Platform
PLATFORM=shopify
MERCHANT_NAME=mystore

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=mystore.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxx
SHOPIFY_STORE_DOMAIN=mystore.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxx
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_admin_xxxx
SHOPIFY_API_VERSION=2025-04

# GoKwik Checkout
NEXT_PUBLIC_GOKWIK_MID=GK_MYSTORE
NEXT_PUBLIC_GOKWIK_ENVIRONMENT=production

# KwikPass Auth
NEXT_PUBLIC_KWIKPASS_MID=KP_MYSTORE
NEXT_PUBLIC_KWIKPASS_ENVIRONMENT=production

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345

# App
NEXT_PUBLIC_APP_URL=https://mystore.com
NODE_ENV=production
```

### Custom Backend (Development)

```env
# Platform
PLATFORM=custom
MERCHANT_NAME=devstore

# Custom API
NEXT_PUBLIC_CUSTOM_API_URL=http://localhost:8080
NEXT_PUBLIC_MERCHANT_ID=dev-merchant

# GoKwik (Sandbox)
NEXT_PUBLIC_GOKWIK_MID=GK_TEST
NEXT_PUBLIC_GOKWIK_ENVIRONMENT=sandbox

# KwikPass (Sandbox)
NEXT_PUBLIC_KWIKPASS_MID=KP_TEST
NEXT_PUBLIC_KWIKPASS_ENVIRONMENT=sandbox

# App
NEXT_PUBLIC_APP_URL=http://localhost:4344
NODE_ENV=development
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
3. Ensure your domain is whitelisted in GoKwik dashboard

---

## Security Notes

1. **Never commit** `.env.local` or any file with real credentials
2. **Use different tokens** for development and production
3. **Rotate tokens** if they're accidentally exposed
4. **Server-side variables** (without `NEXT_PUBLIC_`) are never sent to the browser
