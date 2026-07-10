# Shopkit Packages — AI Agent Guide

> A comprehensive guide for AI agents to understand and work with the @shopkit e-commerce package ecosystem.

## Quick Reference

| Package                     | Purpose                                  | Key Export                                     |
| --------------------------- | ---------------------------------------- | ---------------------------------------------- |
| `@shopkit/core`             | Theme system & auth context              | `ThemeProvider`, `useAuth`                     |
| `@shopkit/builder`          | Configuration-driven page building       | `createPageBuilder`, `WidgetRegistry`          |
| `@shopkit/data-layer`       | Commerce API abstraction                 | `createCommerceClient`                         |
| `@shopkit/cart`             | Cart state management (Zustand)          | `useCartStore`, `useCart`                      |
| `@shopkit/discounts`        | Discount/coupon system                   | `useDiscount`                                  |
| `@shopkit/analytics`        | Multi-platform event tracking            | `ShopkitAnalytics`, `publishEvent`             |
| `@shopkit/i18n`             | Internationalization                     | `useTranslation`, `TranslationService`         |
| `@shopkit/seo`              | SEO & structured data                    | `SEOManager`, `MetaTagGenerator`               |
| `@shopkit/asset-cache`      | Browser caching & service worker         | `initAssetCache`, `AssetLoader`                |
| `@shopkit/sandbox`          | BoxLite live preview client              | `BoxLiteClient`, `SandboxManager`              |
| `@shopkit/ai-store-builder` | AI merchant onboarding                   | `StoreAgent`, `WebsiteScraper`                 |
| `@shopkit/cli`              | CLI tools (generators, validators, perf) | `shopkit` binary                               |
| `@shopkit/app-shell`        | App wrapper components                   | `AppShell`, `AppHead`, `AppAnalytics`          |
| `@shopkit/webhooks`         | Shopify webhook handling utilities       | `handleShopifyWebhook`, `verifyShopifyWebhook` |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FOUNDATION LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  @shopkit/core          - Theme system, CSS variables, auth     │
│  @shopkit/data-layer    - Shopify/custom backend abstraction    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FEATURE LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  @shopkit/builder       - Page configs, widgets, data sources   │
│  @shopkit/cart          - Zustand store, hooks, persistence     │
│  @shopkit/discounts     - Coupon validation and application     │
│  @shopkit/i18n          - Server/client i18n for Next.js        │
│  @shopkit/seo           - Meta tags, JSON-LD, sitemaps          │
│  @shopkit/analytics     - GA4, Pixel, PostHog, MoEngage         │
│  @shopkit/asset-cache   - Cache strategies, service worker      │
│  @shopkit/sandbox       - Live code preview with Vite           │
│  @shopkit/app-shell     - App wrappers (providers, analytics)   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AI AGENT LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  @shopkit/ai-store-builder - Claude-powered store generation    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    TOOLING LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  @shopkit/cli           - Generators, validators, perf tools    │
│  @shopkit/webhooks      - Shopify webhook handling utilities    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Package Details

### 1. @shopkit/core

**Purpose:** Theme management with CSS variables and authentication context.

**Key Concepts:**

- Server/client boundary separation for Next.js App Router
- Theme loading from JSON files or API
- CSS variable generation for Tailwind integration

**Main Exports:**

```typescript
// Client-side (use in "use client" components)
import { ThemeProvider, useTheme } from "@shopkit/core/theme/client";
import { AuthProvider, useAuth } from "@shopkit/core/context";

// Server-side (use in server components)
import {
  getActiveTheme,
  configureThemeLoader,
} from "@shopkit/core/theme/server";
```

**Usage Pattern:**

```typescript
// In app/layout.tsx
export default async function RootLayout({ children }) {
  const theme = await getActiveTheme(merchantName);
  return (
    <ThemeProvider merchantName={merchantName} initialTheme={theme}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

// In client components
function MyComponent() {
  const { getValue } = useTheme();
  const { accessToken, login, logout } = useAuth();
  const primaryColor = getValue("colors.primary", "#3B82F6");
}
```

**Theme Structure:**

```json
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#6B7280",
    "background": "#FFFFFF",
    "text": "#111827"
  },
  "typography": {
    "bodyFont": "Inter",
    "headingFont": "Inter"
  },
  "spacing": { "base": "1rem" },
  "borderRadius": { "default": "0.5rem" }
}
```

---

### 2. @shopkit/builder

**Purpose:** Configuration-driven page building system with widgets and data sources.

**Key Concepts:**

- PageConfig JSON defines page structure
- WidgetRegistry maps widget types to React components
- DataSources auto-fetch commerce data
- Section-based layouts with responsive settings

**Main Exports:**

```typescript
import {
  // Page Builder
  createPageBuilder,
  WidgetRegistry,
  PageConfigHelpers,
  DATA_SOURCE_TYPES,
  SECTION_TYPES,

  // Analytics Components
  AnalyticsInitializer,
  ProductViewTracker,
} from "@shopkit/builder";

import type {
  PageConfig,
  SectionConfig,
  WidgetConfig,
  WidgetProps,
  RouteContext,
  AnalyticsInitializerConfig,
  TrackedProductData,
} from "@shopkit/builder";
```

**Analytics Components:**

```typescript
// AnalyticsInitializer - Initializes ShopkitAnalytics + page view tracking
// Used in AppShell or layout wrappers
<AnalyticsInitializer
  config={{
    googleAnalyticsMeasurementId: "G-XXX",
    facebookPixelId: "123456",
    gokwikEnabled: true,
  }}
/>

// ProductViewTracker - PDP view tracking with dwell time
// Used on product detail pages
<ProductViewTracker
  productData={{
    id: product.id,
    title: product.title,
    price: product.price,
    currency: "INR",
  }}
  dwellTimeSeconds={20}  // Fires engagement event after 20s
/>
```

**PageConfig Structure:**

