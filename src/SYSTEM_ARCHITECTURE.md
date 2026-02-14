# Storefront Builder System Architecture

> Complete guide to how templates, widgets, themes, and configurations work together.

## Overview

The Storefront Builder is a modular page rendering system built with:

- **@shopkit/builder** - Core page building engine
- **Next.js App Router** - Application framework
- **Tailwind CSS** - Styling system
- **Platform Integrations** - Auth, checkout, cart drawer (Shopify/Custom)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js Page                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Page Builder                          │    │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐           │    │
│  │  │ Template  │→ │  Sections │→ │  Widgets  │           │    │
│  │  └───────────┘  └───────────┘  └───────────┘           │    │
│  │       ↓               ↓               ↓                 │    │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐           │    │
│  │  │   Data    │  │  Section  │  │  Variant  │           │    │
│  │  │  Sources  │  │  Wrapper  │  │  Renderer │           │    │
│  │  └───────────┘  └───────────┘  └───────────┘           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Key Concepts

### 1. Themes

A **theme** defines the visual identity and configuration for a storefront.

**Location:** `@/themes/{theme-name}/`

**Structure:**

```
themes/
└── dawn/                           # Theme name
    ├── theme.json                  # Theme configuration
    ├── templates/                  # Page templates
    │   ├── home/default.ts
    │   ├── products/default.ts
    │   ├── collection/default.ts
    │   └── variant-registry.ts     # Template variant mappings
    └── locales/                    # Translations
        ├── common/en.json
        └── pages/
            ├── home/en.json
            ├── products/en.json
            └── collections/en.json
```

**theme.json** - Contains design tokens:

```json
{
  "id": "dawn_default",
  "name": "Dawn Theme",
  "config": {
    "colors": {
      "primary": "#1D1D1D",
      "secondary": "#2d3748",
      "background": "#ffffff"
    },
    "typography": {
      "headingFont": "Montserrat, sans-serif",
      "bodyFont": "Open Sans, Arial, sans-serif"
    },
    "spacing": {
      "container": "96vw",
      "section-spacing": "5rem"
    }
  }
}
```

### 2. Templates

A **template** defines the structure of a page - what sections and widgets appear and in what order.

**Location:** `@/themes/{theme}/templates/{template-name}/{variant}.ts`

**Template Structure:**

```typescript
import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

export const template: PageConfig = {
  id: "dawn-home",

  // Data fetching configuration
  dataSources: {
    featuredProducts: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["bestsellers"],
        productLimit: 12,
      },
      required: true,
    },
  },

  // Page sections
  sections: [
    {
      id: "header-section",
      name: "Header",
      type: SECTION_TYPES.HEADER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.PAGE,
      },
      widgets: [
        {
          id: "header-widget",
          name: "Header",
          type: WIDGET_TYPES.Header,
          dataSourceKey: "headerData", // Links to dataSources
          settings: {
            variant: "v2", // Widget variant
            height: 65,
            // Translations use t: prefix
            navigation: "t:common.header.navigation",
          },
        },
      ],
    },
  ],
};
```

**Key Template Concepts:**

| Concept         | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `dataSources`   | Define what data to fetch (products, collections, static data) |
| `sections`      | Page layout containers (header, content, footer)               |
| `widgets`       | UI components that render within sections                      |
| `dataSourceKey` | Links a widget to its data source                              |
| `settings`      | Configuration passed to the widget                             |
| `t:` prefix     | Translation keys resolved at render time                       |

### 3. Widgets

**Widgets** are React components that render UI based on data and settings.

**Location:** `@/widgets/common/{WidgetName}/`

**Widget Structure:**

```
ProductGrid/
├── index.tsx           # Main component (variant router)
├── variants.ts         # Variant registry
├── types.ts            # TypeScript interfaces
├── V1/                 # Variant 1
│   └── index.tsx
├── V2/                 # Variant 2
│   └── index.tsx
└── common/             # Shared components
    ├── ProductCard.tsx
    └── Spinner.tsx
```

