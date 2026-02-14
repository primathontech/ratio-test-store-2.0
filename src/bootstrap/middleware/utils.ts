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

  // Skip if path contains a file extension (static files)
  if (pathname.includes(".")) {
    return true;
  }

  return false;
}
