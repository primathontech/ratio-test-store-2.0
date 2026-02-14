# Bootstrap - Package Configurations

> Composition roots for @shopkit package configurations.

## Overview

The `bootstrap/` folder centralizes all @shopkit package setup and configuration. These files act as "composition roots" - the single place where packages are configured for this specific app.

**Why separate from `lib/`?**

- Package configuration is distinct from app-specific business logic
- Makes it clear which files configure external packages
- Easier to find and update package settings
- Prevents configuration from being scattered across the codebase

## Files

| File                   | Package            | Purpose                                                       |
| ---------------------- | ------------------ | ------------------------------------------------------------- |
| `builder.ts`           | `@shopkit/builder` | Theme/template loaders, widget registry, page builder factory |
| `cart.ts`              | `@shopkit/cart`    | Cart services, storage, currency config, `AppCartInitializer` |
| `i18n.ts`              | `@shopkit/i18n`    | Server-side i18n utilities (`getLocale`, `loadMessages`)      |
| `i18n-config.ts`       | `@shopkit/i18n`    | Client-safe i18n config (locales, default locale)             |
| `i18n-request.ts`      | `next-intl`        | next-intl request configuration                               |
| `theme.ts`             | `@shopkit/core`    | Theme loading utility (`getTheme`)                            |
| `next-config.js`       | `next`             | Next.js config factory (`createNextConfig`)                   |
| `next-config.types.ts` | `next`             | TypeScript types for next-config                              |
| `middleware/`          | `next`             | Middleware factory (`createMiddleware`)                       |
| `index.ts`             | N/A                | Barrel exports                                                |

## Usage

```typescript
// ✅ CORRECT: Import from bootstrap/
import { getPageBuilder } from "@/bootstrap/builder";
import { AppCartInitializer } from "@/bootstrap/cart";
import { getLocale, loadMessages } from "@/bootstrap/i18n";
import { i18nConfig } from "@/bootstrap/i18n-config";
import { getTheme } from "@/bootstrap/theme";
import { createMiddleware } from "@/bootstrap/middleware";

// ❌ WRONG: Old lib/ paths no longer exist
// import { getPageBuilder } from "@/lib/builder-setup";  // DELETED
// import { AppCartInitializer } from "@/lib/cart-setup"; // DELETED
```

## File Details

### `builder.ts` - Page Builder Configuration

Configures `@shopkit/builder` with:

- Widget manifest from generated files
- Theme loader (reads from theme JSON files)
- Template loader (reads page configs from JSON)
- Commerce client integration

```typescript
import { getPageBuilder } from "@/bootstrap/builder";

// In page components
const pageBuilder = getPageBuilder();
const content = await pageBuilder.renderPage({
  merchantName,
  routeContext,
  locale,
  messages,
});
```

### `cart.ts` - Cart Configuration

Configures `@shopkit/cart` with:

- Cart service (API integration)
- Cart storage (localStorage persistence)
- Default currency code
- `AppCartInitializer` component for layout

```typescript
import { AppCartInitializer } from "@/bootstrap/cart";

// In AppShell or layout
<AppCartInitializer merchantName={merchantName} />
```

### `i18n.ts` - Server-side i18n

Server-side utilities for `@shopkit/i18n`:

- `getLocale()` - Get current locale
- `getStaticLocale()` - Get static locale for build
- `loadMessages()` - Load translation messages

```typescript
import { getStaticLocale } from "@/bootstrap/i18n";
import { getMessages } from "next-intl/server";

// In server components
const locale = getStaticLocale();
const messages = await getMessages();
```

### `i18n-config.ts` - Client-safe i18n Config

Static configuration that can be imported in client components:

- Supported locales
- Default locale
- Locale names

```typescript
import { i18nConfig } from "@/bootstrap/i18n-config";

// Can be used in client or server
const { locales, defaultLocale } = i18nConfig;
```

### `theme.ts` - Theme Loading

Theme loading utility for `@shopkit/core`:

```typescript
import { getTheme } from "@/bootstrap/theme";

// In layout.tsx
const theme = await getTheme(merchantName);
```

### `next-config.ts` - Next.js Configuration