```typescript
const pageConfig: PageConfig = {
  id: "home",
  dataSources: {
    featuredProducts: {
      type: "PRODUCTS",
      params: { first: 8, collectionHandle: "featured" },
      required: true,
    },
    allCollections: {
      type: "COLLECTIONS",
      params: { first: 10 },
    },
  },
  sections: [
    {
      id: "hero-section",
      name: "Hero",
      type: "full-width",
      settings: { layout: "full" },
      widgets: [
        {
          id: "hero-1",
          name: "Hero Banner",
          type: "HeroBanner",
          settings: {
            title: "t:home.hero.title", // Translation key
            subtitle: "Welcome to our store",
            ctaText: "Shop Now",
            ctaLink: "/collections/all",
          },
        },
      ],
    },
    {
      id: "products-section",
      name: "Featured Products",
      type: "container",
      settings: { layout: "page" },
      widgets: [
        {
          id: "product-grid-1",
          type: "ProductGrid",
          dataSourceKey: "featuredProducts", // Links to data source
          settings: { columns: 4 },
        },
      ],
    },
  ],
};
```

**Widget Component Pattern:**

```typescript
// Define a widget component
interface MyWidgetProps extends WidgetProps {
  title: string;
  items: Product[];
}

function MyWidget({ title, items, breakpoint }: MyWidgetProps) {
  return (
    <div>
      <h2>{title}</h2>
      {items.map(item => <ProductCard key={item.id} product={item} />)}
    </div>
  );
}

// Register in widget registry
const widgetRegistry = new WidgetRegistry();
widgetRegistry.register("MyWidget", MyWidget);
```

**Creating Page Builder:**

```typescript
const pageBuilder = createPageBuilder({
  widgetRegistry,
  commerceClient: myCommerceClient,
  themeLoader: myThemeLoader,
  templateLoader: myTemplateLoader,
  defaultLocale: "en",
});

// Render a page
const content = await pageBuilder.renderPage({
  merchantName: "my-store",
  routeContext: {
    templateName: "home",
    path: "/",
    params: {},
  },
});
```

---

### 3. @shopkit/data-layer

**Purpose:** Unified commerce API abstraction for Shopify and custom backends.

**Main Exports:**

```typescript
import {
  createCommerceClient,
  createShopifyClient,
  createCustomClient,
} from "@shopkit/data-layer";

import type {
  Product,
  Collection,
  Cart,
  Order,
  Customer,
} from "@shopkit/data-layer";
```

**Creating a Client:**

```typescript
// Shopify client
const client = createCommerceClient({
  type: "shopify",
  config: {
    domain: "your-store.myshopify.com",
    storefrontAccessToken: "your-token",
    apiVersion: "2024-01",
  },
  logging: { enabled: true, level: "info" },
});

// Custom backend client
const customClient = createCommerceClient({
  type: "custom",
  config: {
    baseUrl: "https://api.mybackend.com",
    apiKey: "key",
  },
});
```

**Common Methods:**

```typescript
// Products
const product = await client.getProduct({ handle: "product-slug" });
const products = await client.getProducts({ first: 20 });

// Collections
const collection = await client.getCollection({ handle: "collection-slug" });
const collections = await client.getCollections({ first: 10 });

// Cart
const cart = await client.getCart({ id: cartId });
const updatedCart = await client.addToCart({ id: cartId, items: lines });

// Orders
const orders = await client.getOrderHistory({ customerAccessToken });
```

**Static Generation (build-time route pre-generation):**

All 8 dynamic route pages use factory functions from `@shopkit/data-layer` to pre-build every collection and product page at CI time. Do not add `generateStaticParams` manually — use the factories:

```typescript
import {
  createCollectionStaticParams,
  createProductViaCollectionsStaticParams,
  createCollectionProductStaticParams,
} from "@shopkit/data-layer";
import { getCommerceClient } from "@/config/commerce";

// For /collections/[collectionname] and /collections-b/[collectionname]
export const generateStaticParams =
  createCollectionStaticParams(getCommerceClient);

// For /products/[handle] and /products-b/[handle]
// (custom backend has no products-list endpoint — collection traversal is the only option)
export const generateStaticParams =
  createProductViaCollectionsStaticParams(getCommerceClient);

// NOTE — choosing the right product factory:
// • Always use createProductViaCollectionsStaticParams for the custom REST backend (this
//   project). The backend exposes no products-list endpoint — the only way to discover all
//   product handles is to traverse collections. It fetches all collections then all products
//   per collection, deduplicating by handle so each /products/[handle] route is pre-built once.
// • createProductStaticParams is for backends that expose a direct product-listing endpoint
//   (e.g. Shopify Storefront API). Do NOT use it with the custom backend.

// For all nested /collections/.../products/... routes
export const generateStaticParams =
  createCollectionProductStaticParams(getCommerceClient);
```

Always pair with `export const revalidate = 3600` and `export const dynamicParams = true` as literal values (Next.js static analysis does not support computed values here).

All factories accept an `options` object. The traversal-based factories (`createProductViaCollectionsStaticParams`, `createCollectionProductStaticParams`) also accept `concurrency` (default: `10`) to cap simultaneous `getCollection` API calls — lower it if your backend is rate-limited, raise it if your backend is fast:

```typescript
export const generateStaticParams = createProductViaCollectionsStaticParams(
  getCommerceClient,
  { collectionsLimit: 250, productsPerCollection: 100, concurrency: 5 }
);
```

**Response Pattern:**

```typescript
interface IResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: { message: string; details?: any };
}

// Always check success
const response = await client.getProduct({ handle: "my-product" });
if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error?.message);
}
```

---

### 4. @shopkit/cart

**Purpose:** Cart state management using Zustand with localStorage persistence.

**Main Exports:**

```typescript
import {
  // Store
  useCartStore,
  configureCart,

  // Hooks
  useCart,
  useCartCount,
  useCartItems,
  useCartTotal,
  useIsInCart,

  // Services
  DefaultCartService,
  DefaultCartStorage,

  // Components
  CartInitializer,

  // Utils
  formatPrice,
  calculateCartTotal,
} from "@shopkit/cart";
```

**Configuration:**

```typescript
// In your app initialization (e.g., bootstrap/cart.ts)
configureCart({
  merchantName: "my-store",
  currency: "USD",
  cartService: new DefaultCartService("/api/cart"),
  cartStorage: new DefaultCartStorage("my-store"),
});
```

**Using Cart Hooks:**

