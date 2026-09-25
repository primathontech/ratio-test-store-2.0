import { THEMES } from "@/editor-integration/theme-constants";
import { lazy } from "react";

/**
 * Static templates registry with lazy loading.
 *
 * Purpose: Theme-scoped component loading for static (non-page-builder) templates.
 * Update: Add new themes/templates here.
 * Usage: resolveStaticTemplate(themeId, templateId)
 */

// Theme-scoped registry with lazy components (created once)
export const STATIC_TEMPLATES_REGISTRY = {
  [THEMES.DAWN.id]: {
    [THEMES.DAWN.static_templates.ABOUT_US]: lazy(
      () => import("@/editor-integration/static-templates/about-us")
    ),
    [THEMES.DAWN.static_templates.PRIVACY_POLICY]: lazy(
      () => import("@/editor-integration/static-templates/privacy-policy")
    ),
    [THEMES.DAWN.static_templates.SHIPPING_POLICY]: lazy(
      () => import("@/editor-integration/static-templates/shipping-policy")
    ),
    [THEMES.DAWN.static_templates.CANCELLATION_POLICY]: lazy(
      () => import("@/editor-integration/static-templates/cancellation-policy")
    ),
    [THEMES.DAWN.static_templates.TERMS_OF_USE]: lazy(
      () => import("@/editor-integration/static-templates/terms-of-use")
    ),
  },
} as const;

// Resolve component for a specific theme and template
export function resolveStaticTemplate(
  themeId: string,
  templateId: string
): React.ComponentType | null {
  const themeComponents =
    STATIC_TEMPLATES_REGISTRY[
      themeId as keyof typeof STATIC_TEMPLATES_REGISTRY
    ];
  if (!themeComponents) {
    return null;
  }

  return (themeComponents as any)[templateId] || null;
}