**Main Widget Component (index.tsx):**

```typescript
"use client";

import React from "react";
import { ProductGridVariants } from "./variants";
import { ProductGridProps } from "./types";

export function ProductGrid({ data, settings, className, locale }: ProductGridProps) {
  // Get variant from settings (default to v1)
  const variant = settings.variant || "v1";
  const VariantComponent = ProductGridVariants[variant as keyof typeof ProductGridVariants];

  if (!VariantComponent) {
    console.warn(`ProductGrid variant "${variant}" not found, using default`);
    const DefaultComponent = ProductGridVariants.default;
    return <DefaultComponent data={data} settings={settings} className={className} locale={locale} />;
  }

  return <VariantComponent data={data} settings={settings} className={className} locale={locale} />;
}
```

**Variant Registry (variants.ts):**

```typescript
import { V1 } from "./V1";
import { V2 } from "./V2";

export const ProductGridVariants = {
  v1: V1,
  v2: V2,
  default: V1, // fallback
};

export type ProductGridVariantType = keyof typeof ProductGridVariants;
```

**Widget Props Interface:**

```typescript
export interface ProductGridProps {
  data: any; // Data from dataSource
  settings: {
    // Settings from template
    variant?: string;
    heading?: string;
    showRating?: boolean;
    // ... other settings
  };
  className?: string;
  locale?: string;
}
```

### 4. Widget Registration

Widgets are auto-registered via a generated manifest.

**Auto-generation:** Run `bun run generate:widgets`

**Manifest Location:** `@/widgets/.generated/manifest.ts`

```typescript
// AUTO-GENERATED - DO NOT EDIT
import { ProductGrid } from "../common/ProductGrid";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
// ...

export const WIDGET_MANIFEST: WidgetRegistration[] = [
  { type: "ProductGrid", component: ProductGrid },
  { type: "Header", component: Header },
  { type: "Footer", component: Footer },
  // ...
];
```

**Type-safe Widget References:** `@/widgets/.generated/types.ts`

```typescript
export const WIDGET_TYPES = {
  ProductGrid: "ProductGrid",
  Header: "Header",
  Footer: "Footer",
  // ...
} as const;
```

### 5. Sections & Layout

**Sections** are containers that wrap widgets and handle layout.

**Section Types:**

```typescript
SECTION_TYPES.HEADER_SECTION; // Special handling for sticky headers
SECTION_TYPES.CONTENT_SECTION; // General content
SECTION_TYPES.FOOTER_SECTION; // Page footer
```

**Layout Options:**

```typescript
SECTION_LAYOUT_OPTIONS.FULL; // Full width (edge to edge)
SECTION_LAYOUT_OPTIONS.PAGE; // Constrained to max-width container
```

**Responsive Settings:**

```typescript
{
  settings: {
    layout: SECTION_LAYOUT_OPTIONS.FULL,
    responsive: {
      mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
      tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
      desktop: { padding: { top: 94, right: 0, bottom: 0, left: 0 } },
    },
  },
}
```

### 6. Translations (i18n)

Translations are resolved using the `t:` prefix in template settings.

**Translation Key Format:** `t:{namespace}.{path}`

**Example:**

```typescript
// In template
settings: {
  heading: "t:dawn_home_default.featured_collection.heading__rich",
}

// In locales/pages/home/en.json
{
  "dawn_home_default": {
    "featured_collection": {
      "heading__rich": "<span>Best</span> <strong>Sellers</strong>"
    }
  }
}
```

**Rich Text Convention:** Keys ending with `__rich` can contain HTML.

### 7. Data Sources

**Data Source Types:**

```typescript
DATA_SOURCE_TYPES.STATIC; // Static/hardcoded data
DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES; // Fetch collections by handle
DATA_SOURCE_TYPES.PRODUCT_BY_HANDLE; // Fetch product by handle
DATA_SOURCE_TYPES.PRODUCTS; // Fetch products list
```