```typescript
// Add to cart
function AddToCartButton({ product, variant }) {
  const { addToCart, isLoading } = useCart();

  const handleAdd = () => {
    addToCart({
      variantId: variant.id,
      quantity: 1,
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        image: product.featuredImage,
      },
    });
  };

  return (
    <button onClick={handleAdd} disabled={isLoading}>
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
}

// Read cart state
function CartSummary() {
  const items = useCartItems();
  const total = useCartTotal();
  const count = useCartCount();

  return (
    <div>
      <span>{count} items</span>
      <span>{formatPrice(total, "USD")}</span>
    </div>
  );
}

// Check if product is in cart
function ProductCard({ product }) {
  const isInCart = useIsInCart(product.variants[0].id);
  return <div>{isInCart && <span>In Cart</span>}</div>;
}
```

**CartInitializer Component:**

```typescript
// In app/layout.tsx - initializes cart from storage
<CartInitializer merchantName="my-store">
  {children}
</CartInitializer>
```

---

### 5. @shopkit/discounts

**Purpose:** Discount code validation and application.

**Main Exports:**

```typescript
import { useDiscount } from "@shopkit/discounts";
import type {
  IDiscountService,
  DiscountResult,
  AppliedDiscount,
} from "@shopkit/discounts";
```

**Implementing a Discount Service:**

```typescript
class MyDiscountService implements IDiscountService {
  async applyDiscount(
    code: string,
    cartTotal: number
  ): Promise<DiscountResult> {
    const response = await fetch("/api/discount", {
      method: "POST",
      body: JSON.stringify({ code, cartTotal }),
    });
    return response.json();
  }

  async removeDiscount(): Promise<void> {
    // Clear applied discount
  }

  async getOffers(): Promise<OffersResult> {
    // Return available offers
  }
}
```

**Using the Hook:**

```typescript
function CouponForm() {
  const {
    couponCode,
    setCouponCode,
    applyCoupon,
    removeCoupon,
    appliedDiscount,
    isDiscountLoading,
    discountError,
  } = useDiscount({
    discountService: new MyDiscountService(),
    onSuccess: (discount) => console.log("Applied:", discount),
    onError: (error) => console.error("Error:", error),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); applyCoupon(); }}>
      <input
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Enter coupon code"
      />
      <button type="submit" disabled={isDiscountLoading}>
        Apply
      </button>
      {appliedDiscount && (
        <div>
          Discount: {appliedDiscount.discountPercentage}% off
          <button onClick={removeCoupon}>Remove</button>
        </div>
      )}
    </form>
  );
}
```

---

### 6. @shopkit/events (V2 Pixel Runtime)

**Purpose:** Event bus + self-registering pixel SDK runtime for analytics tracking.

**Architecture:** EventBus emits PascalCase events (PageView, ViewContent, AddToCart, etc.). The PixelRuntime subscribes to all events and forwards them to registered SDK scripts. SDK scripts live in `public/scripts/` and self-register via `window.__OPEN_STORE_PIXEL_RUNTIME__`.

**Supported Platforms (via SDK scripts):**

- Meta Pixel with Conversions API (CAPI) — `meta-pixel-sdk.js`
- GA4 + Google Ads (unified) — `ga4-pixel-sdk.js`
- Google Ads standalone (Purchase-only fallback) — `google-ads-pixel-sdk.js`

**Main Exports:**

```typescript
import { eventBus } from "@shopkit/events";
import type { PixelConfigMap } from "@shopkit/events/pixel-runtime";
import {
  AffiliateTracker,
  getAffiliateParams,
} from "@shopkit/events/affiliate";
```

**Affiliate / UTM capture (`@shopkit/events/affiliate`):**

Mount `<AffiliateTracker autoCapture />` once at the layout root (alongside `AppCartInitializer`). It captures UTM params + platform click IDs from the landing URL into `sessionStorage` under the `"affiliate_data"` key — the same key the events `userEnricherMiddleware` reads from, so every pixel event downstream gets attribution attached for free. To forward captured params to a downstream API (e.g. checkout), call `getAffiliateParams()` and pass into the payload — `CustomCheckoutService` already does this for GoKwik.

**Setup (pixelConfig.ts):**

```typescript
import type { PixelConfigMap } from "@shopkit/events/pixel-runtime";

export const pixelConfig: PixelConfigMap = {
  "meta-pixel": process.env.NEXT_PUBLIC_MULTI_PIXEL_IDS
    ? { pixelId: process.env.NEXT_PUBLIC_MULTI_PIXEL_IDS }
    : null,

  ga4: process.env.NEXT_PUBLIC_GA_ID
    ? {
        measurementId: process.env.NEXT_PUBLIC_GA_ID,
        isolated: false, // false = events fan out to all gtag destinations (GA4 + Ads)
        ads: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
          ? {
              conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
              conversionLabel:
                process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || "",
            }
          : undefined,
      }
    : null,
};
```

**GA4 + Google Ads Unified SDK:**

The GA4 SDK (`ga4-pixel-sdk.js`) handles both GA4 and Google Ads via shared `gtag.js`:

- Both destinations registered via `gtag("config")` — GA4 with `send_page_view: true`, Google Ads with `send_page_view: false`
- Events fire without `send_to` — gtag.js broadcasts to all configured destinations
- Purchase additionally fires `"conversion"` with `send_to: conversionId/label` for Google Ads counted conversions
- `isolated: true` adds `send_to: measurementId` to scope events to GA4 only

**13 Standard Events:**

PageView, ViewContent, AddToCart, InitiateCheckout, AddShippingInfo,
AddPaymentInfo, Purchase, Search, AddToWishlist, Lead, CompleteRegistration,
Contact, Subscribe

**Layout Setup:**

```typescript
// layout.tsx — SDK scripts load AFTER gtag.js
<Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
<Script id="gtag-init" strategy="afterInteractive">
  {`window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());`}
</Script>
<Script src="/scripts/meta-pixel-sdk.js" strategy="afterInteractive" />
<Script src="/scripts/ga4-pixel-sdk.js" strategy="afterInteractive" />
```

---

### 7. @shopkit/i18n

**Purpose:** Internationalization for Next.js with server/client separation.

**Main Exports:**

```typescript
// Main entry (types & factories)
import { createI18nConfig, TranslationService } from "@shopkit/i18n";

// Client hooks and formatters
import { useTranslation, formatCurrency } from "@shopkit/i18n/client";

// Server utilities
import { createGetLocale, createI18nRequestConfig } from "@shopkit/i18n/server";

// Middleware
import { createLocaleMiddleware } from "@shopkit/i18n/middleware";
```

