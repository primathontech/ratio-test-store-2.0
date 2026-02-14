/**
 * Create Middleware
 *
 * Factory function to create a configured Next.js middleware.
 * Supports custom handlers for extensibility.
 *
 * @module bootstrap/middleware
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getLocale, setLocaleCookie } from "./locale";
import { getABTestCookies, handleABTestRewrites } from "./ab-testing";
import { shouldSkipMiddleware } from "./utils";

/**
 * Middleware configuration options
 */
export interface CreateMiddlewareOptions {
  /** i18n configuration */
  i18n: {
    locales: readonly string[];
    defaultLocale: string;
    cookieName: string;
  };
  /** A/B test cookie names */
  abTestCookies: {
    home: string;
    collection: string;
    product: string;
  };
}

/**
 * Create a configured middleware function
 *
 * Handles core logic: locale detection and A/B testing.
 * For custom logic, extend directly in middleware.ts file.
 *
 * @example
 * ```typescript
 * // Basic usage
 * export const middleware = createMiddleware({
 *   i18n: { ... },
 *   abTestCookies: { ... },
 * });
 *
 * // With custom logic - extend in middleware.ts
 * const baseMiddleware = createMiddleware({ ... });
 *
 * export function middleware(request: NextRequest) {
 *   // Custom logic before
 *   if (request.nextUrl.pathname === "/old-path") {
 *     return NextResponse.redirect(new URL("/new-path", request.url));
 *   }
 *
 *   // Run core middleware
 *   const response = baseMiddleware(request);
 *
 *   // Custom logic after
 *   response.headers.set("x-custom", "value");
 *
 *   return response;
 * }
 * ```
 */
export function createMiddleware(options: CreateMiddlewareOptions) {
  const { i18n, abTestCookies } = options;

  return function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for API routes, static files, etc.
    if (shouldSkipMiddleware(pathname)) {
      return NextResponse.next();
    }

    let response = NextResponse.next();

    // Extract A/B testing cookie values
    const abCookies = getABTestCookies(request, abTestCookies);

    // Get locale (from cookie or detect from headers)
    const { locale, fromCookie } = getLocale(
      request,
      i18n.cookieName,
      i18n.defaultLocale,
      i18n.locales
    );

    // Set locale header
    response.headers.set("x-locale", locale);

    // Set locale cookie if not from cookie
    if (!fromCookie) {
      setLocaleCookie(response, i18n.cookieName, locale);
    }

    // Handle A/B test rewrites
    const abTestRewrite = handleABTestRewrites(
      pathname,
      request,
      locale,
      abCookies
    );
    if (abTestRewrite) {
      response = abTestRewrite;
    }

    return response;
  };
}
