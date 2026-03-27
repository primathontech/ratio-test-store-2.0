import { THEMES } from "@/assembly/theme-constants";
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
      () => import("@/static-templates/about-us")
    ),
    // Add more static templates here, e.g.:
    // [THEMES.DAWN.static_templates.PRIVACY_POLICY]: lazy(() => import("@/static-templates/privacy-policy")),
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