**Configuration:**

```typescript
// bootstrap/i18n-config.ts
export const i18nConfig = createI18nConfig({
  locales: ["en", "hi", "es"] as const,
  defaultLocale: "en",
  localeNames: {
    en: "English",
    hi: "हिन्दी",
    es: "Español",
  },
});
```

**Using Translations:**

```typescript
// In client components
function ProductTitle({ product }) {
  const t = useTranslation();
  return <h1>{t("product.title", { name: product.title })}</h1>;
}

// Translation files (locales/en.json)
{
  "product": {
    "title": "Product: {name}",
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock"
  }
}
```

**Translation in PageConfig:**
Use `t:` prefix for translation keys:

```typescript
{
  settings: {
    title: "t:home.hero.title",      // Translated
    subtitle: "Static subtitle",      // Not translated
  }
}
```

---

### 8. @shopkit/seo

**Purpose:** Comprehensive SEO with meta tags, structured data, and sitemaps.

**Main Exports:**

```typescript
import {
  SEOManager,
  SEOFactory,
  MetaTagGenerator,
  StructuredDataGenerator,
  BreadcrumbGenerator,
  SitemapGenerator,
} from "@shopkit/seo";
```

**Creating SEO System:**

```typescript
const seo = SEOFactory.createSEOSystem({
  siteName: "My Store",
  siteUrl: "https://mystore.com",
  defaultImage: "/images/og-default.jpg",
  enableStructuredData: true,
  enableOpenGraph: true,
  enableTwitterCards: true,
});
```

**Generating Meta Tags:**

```typescript
// For product page
const productMeta = seo.metaTagGenerator.generateProductMeta({
  title: product.title,
  description: product.description,
  image: product.featuredImage.url,
  price: product.priceRange.minVariantPrice.amount,
  currency: "USD",
  availability: product.availableForSale ? "in stock" : "out of stock",
});

// For collection page
const collectionMeta = seo.metaTagGenerator.generateCollectionMeta({
  title: collection.title,
  description: collection.description,
  image: collection.image?.url,
});
```

**Structured Data (JSON-LD):**

```typescript
const productJsonLd = seo.structuredDataGenerator.generateProductSchema({
  name: product.title,
  description: product.description,
  image: product.images.map(img => img.url),
  sku: product.variants[0].sku,
  price: product.priceRange.minVariantPrice.amount,
  currency: "USD",
  availability: "https://schema.org/InStock",
  brand: { name: "My Brand" },
});

// In page component
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
/>
```

---

### 9. @shopkit/asset-cache

**Purpose:** Browser-side asset caching with Service Worker support.

**Main Exports:**

```typescript
import {
  initAssetCache,
  AssetLoader,
  CacheManager,
  registerServiceWorker,
} from "@shopkit/asset-cache";
```

**Initialization:**

```typescript
await initAssetCache({
  enabled: true,
  version: "1.0.0",
  storageName: "my-store-assets",
  maxSize: 50, // MB
  maxAge: 86400, // 24 hours in seconds
  serviceWorkerEnabled: true,
  serviceWorkerPath: "/sw.js",
});
```

**Using AssetLoader:**

```typescript
// Load and cache an asset
const imageBlob = await AssetLoader.load("https://cdn.example.com/image.jpg", {
  ttl: 3600, // 1 hour
  priority: "high",
  tags: ["product-images"],
});

// Invalidate by tag
await CacheManager.invalidateByTag("product-images");

// Clear all cache
await CacheManager.clear();
```

**Caching Strategies:**

- `cache-first`: Check cache, fallback to network (for static assets)
- `network-first`: Try network, fallback to cache (for dynamic content)
- `stale-while-revalidate`: Return cached, update in background

---

### 10. @shopkit/sandbox

**Purpose:** TypeScript client for BoxLite sandbox - live code preview.

**Main Exports:**

```typescript
import { BoxLiteClient, SandboxManager, SocketManager } from "@shopkit/sandbox";

import type { SandboxState, ToolResponse, FileContent } from "@shopkit/sandbox";
```

**REST API Client:**

```typescript
const client = new BoxLiteClient({
  baseUrl: "http://localhost:5100",
  timeout: 30000,
});

// Create sandbox
const sandbox = await client.createSandbox();
console.log("Sandbox ID:", sandbox.sandbox_id);

// Write files
await client.writeFile(
  "/src/App.tsx",
  `
  export default function App() {
    return <h1>Hello World</h1>;
  }
`
);

// Start dev server
await client.startDevServer();

// Get screenshot
const screenshot = await client.getScreenshot();
```

**WebSocket Manager (Real-time):**

```typescript
const manager = new SandboxManager();
await manager.initialize();

manager.connectAgentWebSocket({
  onStateUpdate: (state: SandboxState) => {
    console.log("Sandbox status:", state.status);
    console.log("Preview URL:", state.preview_url);
  },
  onTextDelta: (delta: string) => {
    process.stdout.write(delta); // Stream AI responses
  },
  onToolCall: (tool) => {
    console.log("Tool called:", tool.name);
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});

// Send chat message
manager.sendChatMessage("Create a product grid component");
```

---

### 11. @shopkit/ai-store-builder

**Purpose:** AI-powered merchant onboarding and store generation using Claude.

**Main Exports:**

```typescript
import {
  configure,
  StoreAgent,
  WebsiteScraper,
  BrowserPool,
  tools,
  executeToolCall,
} from "@shopkit/ai-store-builder";
```

**Configuration:**

```typescript
configure({
  shopify: {
    domain: "your-store.myshopify.com",
    accessToken: "your-admin-token",
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  paths: {
    themesDir: "./themes",
    assetsDir: "./public/assets",
  },
});
```

**Using StoreAgent:**

```typescript
const agent = new StoreAgent();

const result = await agent.generateStorefront({
  sourceUrl: "https://example-store.com",
  merchantName: "my-store",
  options: {
    scrapeDesign: true,
    migrateAssets: true,
    generateWidgets: true,
  },
});

console.log("Theme generated:", result.theme);
console.log("Widgets created:", result.widgets);
console.log("Assets migrated:", result.assets);
```

**Available Tools:**

