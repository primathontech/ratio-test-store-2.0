/**
 * No-op Sentry shim.
 *
 * This storefront does not (yet) run Sentry, so this module provides the same
 * public surface as the platform `@/lib/sentry/utils` helper but performs no reporting.
 * It exists so the vendored Voice Agent code can be copied byte-for-byte (it
 * imports `captureSentryException` from here) without pulling in the
 * `@sentry/nextjs` dependency. Even the real helper no-ops without a configured
 * DSN, so behaviour is identical for now.
 *
 * When Sentry is adopted (e.g. during package extraction), replace this file
 * with the real implementation — no call sites need to change.
 */

/** Safely capture an exception. No-op until Sentry is wired up. */
export function captureSentryException(
  _exception: unknown,
  _options?: Record<string, unknown>
): string {
  return "";
}

/** Safely capture a message. No-op until Sentry is wired up. */
export function captureSentryMessage(
  _message: string,
  _options?: Record<string, unknown>
): string {
  return "";
}

/** Capture an error-boundary exception. No-op until Sentry is wired up. */
export function captureErrorBoundaryException(
  _error: Error & { digest?: string; cause?: unknown },
  _boundary: "page" | "global",
  _extraTags?: Record<string, string>
): string {
  return "";
}

/** Add a breadcrumb. No-op until Sentry is wired up. */
export function addSentryBreadcrumb(
  _category: string,
  _message: string,
  _data?: Record<string, unknown>,
  _level?: string
): void {
  // noop
}
