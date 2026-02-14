/**
 * A/B Testing Middleware Utilities
 *
 * Utilities for handling A/B test rewrites in middleware.
 *
 * @module bootstrap/middleware
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { ABTestCookies } from "./types";

/**
 * Extract A/B testing cookie values from request
 */
export function getABTestCookies(
  request: NextRequest,
  cookieNames: { home: string; collection: string; product: string }
): ABTestCookies {
  return {
    home: request.cookies.get(cookieNames.home)?.value,
    collection: request.cookies.get(cookieNames.collection)?.value,
    product: request.cookies.get(cookieNames.product)?.value,
  };
}

/**
 * Handle A/B testing rewrites based on cookie values
 *
 * Returns a rewrite response if A/B variant applies, null otherwise.
 */
export function handleABTestRewrites(
  pathname: string,
  request: NextRequest,
  locale: string,
  abCookies: ABTestCookies
): NextResponse | null {
  // A/B Testing: Home page
  if (pathname === "/") {
    if (abCookies.home === "B") {
      const rewriteResponse = NextResponse.rewrite(
        new URL("/home-b", request.url)
      );
      rewriteResponse.headers.set("x-locale", locale);
      return rewriteResponse;
    }
  }
  // A/B Testing: Nested collection-product routes
  else if (
    pathname.startsWith("/collections/") &&
    pathname.includes("/products/")
  ) {
    let rewritePath = pathname;
    if (abCookies.collection === "B") {
      rewritePath = rewritePath.replace("/collections/", "/collections-b/");
    }
    if (abCookies.product === "B") {
      rewritePath = rewritePath.replace("/products/", "/products-b/");
    }
    if (rewritePath !== pathname) {
      const rewriteResponse = NextResponse.rewrite(
        new URL(rewritePath, request.url)
      );
      rewriteResponse.headers.set("x-locale", locale);
      return rewriteResponse;
    }
  }
  // A/B Testing: Product pages
  else if (pathname.startsWith("/products/")) {
    if (abCookies.product === "B") {
      const rewriteResponse = NextResponse.rewrite(
        new URL(pathname.replace("/products/", "/products-b/"), request.url)
      );
      rewriteResponse.headers.set("x-locale", locale);
      return rewriteResponse;
    }
  }
  // A/B Testing: Collection pages
  else if (pathname.startsWith("/collections/")) {
    if (abCookies.collection === "B") {
      const rewriteResponse = NextResponse.rewrite(
        new URL(
          pathname.replace("/collections/", "/collections-b/"),
          request.url
        )
      );
      rewriteResponse.headers.set("x-locale", locale);
      return rewriteResponse;
    }
  }

  return null;
}
