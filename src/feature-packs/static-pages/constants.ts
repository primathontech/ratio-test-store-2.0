/**
 * Static-pages feature pack — template-id constants.
 *
 * These keys are spread into `THEMES.DAWN.static_templates` in
 * `editor-integration/theme-constants.ts`. Keeping them here means the
 * pack owns its own identifiers; the central constants file only spreads
 * them in (one line), so removing the pack is a clean delete + revert.
 */
export const STATIC_PAGES_TEMPLATE_KEYS = {
  PRIVACY_POLICY: "privacy-policy",
  SHIPPING_POLICY: "shipping-policy",
  CANCELLATION_POLICY: "cancellation-policy",
  TERMS_OF_USE: "terms-of-use",
} as const;

export type StaticPageSlug =
  (typeof STATIC_PAGES_TEMPLATE_KEYS)[keyof typeof STATIC_PAGES_TEMPLATE_KEYS];
