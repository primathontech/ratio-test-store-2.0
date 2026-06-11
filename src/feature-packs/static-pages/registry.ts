import { lazy } from "react";
import { STATIC_PAGES_TEMPLATE_KEYS } from "./constants";

/**
 * Static-pages feature pack — editor static-template registry entries.
 *
 * Spread into `STATIC_TEMPLATES_REGISTRY[THEMES.DAWN.id]` in
 * `editor-integration/registries/static-templates-registry.ts`. The editor's
 * static-preview lane (`resolveStaticTemplate`) loads these lazily.
 */
export const STATIC_PAGES_REGISTRY = {
  [STATIC_PAGES_TEMPLATE_KEYS.PRIVACY_POLICY]: lazy(
    () => import("./templates/privacy-policy")
  ),
  [STATIC_PAGES_TEMPLATE_KEYS.SHIPPING_POLICY]: lazy(
    () => import("./templates/shipping-policy")
  ),
  [STATIC_PAGES_TEMPLATE_KEYS.CANCELLATION_POLICY]: lazy(
    () => import("./templates/cancellation-policy")
  ),
  [STATIC_PAGES_TEMPLATE_KEYS.TERMS_OF_USE]: lazy(
    () => import("./templates/terms-of-use")
  ),
} as const;