**Example:**

```typescript
dataSources: {
  // Static data (no API call)
  headerData: {
    type: DATA_SOURCE_TYPES.STATIC,
    params: {
      brandName: "Dawn",
      homePageUrl: "/",
    },
    required: true,
  },

  // Dynamic data (API call)
  featuredProducts: {
    type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
    params: {
      handles: ["bestsellers", "new-arrivals"],
      productLimit: 12,
    },
    required: true,
  },
}
```

## Page Rendering Flow

```
1. Next.js Page (app/page.tsx)
   │
   ├── Get theme name and locale
   ├── Create route context (templateName, path, params)
   ├── Load translations
   │
   └── Call pageBuilder.renderPage()
       │
       ├── Load template (home/default.ts)
       ├── Resolve all dataSources (fetch products, etc.)
       ├── For each section:
       │   ├── Create SectionWrapper
       │   └── For each widget:
       │       ├── Get widget component from manifest
       │       ├── Resolve translations (t: keys)
       │       ├── Pass data + settings
       │       └── Render widget variant
       │
       └── Return React elements
```

**Page Component Example:**

```typescript
// app/page.tsx
export default async function HomePage() {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/",
    params: {},
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  const pageBuilder = getPageBuilder();
  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
  });

  return <>{pageContent}</>;
}
```

## Bootstrap Configuration

The page builder is configured in `@/bootstrap/builder.ts`:

```typescript
// This file wires together app-specific implementations
// with the @shopkit/builder package interfaces

import { WIDGET_MANIFEST } from "@/widgets/.generated/manifest";
import { getCommerceClient } from "@/config/commerce";
import { SectionWrapper } from "@/ui/layout/SectionWrapper";

const pageBuilderOptions = {
  widgets: WIDGET_MANIFEST, // App's widget registry
  commerceClient: getCommerceClient(), // Data fetching client
  themeLoader, // Loads theme.json
  templateLoader, // Loads templates
  sectionRenderer, // SectionWrapper component
  defaultLocale: "en",
};

export function getPageBuilder(): PageBuilder {
  return getPageBuilderCore(pageBuilderOptions);
}
```

## Creating New Widgets

### Step 1: Create Widget Folder

```
widgets/common/MyWidget/
├── index.tsx
├── variants.ts
├── types.ts
└── V1/
    └── index.tsx
```

### Step 2: Define Types

```typescript
// types.ts
export interface MyWidgetProps {
  data: {
    items: any[];
  };
  settings: {
    variant?: string;
    heading?: string;
    showMore?: boolean;
  };
  className?: string;
  locale?: string;
}
```

### Step 3: Create Main Component

```typescript
// index.tsx
"use client";

import React from "react";
import { MyWidgetVariants } from "./variants";
import { MyWidgetProps } from "./types";

export function MyWidget({ data, settings, className, locale }: MyWidgetProps) {
  const variant = settings.variant || "v1";
  const VariantComponent = MyWidgetVariants[variant as keyof typeof MyWidgetVariants];

  if (!VariantComponent) {
    const DefaultComponent = MyWidgetVariants.default;
    return <DefaultComponent data={data} settings={settings} className={className} locale={locale} />;
  }

  return <VariantComponent data={data} settings={settings} className={className} locale={locale} />;
}
```

### Step 4: Create Variant

```typescript
// V1/index.tsx
"use client";

import React from "react";
import { MyWidgetProps } from "../types";

export function V1({ data, settings, className }: MyWidgetProps) {
  return (
    <div className={className}>
      <h2>{settings.heading}</h2>
      {data.items.map((item, index) => (
        <div key={index}>{item.title}</div>
      ))}
    </div>
  );
}
```

### Step 5: Register Variants

