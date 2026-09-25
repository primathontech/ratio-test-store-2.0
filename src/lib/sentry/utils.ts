/**
 * Sentry telemetry shim.
 *
 * This storefront (monorepo build) intentionally ships WITHOUT `@sentry/nextjs`
 * — there are no `sentry.*.config.ts` files and no `@sentry/*` dependency. These
 * functions preserve the upstream API surface as no-ops so callers (error
 * boundaries, cart-recovery, BFF routes) build and run unchanged. To enable real
 * telemetry, add `@sentry/nextjs` + the sentry config files and restore the
 * `Sentry.*` calls.
 */

type SeverityLevel = "fatal" | "error" | "warning" | "log" | "info" | "debug";

/** No-op (Sentry not wired in this build). */
export function captureSentryException(
  _exception: unknown,
  _options?: unknown
): string {
  return "";
}

/** No-op (Sentry not wired in this build). */
export function captureSentryMessage(
  _message: string,
  _options?: unknown
): string {
  return "";
}

/** No-op (Sentry not wired in this build). */
export function captureErrorBoundaryException(
  _error: Error & { digest?: string; cause?: unknown },
  _boundary: "page" | "global",
  _extraTags?: Record<string, string>
): string {
  return "";
}

/** No-op (Sentry not wired in this build). */
export function addSentryBreadcrumb(
  _category: string,
  _message: string,
  _data?: Record<string, unknown>,
  _level: SeverityLevel = "info"
): void {
  // intentionally empty
}
