/**
 * Next.js Middleware
 *
 * Handles locale detection and A/B testing rewrites.
 * Add custom logic before/after the core middleware as needed.
 *
 * @module middleware
 */

import type { NextRequest } from "next/server";

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
  // Add custom logic BEFORE core middleware here

  // Core middleware (locale detection, A/B tests)
  const response = baseMiddleware(request);

  // Add custom logic AFTER core middleware here

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