```typescript
// variants.ts
import { V1 } from "./V1";

export const MyWidgetVariants = {
  v1: V1,
  default: V1,
};
```

### Step 6: Regenerate Manifest

```bash
bun run generate:widgets
```

### Step 7: Use in Template

```typescript
// templates/home/default.ts
{
  id: "my-widget-section",
  type: SECTION_TYPES.CONTENT_SECTION,
  widgets: [
    {
      id: "my-widget",
      type: WIDGET_TYPES.MyWidget,
      dataSourceKey: "myData",
      settings: {
        variant: "v1",
        heading: "t:common.my_widget.heading",
      },
    },
  ],
}
```

## Creating New Templates

### Step 1: Create Template File

```typescript
// themes/dawn/templates/my-page/default.ts
import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, DATA_SOURCE_TYPES } from "@shopkit/builder";

export const template: PageConfig = {
  id: "my-page",
  dataSources: {
    pageData: {
      type: DATA_SOURCE_TYPES.STATIC,
      params: { title: "My Page" },
      required: true,
    },
  },
  sections: [
    // ... sections and widgets
  ],
};
```

### Step 2: Register in Variant Registry (Optional)

```typescript
// templates/variant-registry.ts
export const variantMap = {
  "my-page": {
    default: "default",
    // Add more variants as needed
  },
};
```

### Step 3: Create Next.js Page

```typescript
// app/my-page/page.tsx
export default async function MyPage() {
  const routeContext = {
    templateName: "my-page",
    path: "/my-page",
    params: {},
  };

  // ... same pattern as HomePage
}
```

## File Organization Summary

```
apps/starter/src/
├── app/                          # Next.js pages
│   ├── page.tsx                  # Home page
│   ├── products/[handle]/        # Product pages
│   └── collections/[name]/       # Collection pages
│
├── bootstrap/                    # Core setup
│   ├── builder.ts                # Page builder configuration
│   └── i18n.ts                   # Internationalization
│
├── themes/                       # Theme configurations
│   └── dawn/
│       ├── theme.json            # Design tokens
│       ├── templates/            # Page templates
│       └── locales/              # Translations
│
├── widgets/                      # UI widgets
│   ├── common/                   # Shared widgets
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── ProductGrid/
│   │   └── ...
│   └── .generated/               # Auto-generated files
│       ├── manifest.ts
│       └── types.ts
│
├── integrations/                 # Platform integrations
│   ├── checkout-shopify/
│   ├── checkout-custom/
│   ├── cart-drawer-shopify/
│   ├── cart-drawer-custom/
│   ├── kwikpass-shopify/
│   └── kwikpass-custom/
│
├── ui/                           # UI primitives
│   ├── atomic/                   # Base components
│   └── layout/                   # Layout components
│       └── SectionWrapper.tsx
│
└── config/                       # App configuration
    └── commerce/                 # Commerce client setup
```

## Quick Start: Create a New Page

### Checklist for AI Agents

To create a new page (e.g., `/about`), follow these steps:

#### Step 1: Create Template File

```bash
# Create: themes/dawn/templates/about/default.ts
```

```typescript
import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

export const template: PageConfig = {
  id: "about-page",
  dataSources: {
    // Add data sources if needed
  },
  sections: [
    // Header (copy from home/default.ts)
    {
      id: "header-section",
      name: "Header",
      type: SECTION_TYPES.HEADER_SECTION,
      settings: { layout: SECTION_LAYOUT_OPTIONS.PAGE },
      widgets: [
        {
          id: "header-widget",
          type: WIDGET_TYPES.Header,
          dataSourceKey: "headerData",
          settings: { variant: "v2" /* ... */ },
        },
      ],
    },
    // Your content sections here
    {
      id: "content-section",
      name: "About Content",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: { layout: SECTION_LAYOUT_OPTIONS.PAGE },
      widgets: [
        // Add widgets
      ],
    },
    // Footer (copy from home/default.ts)
    {
      id: "footer-section",
      name: "Footer",
      type: SECTION_TYPES.FOOTER_SECTION,
      settings: { layout: SECTION_LAYOUT_OPTIONS.FULL },
      widgets: [
        {
          id: "footer-widget",
          type: WIDGET_TYPES.Footer,
          settings: { variant: "v1" /* ... */ },
        },
      ],
    },
  ],
};
```

