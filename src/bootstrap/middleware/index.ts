/**
 * Middleware Utilities
 *
 * Reusable utilities for Next.js middleware.
 *
 * @example
 * ```typescript
 * // src/middleware.ts
 * import { createMiddleware } from "@/bootstrap/middleware";
 * import { i18nConfig } from "@/bootstrap/i18n-config";
 *
 * export const middleware = createMiddleware({
 *   i18n: {
 *     locales: i18nConfig.locales,
 *     defaultLocale: i18nConfig.defaultLocale,
 *     cookieName: i18nConfig.localeDetection.cookieName,
 *   },
 *   abTestCookies: {
 *     home: "_prima_ptr_ab_home",
 *     collection: "_prima_ptr_ab_collection",
 *     product: "_prima_ptr_ab_product",
 *   },
 * });
 * ```
 *
 * @module bootstrap/middleware
 */

// Main factory function
export { createMiddleware } from "./create-middleware";
export type { CreateMiddlewareOptions } from "./create-middleware";

// Locale utilities
export { getLocale, setLocaleCookie } from "./locale";

// A/B testing utilities
export { getABTestCookies, handleABTestRewrites } from "./ab-testing";

// Common utilities
export { shouldSkipMiddleware } from "./utils";

// Types
export type { ABTestCookies, LocaleResult, MiddlewareConfig } from "./types";

export { defaultMiddlewareConfig } from "./types";