| Tool                    | Purpose                              |
| ----------------------- | ------------------------------------ |
| `scrapeStore`           | Scrape website structure and content |
| `analyzeDesign`         | Extract colors, fonts, spacing       |
| `migrateAssets`         | Download and optimize images/fonts   |
| `createMerchant`        | Create new merchant in system        |
| `addSection`            | Add section to page template         |
| `addWidget`             | Add widget to section                |
| `updateWidget`          | Modify widget settings               |
| `updateThemeColors`     | Update theme color palette           |
| `updateThemeTypography` | Update fonts and sizes               |
| `triggerClaudeCode`     | Generate code via Claude Code        |

---

### 12. @shopkit/cli

**Purpose:** Unified CLI for storefront development - generators, validators, and performance tools.

**Main Commands:**

```bash
# Schematics (scaffolding)
shopkit g theme <name>         # Generate a new theme
shopkit g widget <name>        # Generate a new widget
shopkit g template <name>      # Generate a new template

# Registry Generators
shopkit generate:widgets       # Generate widget registry (types.ts, manifest.ts)
shopkit generate:templates     # Generate template registry
shopkit generate:i18n          # Generate i18n manifest

# Watchers (dev mode)
shopkit watch:widgets          # Watch and regenerate widget registry
shopkit watch:locales          # Watch and regenerate i18n manifest

# Validators
shopkit validate:widget        # Validate widget structure
shopkit validate:template      # Validate template structure
shopkit validate:route         # Validate route static generation
shopkit validate:assets        # Validate asset sizes

# Performance
shopkit perf:score             # Score widgets (0-100 based on ESLint)
shopkit perf:critical          # Check critical widgets aren't lazy-loaded
shopkit perf:audit             # Audit third-party scripts
shopkit perf:rules             # List all performance rules
```

**Programmatic Usage:**

```typescript
import {
  // Generators
  generateWidget,
  generateTheme,
  generateTemplate,

  // Validators
  validateWidgets,
  validateTemplates,
  validateRoutes,
  validateAssets,
  validateCriticalWidgets,

  // Tools
  scoreWidgets,
  auditThirdParty,
  listRules,

  // Scripts
  generateWidgetRegistry,
  generateTemplateRegistry,
  generateI18nManifest,
} from "@shopkit/cli";
```

**App Script Configuration:**

```json
{
  "scripts": {
    "cli": "shopkit",
    "g": "shopkit g",
    "generate": "bun run generate:widgets && bun run generate:templates && bun run generate:i18n",
    "generate:widgets": "shopkit generate:widgets",
    "generate:templates": "shopkit generate:templates",
    "generate:i18n": "shopkit generate:i18n",
    "validate:widget": "shopkit validate:widget",
    "validate:template": "shopkit validate:template",
    "perf:score": "shopkit perf:score --staged-only",
    "perf:rules": "shopkit perf:rules"
  }
}
```

**CLI Options:**

```
--staged-only     Validate only staged files (for pre-commit hooks)
--widget=<name>   Target specific widget for scoring
--min-score=<n>   Minimum passing score (default: 75)
--category=<cat>  Filter rules by category (LCP, CLS, INP, etc.)
--blocked         Show only blocked packages
--allowed         Show only allowed packages
```

---

### 13. @shopkit/app-shell

**Purpose:** App wrapper components that abstract provider nesting complexity.

**Main Exports:**

```typescript
import {
  AppShell,
  AppHead,
  AppAnalytics,
  AppAnalyticsInit,
  AppProductTracker,
  AppToast,
  AppToastContainer,
  useToast,
  AppRouteLoader,
} from "@shopkit/app-shell";
```

**Usage in layout.tsx:**

```typescript
import { AppShell, AppHead, AppAnalytics } from "@shopkit/app-shell";

export default async function RootLayout({ children }) {
  return (
    <html>
      <head>
        <AppHead />
      </head>
      <body>
        <AppShell config={{ merchantName, locale, messages, theme }}>
          {children}
        </AppShell>
        <AppAnalytics />
      </body>
    </html>
  );
}
```

---

### 14. @shopkit/webhooks

**Purpose:** Shopify webhook handling utilities for cache invalidation and page revalidation.

**Main Exports:**

```typescript
import {
  // Main handler
  handleShopifyWebhook,

  // Utils
  logger,
  verifyShopifyWebhook,
  createSuccessResponse,
  createErrorResponse,
  handleWebhookError,

  // Data processing
  parseWebhookBody,
  logWebhookReceived,
  createWebhookData,

  // Cache & revalidation
  logCacheInvalidations,
  revalidateChangedPage,

  // Types & constants
  ENTITY_TYPE,
  WEBHOOK_TYPE,
  type WebhookConfig,
  type WebhookType,
  type EntityType,
  type ShopifyProduct,
  type ShopifyCollection,
  type ShopifyInventory,
  type WebhookResponse,
  type WebhookErrorResponse,
} from "@shopkit/webhooks";
```

**Usage in API Routes:**

```typescript
// src/app/api/webhooks/shopify/products/create/route.ts
import { handleShopifyWebhook } from "@shopkit/webhooks";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return handleShopifyWebhook(request, {
    webhookType: "product.created",
    entityType: "product",
    logMessage: "product creation",
  });
}
```

**Webhook Types:**

- `product.created`, `product.updated`, `product.deleted`
- `collection.created`, `collection.updated`, `collection.deleted`
- `inventory.updated`

**Environment Variables:**

- `SHOPIFY_WEBHOOK_SECRET` - Required for HMAC signature verification

---

## Common Integration Patterns

### Layout Wrapper Components

The app uses three wrapper components to abstract away complexity from AI agents:

| Component      | Location       | Purpose                                     |
| -------------- | -------------- | ------------------------------------------- |
| `AppHead`      | `<head>`       | A/B testing, DNS prefetch, favicon, Clarity |
| `AppShell`     | `<body>`       | Provider nesting (theme, auth, cart, i18n)  |
| `AppAnalytics` | `<body>` (end) | GA, PostHog, Facebook Pixel                 |