#### Step 2: Create Next.js Page

```bash
# Create: app/about/page.tsx
```

```typescript
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { getMerchantName, getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";

export default async function AboutPage() {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: "about",  // Must match template folder name
    path: "/about",
    params: {},
    query: {},
    fetchAPITemplate: true,
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  const pageBuilder = getPageBuilder();
  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
  });

  return <>{pageContent}</>;
}
```

#### Step 3: Add Translations (Optional)

```bash
# Create: themes/dawn/locales/pages/about/en.json
```

```json
{
  "about_page": {
    "title": "About Us",
    "description": "Learn more about our company"
  }
}
```

#### Step 4: Update Template Types (Optional)

```bash
# Run: bun run generate:templates
```

### Common Patterns to Copy

| Need            | Copy From                                   |
| --------------- | ------------------------------------------- |
| Header section  | `templates/home/default.ts` lines 186-225   |
| Footer section  | `templates/home/default.ts` lines 1044-1091 |
| Product grid    | `templates/home/default.ts` lines 313-376   |
| Banner carousel | `templates/home/default.ts` lines 227-252   |

### Available Widget Types

Reference: `@/widgets/.generated/types.ts`

```typescript
WIDGET_TYPES.Header;
WIDGET_TYPES.Footer;
WIDGET_TYPES.ProductGrid;
WIDGET_TYPES.BannerCarousel;
WIDGET_TYPES.AnnouncementBar;
WIDGET_TYPES.ShopByCategory;
WIDGET_TYPES.ShopByConcerns;
WIDGET_TYPES.Testimonials;
WIDGET_TYPES.FAQ;
WIDGET_TYPES.ProductGallery;
WIDGET_TYPES.ProductInfo;
WIDGET_TYPES.CollectionWidget;
// ... see manifest.ts for full list
```

### Available Data Source Types

```typescript
DATA_SOURCE_TYPES.STATIC; // Hardcoded data
DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES; // Fetch collections
DATA_SOURCE_TYPES.PRODUCT_BY_HANDLE; // Fetch single product
DATA_SOURCE_TYPES.PRODUCTS; // Fetch product list
```

---

## CLI Commands (@shopkit/cli)

The CLI provides commands for generating, validating, and managing widgets, templates, and more.

### Generator Commands

| Command                      | Description              | Usage                                |
| ---------------------------- | ------------------------ | ------------------------------------ |
| `bun run generate`           | Run all generators       | Runs widgets + templates + i18n      |
| `bun run generate:widgets`   | Generate widget registry | Creates `manifest.ts` and `types.ts` |
| `bun run generate:templates` | Generate template types  | Creates template type definitions    |
| `bun run generate:i18n`      | Generate i18n manifest   | Creates translation manifests        |

### Scaffold Commands (Create New)

| Command                     | Description         | Example                        |
| --------------------------- | ------------------- | ------------------------------ |
| `bun run g widget <name>`   | Create new widget   | `bun run g widget ProductCard` |
| `bun run g template <name>` | Create new template | `bun run g template about`     |
| `bun run g theme <name>`    | Create new theme    | `bun run g theme custom`       |

**Shorthand:**

```bash
bun run g widget MyWidget      # Same as: shopkit g widget MyWidget
bun run g:widget MyWidget      # Alternative syntax
```

### Watch Commands (Development)

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `bun run watch:widgets` | Watch widgets folder, auto-regenerate manifest |
| `bun run watch:locales` | Watch locales folder, auto-regenerate i18n     |
| `bun run dev:watch`     | Run dev server with all watchers               |

