import { THEMES } from "@/editor-integration/theme-constants";

/**
 * Static templates registry with lazy loading.
 *
 * Purpose: Theme-scoped component loading for static (non-page-builder) templates.
 * Update: Add new themes/templates here.
 * Usage: resolveStaticTemplate(themeId, templateId)
 */

// Theme-scoped registry with lazy components (created once)
export const STATIC_TEMPLATES_REGISTRY = {
  [THEMES.RATIO.id]: {
    // Add static (non-page-builder) templates here, e.g.:
    // [THEMES.RATIO.static_templates.PRIVACY_POLICY]: lazy(() => import("@/editor-integration/static-templates/privacy-policy")),
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
