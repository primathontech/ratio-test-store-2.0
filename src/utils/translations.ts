/**
 * Translation API Utilities
 *
 * This file contains application-level translation utilities that integrate
 * with the page-builder and theme systems. It is intentionally placed OUTSIDE
 * the i18n package because it has dependencies on:
 *   - @/lib/page-builder (RouteContext, VariantRegistryResult)
 *   - Theme-specific variant registries
 *
 * ============================================================================
 * ARCHITECTURE NOTE
 * ============================================================================
 *
 * The i18n package (src/lib/i18n/) is designed to be standalone and portable.
 * This file serves as APPLICATION-LEVEL GLUE CODE that wires together:
 *   - The i18n package's message loading
 *   - The page-builder's route context
 *   - Theme-specific variant resolution
 *
 * This separation ensures the i18n package remains extractable without
 * pulling in page-builder or theme dependencies.
 *
 * @module lib/services/translations
 */

import { getMessages } from "next-intl/server";
import type { RouteContext, VariantRegistryResult } from "@shopkit/builder";
import { loadMessages } from "@/locales/.generated/manifest";
import type { Locale, PageName } from "@/locales/.generated/types";
import { osMerchantHeaders } from "@/utils/os-headers";

// =============================================================================
// TEMPLATE ID UTILITIES
// =============================================================================
// Inlined from former @/lib/ids/template-id.ts (single consumer, no reuse needed)

/**
 * Normalize a string value for use in template IDs
 */