### Validation Commands

| Command                     | Description                      |
| --------------------------- | -------------------------------- |
| `bun run validate:widget`   | Validate widget structure        |
| `bun run validate:template` | Validate template structure      |
| `bun run validate:route`    | Validate route static generation |
| `bun run validate:assets`   | Validate asset sizes             |

### Performance Commands

| Command                  | Description                               |
| ------------------------ | ----------------------------------------- |
| `bun run perf:score`     | Score widgets (0-100 based on ESLint)     |
| `bun run perf:score:all` | Score all widgets (not just staged)       |
| `bun run perf:critical`  | Check critical widgets aren't lazy-loaded |
| `bun run perf:audit`     | Audit third-party scripts                 |
| `bun run perf:rules`     | List all performance rules                |
| `bun run perf:check`     | Run all perf validations + lint + score   |

### Common Workflows

**After creating a new widget:**

```bash
# 1. Create widget folder and files
bun run g widget MyNewWidget

# 2. Implement the widget in src/widgets/common/MyNewWidget/

# 3. Regenerate manifest
bun run generate:widgets

# 4. Use in template with WIDGET_TYPES.MyNewWidget
```

**After modifying translations:**

```bash
# Regenerate i18n manifest
bun run generate:i18n
```

**Before committing:**

```bash
# Run all validations
bun run perf:check
```

**Development with auto-reload:**

```bash
# Watches widgets and locales, auto-regenerates
bun run dev:watch
```

---

## Commerce & Cart Flow

This section explains how data fetching, cart management, and checkout work together.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMMERCE FLOW                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   Data Layer │ →  │    Cart      │ →  │   Checkout   │              │
│  │  @shopkit/   │    │  @shopkit/   │    │  GoKwik SDK  │              │
│  │  data-layer  │    │    cart      │    │              │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│         ↓                   ↓                   ↓                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   Products   │    │  Cart State  │    │   Payment    │              │
│  │  Collections │    │  (Zustand)   │    │   Gateway    │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1. Data Layer (@shopkit/data-layer)

The data layer fetches products and collections from your commerce backend.

**Configuration:** `@/config/commerce/index.ts`

```typescript
import { createCommerceClient } from "@shopkit/data-layer";

// For Shopify
export const commerceClient = createCommerceClient({
  type: "shopify",
  config: {
    domain: process.env.SHOPIFY_STORE_DOMAIN,
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    apiVersion: "2024-01",
  },
});

// For Custom backend
export const commerceClient = createCommerceClient({
  type: "custom",
  config: {
    baseUrl: process.env.CUSTOM_API_URL,
    apiKey: process.env.CUSTOM_API_KEY,
  },
});
```

**How Templates Use Data:**

```typescript
// In template (home/default.ts)
dataSources: {
  featuredProducts: {
    type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
    params: {
      handles: ["bestsellers"],
      productLimit: 12,
    },
    required: true,
  },
}

// Widget receives data via dataSourceKey
widgets: [
  {
    id: "product-grid",
    type: WIDGET_TYPES.ProductGrid,
    dataSourceKey: "featuredProducts",  // ← Links to data source
    settings: { variant: "v1" },
  },
]
```

**Data Flow:**

```
Template dataSources → Page Builder → Commerce Client → API → Widget data prop
```

### 2. Cart State Management (@shopkit/cart)

The cart uses Zustand for state management with localStorage persistence.

**Cart Store Location:** `@shopkit/cart` (configured in `@/bootstrap/cart.ts`)

**Key Exports:**

```typescript
import {
  useCartStore, // Full store access
  useCart, // Add item hook
  useCartItems, // Get cart items
  useCartCount, // Get item count
  useCartTotal, // Get total price
  useIsInCart, // Check if product is in cart
} from "@shopkit/cart";
```

**Add to Cart Flow:**

