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
import { handleSectionAbTest } from "./section-ab";
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

// Page-level A/B — off. Section-level A/B replaces it; only one may rewrite a
// request. A stale `_prima_ptr_ab_*=B` cookie is ignored, so the visitor gets
// the ordinary page.
const PAGE_LEVEL_AB_ENABLED = false;

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

  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for API routes, static files, etc.
    if (shouldSkipMiddleware(pathname)) {
      return NextResponse.next();
    }

    let response = NextResponse.next();

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

    if (PAGE_LEVEL_AB_ENABLED) {
      const abCookies = getABTestCookies(request, abTestCookies);
      const abTestRewrite = handleABTestRewrites(
        pathname,
        request,
        locale,
        abCookies
      );
      if (abTestRewrite) {
        response = abTestRewrite;
      }
    }

    // Section-level A/B. Runs LAST so it can see whether the PRT rewrite above
    // already claimed this request, and skip rather than stack on top of it.
    // Never throws: a failure returns `response` unchanged.
    return handleSectionAbTest(request, response);
  };
}