function normalizeIdPart(value?: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

/**
 * Build a dynamic template ID from theme, template name, and variant
 * Format: {theme}_{template}_{variant}
 */
function buildDynamicTemplateId(
  themeName: string,
  templateName: string,
  variant: string
): string {
  return `${normalizeIdPart(themeName)}_${normalizeIdPart(templateName)}_${normalizeIdPart(variant)}`;
}

/**
 * Build a static template ID (just normalized)
 */
function buildStaticTemplateId(staticTemplateId: string): string {
  return normalizeIdPart(staticTemplateId);
}

type GetTemplateIdArgs = {
  themeName?: string;
  templateName?: string;
  variant?: string;
  staticTemplateId?: string;
};

/**
 * Returns a templateId string for use with the translation API.
 *
 * Rules:
 * - If templateName is present → dynamic (themeName_templateName_variant)
 * - Else if staticTemplateId is present → static (normalized)
 * - Else → returns "common" sentinel
 */
function getTemplateId(args: GetTemplateIdArgs): string {
  const themeName = normalizeIdPart(args.themeName);
  const templateName = normalizeIdPart(args?.templateName);

  if (templateName) {
    const variant = normalizeIdPart(args.variant || "default");
    return buildDynamicTemplateId(themeName, templateName, variant);
  }

  if (args.staticTemplateId) {
    return buildStaticTemplateId(args.staticTemplateId);
  }

  return "common";
}

/**
 * Extract page name from template ID
 * Template ID format: "{theme}_{page}_{variant}" -> extracts "{page}"
 * Examples:
 *   - "ratio_home_default" -> "home"
 *   - "ratio_collection_default" -> "collections" (mapped)
 *   - "ratio_products_default" -> "products"
 */
function extractPageName(templateId: string): string | undefined {
  if (!templateId || templateId === "common") {
    return undefined;
  }

  // Split by underscore: [theme, page, variant]
  const parts = templateId.split("_");
  if (parts.length < 2) {
    return undefined;
  }

  // The page name is the second part
  const pagePart = parts[1];

  // Map template page names to locale folder names
  // (e.g., "collection" -> "collections" to match folder structure)
  const pageNameMap: Record<string, string> = {
    collection: "collections",
    product: "products",
  };

  return pageNameMap[pagePart] || pagePart;
}

// =============================================================================
// VARIANT REGISTRY
// =============================================================================

/**
 * Load variant registry for a theme
 */
async function loadVariantRegistry(
  themeName: string
): Promise<VariantRegistryResult | null> {
  try {
    return await import(`@/themes/${themeName}/templates/variant-registry`);
  } catch (err) {
    console.error(
      `[TemplateLoader] Failed to load variant registry for ${themeName}`,
      err
    );
    return null;
  }
}

/**
 * Helper method to get nested value from object using dot notation
 */
function getNestedValue(obj: any, path: string | undefined): any {
  if (!path) {
    return undefined;
  }
  return path.split(".").reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
}

/**
 * Determine the template variant based on API data
 */
async function determineVariant(
  themeName: string,
  templateType: string,
  apiData: any
): Promise<string> {
  try {
    const result = await loadVariantRegistry(themeName);

    if (!result || !result.variantRegistry) {
      return "default";
    }

    const mapping = result.variantRegistry[templateType];

    if (!mapping) {
      return "default";
    }

    const { apiField, variantMap, defaultVariant } = mapping;

    // Extract the value from API data using the specified field
    const fieldValue = getNestedValue(apiData, apiField);

    // Check if variantMap exists and contains the field value
    if (fieldValue && variantMap && variantMap[fieldValue]) {
      return variantMap[fieldValue];
    }

    return defaultVariant || "default";
  } catch (error) {
    console.warn(
      `Failed to load variant registry for template type ${templateType}:`,
      error
    );
    return "default";
  }
}

// =============================================================================
// TRANSLATION API
// =============================================================================

export interface TranslationResponse {
  data: {
    translations: Record<string, any>;
  };
}

export interface GetTranslationsParams {
  themeId: string;
  templateId: string;
  language: string;
  /** Used when the editor has no translations for `templateId` (404). */
  fallbackTemplateId?: string;
}

// Feature flag: only fetch translations from API when explicitly enabled
const isEditorChangesEnabled = () => {
  const flag = process.env.NEXT_PUBLIC_ENABLE_EDITOR_CHANGES;
  return String(flag).toLowerCase() === "true";
};

/**
 * Get translations for a specific theme, template, and language
 *
 * @param params - Object containing themeId, templateId, and language
 * @returns Promise<Record<string, any>> - Translations object
 *
 * @example
 * ```tsx
 * // Get contact-us translations for kilrr theme in English
 * const translations = await getTranslations({
 *   themeId: "kilrr",
 *   templateId: "contact-us",
 *   language: "en"
 * });
 *
 * // Get about page translations for bblunt theme in Hindi
 * const translations = await getTranslations({
 *   themeId: "bblunt",
 *   templateId: "about",
 *   language: "hi"
 * });
 * ```
 */
export async function getTranslations(
  params: GetTranslationsParams
): Promise<Record<string, any>> {
  const { themeId, templateId, language } = params;

  // Local locale JSONs for this template — src/themes/{theme}/locales/pages/.
  //
  // This mirrors TemplateResolver, which falls back to the FILESYSTEM template
  // (loadMerchantTemplate) whenever the editor backend has no record for a
  // templateId. The two layers have to agree: a template served from disk
  // references its copy as "t:{templateId}.{key}", so its messages must come
  // from disk too. next-intl's getMessages() is request-scoped and never
  // contains an arbitrary page namespace, so using it here would leave those
  // tokens unresolved and hand widgets a raw string.
  //
  // Not hypothetical: the editor backend hosts home/collection/products/
  // collection-list/about-us but 404s contact, faq, privacy-policy,
  // terms-of-service, refund-policy and shipping-policy, so every
  // /pages/[handle] route takes this path on each render.
  const localMessages = async (): Promise<Record<string, any>> => {
    // templateId format: "common" or "ratio_home_default" -> page name: "home"
    const pageName =
      templateId === "common" ? undefined : extractPageName(templateId);
    try {
      return await loadMessages(
        language as Locale,
        pageName as PageName | undefined
      );
    } catch {
      // No locale folder for this page — degrade to request-scoped messages
      // rather than failing the render.
      return await getMessages();
    }
  };

  try {
    // If editor changes are disabled, use local locale JSONs
    if (!isEditorChangesEnabled()) {
      return await localMessages();
    }

    const apiUrl = process.env.NEXT_PUBLIC_EDITOR_API_URL;
    if (!apiUrl) {
      throw new Error(
        "NEXT_PUBLIC_EDITOR_API_URL environment variable is not set"
      );
    }

    // Add a timeout to avoid hanging when API is down
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    let response: Response;
    try {
      response = await fetch(
        `${apiUrl}/api/v1/themes/${themeId}/translations/${templateId}/${language}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...osMerchantHeaders(),
          },
          signal: controller.signal,
          // Full ISR: tagged + time-revalidated (not no-store). Tag must match
          // the revalidate webhook (single-merchant → no theme prefix).
          next: {
            tags: [`editor-i18n:${templateId}:${language}`],
            revalidate: 3600,
          },
        }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.status === 404 && params.fallbackTemplateId) {
      return await getTranslations({
        ...params,
        templateId: params.fallbackTemplateId,
        fallbackTemplateId: undefined,
      });
    }

    if (!response.ok) {
      console.warn(
        `[i18n] Translation API responded with status ${response.status}. Falling back to local messages.`
      );
      return await localMessages();
    }

    // Parse JSON safely; fall back if parsing fails
    let data: TranslationResponse | undefined;
    try {
      data = (await response.json()) as TranslationResponse;
    } catch (parseError) {
      console.warn(
        "[i18n] Failed to parse translation API response. Falling back to local messages.",
        parseError
      );
      return await localMessages();
    }

    const translations = data?.data?.translations;
    if (translations && typeof translations === "object") {
      return translations;
    }

    console.warn(
      "[i18n] Translation API returned invalid shape. Falling back to local messages."
    );
    return await localMessages();
  } catch (error) {
    console.error(
      `Error fetching translations for ${params.themeId}/${params.templateId}/${params.language}:`,
      error
    );
    // Final fallback to local messages to keep the app functional
    try {
      return await localMessages();
    } catch (localFallbackError) {
      console.error(
        "[i18n] Failed to load local messages as a fallback:",
        localFallbackError
      );
      // Preserve the original error context but avoid crashing silently
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
}

// =============================================================================
// ROUTE TRANSLATIONS
// =============================================================================

/**
 * Get translations for a route, merging common and page-specific translations.
 *
 * @param themeName - The theme name
 * @param routeContext - Optional route context with template info
 * @param language - The locale code
 * @param staticTemplateId - Optional static template ID
 * @returns Promise<Record<string, any>> - Merged translations
 */
export async function getRouteTranslations({
  themeName,
  routeContext,
  language,
  staticTemplateId,
}: {
  themeName: string;
  routeContext?: RouteContext;
  language: string;
  staticTemplateId?: string;
}): Promise<Record<string, any>> {
  const { templateName, templateSuffix } = routeContext || {};
  const apiData = (routeContext as any)?.apiData;

  // Always load common translations first
  const common = await getTranslations({
    themeId: themeName,
    templateId: "common",
    language,
  });

  // If routeContext with a templateName exists, treat as dynamic and resolve variant.
  // Precedence: the resource's assigned `templateSuffix` (Page Templates) wins,
  // then the legacy apiData-driven variant, then "default". This makes each
  // published template load its OWN translation JSON ({m}_{type}_{suffix}),
  // mirroring how the template-resolver picks the pageConfig.
  if (templateName) {
    const resolvedVariant =
      templateSuffix ||
      (await determineVariant(themeName, templateName, apiData));
    const templateId = getTemplateId({
      themeName,
      templateName,
      variant: resolvedVariant,
    });

    // A suffix template the editor doesn't have renders the default template
    // (template-load-pipeline), so its copy must come from the default too.
    const templateTranslations = await getTranslations({
      themeId: themeName,
      templateId,
      language,
      fallbackTemplateId:
        resolvedVariant !== "default"
          ? getTemplateId({ themeName, templateName, variant: "default" })
          : undefined,
    });

    return { ...common, ...templateTranslations };
  }

  // Otherwise, if a staticTemplateId is provided, use it
  if (staticTemplateId) {
    const templateId = getTemplateId({ staticTemplateId });
    const templateTranslations = await getTranslations({
      themeId: themeName,
      templateId,
      language,
    });
    return { ...common, ...templateTranslations };
  }

  // Fallback: only common translations
  return common;
}