```typescript
// In ProductCard or ProductInfo widget
import { useCart } from "@shopkit/cart";
import { publishEvent, EventType } from "@shopkit/analytics";

function AddToCartButton({ product, variant }) {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async () => {
    // 1. Add to cart state
    await addToCart({
      variantId: variant.id,
      quantity: 1,
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        image: product.featuredImage,
        price: variant.price,
      },
    });

    // 2. Track analytics event
    publishEvent({
      type: EventType.ADD_TO_CART,
      productId: product.id,
      productName: product.title,
      price: parseFloat(variant.price.amount),
      currency: variant.price.currencyCode,
      quantity: 1,
    });

    // 3. Optionally open cart drawer
    useCartStore.getState().openCart();
  };

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

**Cart Store State:**

```typescript
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  cartToken: string | null;

  // Actions
  addItem: (item: CartItemInput) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}
```

### 3. Cart Drawer Integration

The cart drawer displays cart contents and provides checkout access.

**Platform-specific implementations:**

- `integrations/cart-drawer-shopify/` - For Shopify stores
- `integrations/cart-drawer-custom/` - For custom backends

**Component Hierarchy:**

```
CustomCartDrawer (or ShopifyCartDrawer)
├── LoadingSpinner
├── Overlay (click to close)
└── Drawer Panel
    ├── Header (title + close button)
    ├── Content
    │   ├── CouponOffersComponent
    │   └── CartItem[] (for each item)
    │       ├── Product image
    │       ├── Title, variant
    │       ├── Quantity controls (+/-)
    │       ├── Remove button
    │       └── Price
    └── Footer
        └── CartSummary
            ├── Subtotal
            └── CheckoutButton
```

**Using Cart Drawer in Layout:**

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
    <AppShell config={...}>
      {children}
      <CustomCartDrawer locale="en" />
    </AppShell>
  );
}
```

### 4. Checkout Integration (GoKwik)

Checkout is handled by the GoKwik SDK via platform-specific integrations.

**Platform-specific implementations:**

- `integrations/checkout-shopify/` - For Shopify stores
- `integrations/checkout-custom/` - For custom backends

**CRITICAL: Script Loading Order**

The checkout script MUST load in the layout BEFORE the cart drawer:

```typescript
// app/layout.tsx - CORRECT ORDER
<AppShell>
  <CheckoutCustom />        {/* 1. Script loads here FIRST */}
  {children}
  <CustomCartDrawer />      {/* 2. Button uses script */}
</AppShell>
```

**Checkout Button Flow:**

```typescript
// In CartSummary component
import { CheckoutButtonCustom } from "@/integrations/checkout-custom";

function CartSummary() {
  return (
    <div>
      <div>Subtotal: {formatPrice(total)}</div>
      <CheckoutButtonCustom
        onCheckoutStart={() => console.log("Starting checkout")}
        onCheckoutSuccess={(order) => {
          // Clear cart, redirect to thank you page
          useCartStore.getState().clearCart();
          router.push(`/order-confirmation/${order.id}`);
        }}
        onCheckoutError={(error) => {
          console.error("Checkout failed:", error);
        }}
      >
        Proceed to Checkout
      </CheckoutButtonCustom>
    </div>
  );
}
```

**Checkout Service Flow:**

```
1. User clicks Checkout button
   ↓
2. CheckoutButtonCustom calls useCustomCheckout hook
   ↓
3. Hook checks if GoKwik SDK is available (isGokwikAvailable)
   ↓
4. If available, calls CustomCheckoutService.initializeCheckout()
   ↓
5. Service prepares cart data and calls window.triggerGokwikCheckout()
   ↓
6. GoKwik SDK opens checkout modal
   ↓
7. User completes payment
   ↓
8. SDK fires success/error callback
   ↓
9. App clears cart and redirects
```

### 5. Complete E-Commerce Flow Example