Factory function for creating Next.js configuration with sensible defaults:

```javascript
// next.config.js
const { createNextConfig } = require("./src/bootstrap/next-config");

module.exports = createNextConfig({
  i18nPath: "./src/i18n.ts",
  images: {
    additionalRemotePatterns: [
      { protocol: "https", hostname: "mycdn.com", pathname: "/**" },
    ],
  },
  redirects: [{ source: "/old", destination: "/new", permanent: true }],
});
```

**Default configurations included:**

- Shopify CDN image patterns (`cdn.shopify.com`, `**.shopifycdn.com`)
- Image optimization (webp/avif, 1yr cache, device sizes)
- Static asset cache headers (`/_next/static`, `/images`, `/fonts`, `/assets`)
- Dynamic content headers (products, collections with SWR)
- API route headers
- ESLint/TypeScript build settings
- Production console removal

**App-specific options:**

- `i18nPath` - Path to next-intl config (default: `"./src/bootstrap/i18n-request.ts"`, set to `false` to disable)
- `images.additionalRemotePatterns` - Custom image domains
- `cache.additionalStaticPaths` - Custom static paths
- `redirects` - App-specific redirects
- `extend` - Escape hatch for advanced customization

### `middleware/` - Request Middleware

Factory function for creating Next.js middleware with sensible defaults:

```typescript
// src/middleware.ts
import { createMiddleware } from "@/bootstrap/middleware";
import { i18nConfig } from "@/bootstrap/i18n-config";

const baseMiddleware = createMiddleware({
  i18n: {
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
    cookieName: i18nConfig.localeDetection.cookieName,
  },
  abTestCookies: {
    home: "_prima_ptr_ab_home",
    collection: "_prima_ptr_ab_collection",
    product: "_prima_ptr_ab_product",
  },
});

export function middleware(request: NextRequest) {
  // Custom logic before
  const response = baseMiddleware(request);
  // Custom logic after
  return response;
}
```

**Core functionality:**

- Locale detection from cookies/headers
- Locale cookie management
- A/B test rewrites (home, product, collection variants)
- Skip paths for static files and API routes

## AI Agent Guidelines

**When to modify bootstrap files:**

- Changing how a package is configured (e.g., different cart storage strategy)
- Adding new package configurations
- Updating package initialization options

**When NOT to modify bootstrap files:**

- Adding app-specific business logic (use `lib/` instead)
- Creating new components (use `app-shell/` or `widgets/`)
- Adding utility functions (use `lib/utils/` or `lib/hooks/`)

## Directory Structure

```
src/
├── bootstrap/                  # @shopkit package configurations
│   ├── README.md              # This file
│   ├── index.ts               # Barrel exports
│   ├── builder.ts             # @shopkit/builder configuration
│   ├── cart.ts                # @shopkit/cart configuration
│   ├── i18n.ts                # @shopkit/i18n server utilities
│   ├── i18n-config.ts         # @shopkit/i18n static config
│   ├── i18n-request.ts        # next-intl request configuration
│   ├── theme.ts               # @shopkit/core theme loading
│   ├── next-config.js         # Next.js config factory (CommonJS)
│   ├── next-config.types.ts   # TypeScript types for next-config
│   └── middleware/            # Request middleware factory
│       ├── index.ts           # Barrel exports
│       ├── create-middleware.ts # Main factory function
│       ├── locale.ts          # Locale detection utilities
│       ├── ab-testing.ts      # A/B test rewrite utilities
│       ├── utils.ts           # Common utilities
│       └── types.ts           # Type definitions
│
├── app-shell/                  # App-level shell/wrapper components
│   └── ...
│
├── lib/                        # App-specific code
│   └── ...
```

## Relationship to Other Folders

| Folder       | Purpose                | Imports From                       |
| ------------ | ---------------------- | ---------------------------------- |
| `bootstrap/` | Package configuration  | `@shopkit/*` packages              |
| `app-shell/` | App wrapper components | `bootstrap/`, `@shopkit/*`         |
| `lib/`       | App-specific code      | `bootstrap/`, `@shopkit/*`         |
| `app/`       | Next.js pages          | `bootstrap/`, `app-shell/`, `lib/` |