```typescript
// src/app/layout.tsx - SIMPLIFIED with all three wrappers
import { AppShell, AppHead, AppAnalytics } from "@/app-shell";
import { getTheme } from "@/bootstrap/theme";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getMerchantName } from "@/lib/utils";

export default async function RootLayout({ children }) {
  const merchantName = getMerchantName();
  const locale = getStaticLocale();
  const messages = await getMessages();
  const theme = await getTheme(merchantName);

  return (
    <html lang={locale} className={`${inter.variable} ${openSans.variable}`}>
      <head>
        {/* AppHead handles: A/B testing, favicon, DNS prefetch, Clarity */}
        <AppHead />
      </head>

      <body>
        {/* AppShell handles: providers, cart, auth, i18n, theme */}
        <AppShell
          config={{ merchantName, locale, messages, theme }}
          cartDrawer={<CartDrawer />}  // Optional
          authWidget={<KwikPass />}    // Optional
        >
          {children}
        </AppShell>

        {/* AppAnalytics handles: GA, PostHog, Facebook Pixel */}
        <AppAnalytics />
      </body>
    </html>
  );
}
```

---

### AppHead - Head Scripts Wrapper

Handles all `<head>` scripts and resource hints. Reads from environment variables.

**What AppHead handles internally (DO NOT modify):**

- A/B Testing scripts (PRT config) - `beforeInteractive`
- Favicon
- DNS prefetch for CDN domains
- Microsoft Clarity script

**Environment Variables:**

```env
NEXT_PUBLIC_PRT_CONFIG_URL=https://prt.example.com/config.js
NEXT_PUBLIC_PRT_AB_URL=https://prt.example.com/ab.js
NEXT_PUBLIC_CLARITY_ID=your-clarity-id
```

**Optional Config Override:**

```typescript
<AppHead config={{
  abTesting: { prtConfigUrl: "...", prtAbUrl: "..." },
  prefetch: { dnsDomains: ["cdn.example.com"], preloadScripts: [] },
  favicon: "/custom-favicon.png",
  clarity: { projectId: "xxx" },
}} />
```

---

### AppShell - Master Provider Wrapper

The `AppShell` component abstracts away provider nesting complexity. **AI agents should use AppShell instead of manually nesting providers.**

**What AppShell handles internally (DO NOT modify):**

- `RouteLoader` - Navigation loading bar
- `NextIntlClientProvider` - i18n translations
- `ThemeProvider` - CSS variables and theme
- `ToastProvider` + `ToastContainer` - Notifications
- `AuthProvider` - User authentication
- `AppCartInitializer` - Cart state setup
- `AssetCacheInitializer` - Image caching
- `AnalyticsInitializer` - Analytics tracking

**AI Agent Rule:** Configure the app via `AppShell` config prop. Never manually nest these providers.

---

### Pixel SDKs — V2 Self-Registration Model

SDK scripts in `public/scripts/` self-register with the PixelRuntime. The runtime handles dedup, event replay, and per-SDK circuit breakers.

**Key design: GA4 + Google Ads are unified in `ga4-pixel-sdk.js`.** They share the same `gtag.js` instance. Events fire without `send_to` — gtag.js broadcasts to all `gtag("config")` destinations. Purchase additionally fires a `"conversion"` event with `send_to` for Google Ads counted conversions.

**Environment Variables:**

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_ISOLATED=false
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=xxxxxxx
NEXT_PUBLIC_MULTI_PIXEL_IDS=123456789
NEXT_PUBLIC_CAPI_HMAC_SECRET=xxx
```

**DO NOT:**

- Create a separate Google Ads SDK — use the unified `ga4-pixel-sdk.js`
- Call `window.gtag()` directly in checkout or button components
- Lazy-load SDK scripts — always load in `layout.tsx`

---

### Legacy App Initialization (without AppShell)

For reference, here's the manual provider nesting (not recommended):

```typescript
import { ThemeProvider } from "@shopkit/core/theme/client";
import { AuthProvider } from "@shopkit/core/context";
import { CartInitializer } from "@shopkit/cart";
import { ShopkitAnalytics } from "@shopkit/analytics";
import { getActiveTheme } from "@shopkit/core/theme/server";