```
┌─────────────────────────────────────────────────────────────────────────┐
│ USER JOURNEY                                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. BROWSE PRODUCTS                                                      │
│     ┌────────────┐                                                       │
│     │ Home Page  │ → Template loads → dataSources fetch products        │
│     │ /products  │ → ProductGrid widget renders                         │
│     └────────────┘                                                       │
│           ↓                                                              │
│  2. VIEW PRODUCT                                                         │
│     ┌────────────┐                                                       │
│     │ PDP        │ → Template loads → PRODUCT_BY_HANDLE fetches        │
│     │ /products/ │ → ProductGalleryWithInfo widget renders             │
│     │  [handle]  │ → BuyNow button available                           │
│     └────────────┘                                                       │
│           ↓                                                              │
│  3. ADD TO CART                                                          │
│     ┌────────────┐                                                       │
│     │ Add Button │ → useCart() called                             │
│     │  clicked   │ → Cart state updated (Zustand)                      │
│     └────────────┘ → Analytics event fired                              │
│           ↓        → Cart drawer opens (optional)                       │
│                                                                          │
│  4. VIEW CART                                                            │
│     ┌────────────┐                                                       │
│     │ Cart       │ → useCartStore reads state                          │
│     │ Drawer     │ → CartItem components render                        │
│     └────────────┘ → Quantity can be adjusted                           │
│           ↓                                                              │
│  5. CHECKOUT                                                             │
│     ┌────────────┐                                                       │
│     │ Checkout   │ → CheckoutButtonCustom clicked                      │
│     │ Button     │ → GoKwik SDK triggered                              │
│     └────────────┘ → Payment modal opens                                │
│           ↓                                                              │
│  6. PAYMENT                                                              │
│     ┌────────────┐                                                       │
│     │ GoKwik     │ → User enters payment details                       │
│     │ Modal      │ → Payment processed                                 │
│     └────────────┘ → Success/Error callback fired                       │
│           ↓                                                              │
│  7. ORDER COMPLETE                                                       │
│     ┌────────────┐                                                       │
│     │ Thank You  │ → Cart cleared                                       │
│     │ Page       │ → Analytics purchase event                          │
│     └────────────┘ → Order confirmation displayed                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6. Key Files Reference

| Purpose                | File Location                                |
| ---------------------- | -------------------------------------------- |
| Commerce client config | `@/config/commerce/index.ts`                 |
| Cart bootstrap         | `@/bootstrap/cart.ts`                        |
| Cart drawer (Custom)   | `@/integrations/cart-drawer-custom/`         |
| Cart drawer (Shopify)  | `@/integrations/cart-drawer-shopify/`        |
| Checkout (Custom)      | `@/integrations/checkout-custom/`            |
| Checkout (Shopify)     | `@/integrations/checkout-shopify/`           |
| Add to cart in widget  | Use `useCart` from `@shopkit/cart`           |
| Analytics events       | Use `publishEvent` from `@shopkit/analytics` |

### 7. Common Patterns

**Add to Cart in a Widget:**

```typescript
import { useCart, useCartStore } from "@shopkit/cart";

const { addToCart, isLoading } = useCart();

// Add item
await addToCart({ variantId, quantity: 1, product: {...} });

// Open cart drawer after adding
useCartStore.getState().openCart();
```

**Check Cart State:**

```typescript
import { useCartItems, useCartTotal, useCartCount } from "@shopkit/cart";

const items = useCartItems(); // CartItem[]
const total = useCartTotal(); // number
const count = useCartCount(); // number
```

**Update Quantity:**

```typescript
import { useCartStore } from "@shopkit/cart";

const { updateQuantity, removeItem } = useCartStore();

// Update quantity
await updateQuantity(variantId, newQuantity);

// Remove item
await removeItem(variantId);
```

---

## Related Documentation

- [Integrations README](./integrations/README.md) - Platform-specific integrations
- [AGENTS.md](../AGENTS.md) - Developer guide for AI agents
