/**
 * Global feature flag for the Apps Platform integration.
 *
 * Off by default — the entire apps-platform surface (the runtime provider in the
 * layout, the builder widgets, and the PDP block placement) stays dark unless
 * `NEXT_PUBLIC_APPS_PLATFORM_ENABLED === "true"`. This keeps the feature
 * shippable but inert in production until the platform is production-ready.
 *
 * NEXT_PUBLIC_ so the value is inlined for both server and client bundles.
 */
export const APPS_PLATFORM_ENABLED =
  process.env.NEXT_PUBLIC_APPS_PLATFORM_ENABLED === "true";
