/**
 * Middleware Utility Functions
 *
 * Common utilities for middleware processing.
 *
 * @module bootstrap/middleware
 */

/**
 * Check if a path should skip middleware processing
 */
export function shouldSkipMiddleware(
  pathname: string,
  skipPaths: string[] = ["/api", "/_next", "/static/"]
): boolean {
  // Skip if path starts with any skip path
  if (skipPaths.some((skip) => pathname.startsWith(skip))) {
    return true;
  }

  // Skip static files — an extension at the END of the path, not a dot ANYWHERE
  // in it. `includes(".")` also matched real handles (/collections/under-1.5k,
  // /products/serum-2.0) and dropped them out of middleware entirely: no locale
  // header and no A/B, so those URLs silently sat outside every experiment.
  // Same rule `isExcludedPath` in @shopkit/ab uses, so the two agree.
  if (/\.[a-z0-9]+$/i.test(pathname)) {
    return true;
  }

  return false;
}
