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
  _pathname: string,
  _request: NextRequest,
  _locale: string,
  _abCookies: ABTestCookies
): NextResponse | null {
  // A/B testing is disabled in the generic dummy store: it rewrote to the
  // `-b` template variants (home-b / collections-b / products-b), which have
  // been removed. Kept as a no-op so the middleware call site stays intact
  // and A/B rewrites can be reintroduced later without rewiring middleware.
  return null;
}