export default async function RootLayout({ children }) {
  const theme = await getActiveTheme("my-store");

  return (
    <html>
      <body>
        <ThemeProvider merchantName="my-store" initialTheme={theme}>
          <AuthProvider>
            <CartInitializer merchantName="my-store">
              <ShopkitAnalytics config={analyticsConfig}>
                {children}
              </ShopkitAnalytics>
            </CartInitializer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Page Component Pattern

```typescript
import { SEOFactory } from "@shopkit/seo";
import type { Metadata } from "next";

// Generate metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.handle);
  const seo = SEOFactory.createSEOSystem({ siteName: "My Store", siteUrl: "..." });
  return seo.metaTagGenerator.generateProductMeta(product);
}

// Page component
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);
  return <ProductTemplate product={product} />;
}
```

### Widget Component Pattern

```typescript
import type { WidgetProps } from "@shopkit/builder";
import { useTranslation } from "@shopkit/i18n/client";
import { useCart } from "@shopkit/cart";
import { publishEvent, EventType } from "@shopkit/analytics";

interface ProductGridProps extends WidgetProps {
  products: Product[];
  columns: number;
}

export function ProductGrid({ products, columns, breakpoint }: ProductGridProps) {
  const t = useTranslation();
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({ ... });
    publishEvent({
      type: EventType.ADD_TO_CART,
      productId: product.id,
      productName: product.title,
      price: parseFloat(product.priceRange.minVariantPrice.amount),
    });
  };

  return (
    <div className={`grid grid-cols-${columns}`}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => handleAddToCart(product)}
        />
      ))}
    </div>
  );
}
```

---

## Bootstrap Folder - Package Configuration

**All @shopkit package configurations are in `src/bootstrap/`**

The `bootstrap/` folder centralizes package configurations (composition roots) separate from app-specific code in `lib/`.

### Bootstrap Files

| File                       | Package            | Purpose                                 |
| -------------------------- | ------------------ | --------------------------------------- |
| `bootstrap/builder.ts`     | `@shopkit/builder` | Theme/template loaders, widget registry |
| `bootstrap/cart.ts`        | `@shopkit/cart`    | Cart services, storage, currency config |
| `bootstrap/i18n.ts`        | `@shopkit/i18n`    | Server-side i18n utilities              |
| `bootstrap/i18n-config.ts` | `@shopkit/i18n`    | Client-safe i18n config                 |
| `bootstrap/theme.ts`       | `@shopkit/core`    | Theme loading utility                   |
| `bootstrap/index.ts`       | N/A                | Barrel exports                          |

### Import Guidelines

```typescript
// ✅ PREFERRED: Direct package imports
import { useCartStore, useCart } from "@shopkit/cart";
import { useDiscount } from "@shopkit/discounts";

// ✅ PREFERRED: Bootstrap utilities for configured instances
import { getPageBuilder } from "@/bootstrap/builder";
import { AppCartInitializer } from "@/bootstrap/cart";
import { getLocale, loadMessages } from "@/bootstrap/i18n";
import { i18nConfig } from "@/bootstrap/i18n-config";

// ⚠️ LEGACY: Wrapper imports (works, but prefer direct)
import { useCartStore } from "@/lib/cart";
```

### Bootstrap Examples

```typescript
// bootstrap/cart.ts - Configures @shopkit/cart
import { configureCart, DefaultCartService, DefaultCartStorage } from "@shopkit/cart";

configureCart({
  merchantName: "my-store",
  cartService: new DefaultCartService(),
  cartStorage: new DefaultCartStorage("my-store"),
  defaultCurrencyCode: "USD",
});

export function AppCartInitializer({ merchantName }) { ... }
```

```typescript
// bootstrap/builder.ts - Configures @shopkit/builder
import { getPageBuilder as getCore } from "@shopkit/builder";
import { WIDGET_MANIFEST } from "@/widgets/.generated/manifest";

const themeLoader: IThemeLoader = { ... };
const templateLoader: ITemplateLoader = { ... };

export function getPageBuilder() {
  return getCore({ widgets: WIDGET_MANIFEST, themeLoader, templateLoader });
}
```

### Directory Structure

```
src/
├── bootstrap/                  # @shopkit package configurations
│   ├── index.ts               # Barrel exports
│   ├── builder.ts             # @shopkit/builder configuration
│   ├── cart.ts                # @shopkit/cart configuration
│   ├── i18n.ts                # @shopkit/i18n server utilities
│   ├── i18n-config.ts         # @shopkit/i18n static config (client-safe)
│   └── theme.ts               # @shopkit/core theme loading
│
├── # Note: app-shell is now @shopkit/app-shell package
│   ├── middleware/            # Middleware utilities (Edge runtime)
│   │   ├── locale.ts          # Locale detection utilities
│   │   ├── ab-testing.ts      # A/B test rewrite utilities
│   │   ├── utils.ts           # Common utilities
│   │   └── index.ts           # Exports
│   └── index.ts               # Barrel exports
│
├── lib/                        # App-specific code ONLY
│   ├── # Package Wrappers (backward compatibility)
│   ├── cart/                  # Re-exports @shopkit/cart + discounts
│   │   └── index.ts
│   │
│   ├── # App-Specific Code
│   ├── commerce/              # Shopify adapter
│   ├── data-layer/            # Commerce client setup
│   ├── gokwik/                # GoKwik integration (Wellversed-specific)
│   ├── webhooks/              # Webhook handlers
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   └── services/              # App service implementations
│       ├── shopify-discount-service.ts  # IDiscountService implementation
│       └── translation-utils.ts         # Route translation utilities
```

---

## File Structure Reference

```
storefront-builder/
├── apps/
│   ├── wellversed/              # Reference e-commerce app
│   │   ├── src/
│   │   │   ├── app/             # Next.js App Router
│   │   │   ├── widgets/         # Widget components
│   │   │   ├── themes/          # Theme configs & templates
│   │   │   ├── lib/             # Setup files & adapters (see above)
│   │   │   └── ui/              # Atomic UI components
│   │   └── public/
│   │
│   └── starter/                 # Minimal starter template
│
├── packages/
│   ├── core/                    # Theme & auth
│   │   └── src/
│   │       ├── theme/
│   │       │   ├── client/      # ThemeProvider, useTheme
│   │       │   └── server/      # getActiveTheme
│   │       └── context/         # AuthProvider, useAuth
│   │
│   ├── builder/                 # Page builder
│   │   └── src/
│   │       ├── core/            # Engine
│   │       ├── interfaces/      # IWidgetRegistry, etc.
│   │       └── types/           # PageConfig, WidgetConfig
│   │
│   ├── data-layer/              # Commerce API
│   │   └── src/
│   │       ├── adapters/        # Shopify, Custom
│   │       ├── core/            # Client factory
│   │       └── models/          # Product, Collection, etc.
│   │
│   ├── cart/                    # Cart state
│   │   └── src/
│   │       ├── store.ts         # Zustand store
│   │       ├── hooks/           # useCart, etc.
│   │       └── services/        # CartService, CartStorage
│   │
│   ├── discounts/               # Discount system
│   ├── analytics/               # Event tracking
│   ├── i18n/                    # Internationalization
│   ├── seo/                     # SEO utilities
│   ├── asset-cache/             # Caching system
│   ├── sandbox/                 # BoxLite client
│   ├── ai-store-builder/        # AI agent
│   ├── app-shell/               # App wrapper components
│   │   └── src/
│   │       ├── AppShell/        # Master provider wrapper
│   │       ├── AppHead/         # Head scripts wrapper
│   │       ├── AppAnalytics/    # Analytics scripts
│   │       ├── AppToast/        # Toast notifications
│   │       └── AppRouteLoader/  # Navigation progress
│   │
│   └── cli/                     # CLI tools
│       └── src/
│           ├── generators/      # Theme, widget, template generators
│           ├── validators/      # Widget, template, route, asset validators
│           ├── tools/           # Score, audit, rules
│           ├── scripts/         # Registry generators, watchers
│           └── utils/           # Colors, prompts, file utilities
```

---

## Key Interfaces to Implement

When building custom integrations, implement these interfaces:

```typescript
// Commerce client (data-layer)
interface ICommerceClient {
  getProduct(params: { handle: string }): Promise<IResponse<Product>>;
  getProducts(params: { first: number }): Promise<IResponse<Product[]>>;
  getCollection(params: { handle: string }): Promise<IResponse<Collection>>;
  getCollections(params: { first: number }): Promise<IResponse<Collection[]>>;
  // ... more methods
}

// Theme loader (core)
interface IThemeLoader {
  loadTheme(merchantName: string): Promise<Theme>;
}

// Template loader (builder)
interface ITemplateLoader {
  loadTemplate(merchantName: string, templateName: string): Promise<PageConfig>;
}

// Cart service (cart)
interface ICartService {
  getCart(cartId: string): Promise<CartResponse>;
  addToCart(cartId: string, items: CartItemRequest[]): Promise<CartResponse>;
  updateCart(cartId: string, items: CartItemRequest[]): Promise<CartResponse>;
  removeFromCart(cartId: string, lineIds: string[]): Promise<CartResponse>;
}

// Discount service (discounts)
interface IDiscountService {
  applyDiscount(code: string, cartTotal: number): Promise<DiscountResult>;
  removeDiscount(): Promise<void>;
  getOffers(): Promise<OffersResult>;
}
```

---

## Environment Variables

Common environment variables used across packages:

```env
# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx
SHOPIFY_ADMIN_ACCESS_TOKEN=xxx

# Analytics (V2 Pixel Runtime)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_ISOLATED=false
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=xxxxxxx
NEXT_PUBLIC_MULTI_PIXEL_IDS=123456789
NEXT_PUBLIC_CAPI_HMAC_SECRET=xxx

# AI
ANTHROPIC_API_KEY=sk-ant-xxx

# General
NEXT_PUBLIC_SITE_URL=https://yourstore.com
```

---

## Integrations Architecture

The `src/integrations/` folder contains platform-specific integration modules for GoKwik services.

### Integration Structure

```
integrations/
├── kwikpass-shopify/        # KwikPass auth for Shopify
├── kwikpass-custom/         # KwikPass auth for Custom platform
├── checkout-shopify/        # GoKwik checkout for Shopify
├── checkout-custom/         # GoKwik checkout for Custom platform
├── cart-drawer-shopify/     # Cart drawer for Shopify
├── cart-drawer-custom/      # Cart drawer for Custom platform
└── README.md                # Architecture documentation
```

### Platform Types

| Platform    | Backend                | Cart API | Checkout                   |
| ----------- | ---------------------- | -------- | -------------------------- |
| **Shopify** | Shopify Storefront API | GraphQL  | Shopify Checkout or GoKwik |
| **Custom**  | Custom REST API        | REST     | GoKwik only                |

### Naming Conventions

| Type           | Pattern                         | Example                    |
| -------------- | ------------------------------- | -------------------------- |
| Folder         | `{feature}-{platform}/`         | `checkout-custom/`         |
| Main component | `{Feature}{Platform}.tsx`       | `CheckoutCustom.tsx`       |
| Button         | `{Feature}Button{Platform}.tsx` | `CheckoutButtonCustom.tsx` |
| Script         | `{Feature}Script{Platform}.tsx` | `CheckoutScriptCustom.tsx` |
| Service        | `{Platform}{Feature}Service.ts` | `CustomCheckoutService.ts` |
| Hook           | `use{Platform}{Feature}.ts`     | `useCustomCheckout.ts`     |

### Script Loading Best Practices

**Critical:** Always load checkout scripts in the layout to ensure SDK availability:

```typescript
// app/layout.tsx - CORRECT
const CheckoutCustom = dynamic(
  () => import("@/integrations/checkout-custom").then((mod) => ({
    default: mod.CheckoutCustom,
  })),
  { ssr: false },
);

<AppShell>
  <CheckoutCustom />  {/* Script loads here FIRST */}
  {children}
  <CustomCartDrawer />
</AppShell>
```

**Never use dynamic() for script components in button files:**

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
└── CustomCartDrawer (dynamic)
    └── CustomCartSummary
        └── CheckoutButtonCustom      ← Button enabled when script ready
```

For detailed documentation, see:

- [integrations/README.md](src/integrations/README.md) - Full architecture guide
- [checkout-custom/README.md](src/integrations/checkout-custom/README.md) - Checkout integration details

---

## Troubleshooting

### Common Issues

1. **"useTheme must be used within ThemeProvider"**
   - Ensure `ThemeProvider` wraps your app in layout.tsx

2. **Cart not persisting**
   - Check that `CartInitializer` is rendered
   - Verify localStorage is available

3. **Translations not working**
   - Use `t:` prefix for translation keys in PageConfig
   - Ensure locale files exist in `/locales/`

4. **Analytics events not firing**
   - Check `ShopkitAnalytics` is rendered
   - Verify adapter configs have valid IDs

5. **Data source not fetching**
   - Ensure `dataSourceKey` in widget matches key in `dataSources`
   - Check commerce client is configured correctly

6. **Checkout button always disabled (isGokwikAvailable = false)**
   - Ensure `<CheckoutCustom />` is in layout.tsx (not lazy-loaded)
   - Don't use `dynamic()` for script components in button files
   - Check browser console for script loading errors
   - Verify GoKwik environment variables are set

7. **Webpack error after renaming files**
   - Clear `.next` cache: `rm -rf apps/storefront-starter/.next`
   - Restart dev server

---

## Version Compatibility

| Package               | React | Next.js | Node.js |
| --------------------- | ----- | ------- | ------- |
| All @shopkit packages | 18.x  | 14.x+   | 18.x+   |

---

---

## Related Documentation

| Document                                                                        | Description                                              |
| ------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [SYSTEM_ARCHITECTURE.md](src/SYSTEM_ARCHITECTURE.md)                            | How templates, widgets, themes, and config work together |
| [integrations/README.md](src/integrations/README.md)                            | Platform-specific integrations architecture              |
| [checkout-custom/README.md](src/integrations/checkout-custom/README.md)         | GoKwik checkout for Custom platform                      |
| [checkout-shopify/README.md](src/integrations/checkout-shopify/README.md)       | GoKwik checkout for Shopify platform                     |
| [cart-drawer-custom/README.md](src/integrations/cart-drawer-custom/README.md)   | Cart drawer for Custom platform                          |
| [cart-drawer-shopify/README.md](src/integrations/cart-drawer-shopify/README.md) | Cart drawer for Shopify platform                         |
| [kwikpass-custom/README.md](src/integrations/kwikpass-custom/README.md)         | KwikPass auth for Custom platform                        |
| [kwikpass-shopify/README.md](src/integrations/kwikpass-shopify/README.md)       | KwikPass auth for Shopify platform                       |

---

_This guide is auto-generated and maintained for AI agent consumption. For human-readable docs, see individual package README files._
