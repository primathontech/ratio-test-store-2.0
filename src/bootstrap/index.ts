/**
 * Bootstrap Module - @shopkit Package Configuration
 *
 * This module centralizes all @shopkit package configurations for this application.
 * It serves as the composition root that wires together package interfaces
 * with app-specific implementations.
 *
 * ## What is Bootstrap?
 *
 * Each @shopkit package requires configuration with app-specific implementations:
 * - Where are themes stored? → `bootstrap/builder.ts`
 * - How is the cart stored? → `bootstrap/cart.ts`
 * - What locales are supported? → `bootstrap/i18n.ts`
 *
 * ## Usage
 *
 * ```typescript
 * // Import specific bootstrap modules
 * import { getPageBuilder } from "@/bootstrap/builder";
 * import { AppCartInitializer } from "@/bootstrap/cart";
 * import { getLocale, loadMessages } from "@/bootstrap/i18n";
 * import { i18nConfig } from "@/bootstrap/i18n-config";
 * ```
 *
 * ## Server vs Client
 *
 * - `bootstrap/cart.ts` - Client-side ("use client")
 * - `bootstrap/builder.ts` - Server-side (default)
 * - `bootstrap/i18n.ts` - Server-side only (imports next/headers)
 * - `bootstrap/i18n-config.ts` - Client-safe (no server imports)
 *
 * @module bootstrap
 */

// =============================================================================
// BUILDER (Server-Side)
// =============================================================================

export { getPageBuilder, resetPageBuilder } from "./builder";

// =============================================================================
// CART (Client-Side)
// =============================================================================

export { AppCartInitializer } from "./cart";

// =============================================================================
// I18N - CONFIG (Client-Safe)
// =============================================================================

export {
  i18nConfig,
  isValidLocale,
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_NAMES,
} from "./i18n-config";
export type { Locale, PageName } from "./i18n-config";

// =============================================================================
// I18N - SERVER UTILITIES
// =============================================================================
// Note: These are server-only exports. Import directly from "@/bootstrap/i18n"
// in server components to avoid bundling server code in client bundles.
//
// Server imports:
//   import { getLocale, getStaticLocale, setLocaleCookie, loadMessages } from "@/bootstrap/i18n";

// =============================================================================
// THEME (Server-Side)
// =============================================================================

export { getTheme, configureAppTheme } from "./theme";
export type { Theme } from "./theme";

// =============================================================================
// NEXT.JS CONFIG (Build-Time)
// =============================================================================
// Note: This is for use in next.config.js only.
// Import directly: const { createNextConfig } = require("./src/bootstrap/next-config");
//
// The implementation is in next-config.js (CommonJS for next.config.js compatibility).
// Types are in next-config.types.ts for TypeScript users.

export type {
  CreateNextConfigOptions,
  RemotePattern,
  CacheHeader,
  Redirect,
  ImageConfig,
  CacheConfig,
} from "./next-config.types";

// =============================================================================
// MIDDLEWARE (Request-Time)
// =============================================================================
// Note: For full middleware utilities, import from "@/bootstrap/middleware".
//
// import { createMiddleware } from "@/bootstrap/middleware";

export { createMiddleware } from "./middleware";
export type {
  CreateMiddlewareOptions,
  ABTestCookies,
  LocaleResult,
  MiddlewareConfig,
} from "./middleware";
