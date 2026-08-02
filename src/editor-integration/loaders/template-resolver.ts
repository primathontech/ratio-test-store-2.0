/* eslint-disable no-console */
import { templateApiClient } from "./api-client";
import type {
  ITemplateLoader,
  PageConfig,
  RouteContext,
} from "@shopkit/builder";
import { getTemplateId } from "@/editor-integration/template-id";

/**
 * Template cache to avoid repeated dynamic imports for filesystem templates
 */
const templateCache = new Map<string, PageConfig>();

// Feature flag: only fetch templates from API when explicitly enabled
const isEditorChangesEnabled = () => {
  const flag = process.env.NEXT_PUBLIC_ENABLE_EDITOR_CHANGES;
  return String(flag).toLowerCase() === "true";
};

/**
 * Template Resolver
 *
 * Shared API-first resolver used by both production page rendering (bootstrap)
 * and the editor template API route.
 *
 * Resolution order:
 *   1. If fetchAPITemplate && NEXT_PUBLIC_ENABLE_EDITOR_CHANGES: try backend API
 *   2. On API failure (or flag off): fall back to filesystem via fsLoader
 *
 * @param fsLoader - Filesystem-based ITemplateLoader used as the fallback
 */
export class TemplateResolver {
  constructor(private readonly fsLoader: ITemplateLoader) {}

  /**
   * Resolve template based on merchant name, route context, and variant.
   */
  async resolveTemplate({
    merchantName,
    routeContext,
    variant,
  }: {
    merchantName: string;
    routeContext: RouteContext;
    variant?: string;
  }): Promise<PageConfig> {
    const { templateName, fetchAPITemplate = false } = routeContext || {};

    if (!templateName) {
      throw new Error("Template name is required in the route context");
    }

    const resolvedVariant = variant || "default";
    let template: PageConfig;

    try {
      // API-first: only when both the route opts in and the env flag is enabled
      if (fetchAPITemplate === true && isEditorChangesEnabled()) {
        const templateId = getTemplateId({
          merchantName,
          templateName,
          variant: resolvedVariant,
        });
        template = await this.loadTemplateFromApi(merchantName, templateId);
      } else {
        // Filesystem path with caching
        const cacheKey = `${merchantName}-${templateName}-${resolvedVariant}`;
        if (templateCache.has(cacheKey)) {
          return templateCache.get(cacheKey)!;
        }
        template = await this.loadMerchantTemplate(
          merchantName,
          templateName,
          resolvedVariant
        );
        if (this.validateTemplate(template)) {
          templateCache.set(cacheKey, template);
        }
      }
    } catch (error) {
      console.error(
        `[TemplateResolver] Error loading template for ${merchantName}/${templateName}:`,
        error
      );

      // API failed — fall back to filesystem
      const cacheKey = `${merchantName}-${templateName}-${resolvedVariant}`;
      if (templateCache.has(cacheKey)) {
        return templateCache.get(cacheKey)!;
      }

      try {
        template = await this.loadMerchantTemplate(
          merchantName,
          templateName,
          resolvedVariant
        );
        if (this.validateTemplate(template)) {
          templateCache.set(cacheKey, template);
        }
      } catch (localError) {
        console.error(
          `[TemplateResolver] FS fallback also failed for ${merchantName}/${templateName}:`,
          localError
        );
        throw new Error(
          `Unable to load template for ${merchantName}/${templateName}. ` +
            `Make sure the template exists in src/themes/${merchantName}/templates/${templateName}/.`
        );
      }
    }

    if (!this.validateTemplate(template)) {
      throw new Error(
        `Invalid template configuration for ${merchantName}/${templateName}`
      );
    }

    return template;
  }

  /**
   * Load template from the backend API.
   */
  private async loadTemplateFromApi(
    merchantName: string,
    templateId: string
  ): Promise<PageConfig> {
    try {
      // No isAvailable()/health preflight — it's an extra uncacheable fetch that
      // throws DynamicServerError during static generation and silently drops to
      // the filesystem. fetchTemplate has its own timeout + error handling.
      const response = await templateApiClient.fetchTemplate(
        merchantName,
        templateId
      );

      if (!response?.data?.template?.pageConfig) {
        throw new Error("Invalid template response from API");
      }

      const pageConfig = response.data.template.pageConfig;

      if (!pageConfig.sections || !Array.isArray(pageConfig.sections)) {
        throw new Error("Invalid pageConfig structure from API");
      }

      if (!pageConfig.id) {
        pageConfig.id = `${merchantName}-${templateId}`;
      }

      if (!pageConfig.dataSources) {
        pageConfig.dataSources = {};
      }

      return pageConfig;
    } catch (error) {
      console.error(
        `[TemplateResolver] API fetch failed for ${merchantName}/${templateId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Load template from the filesystem via the injected fsLoader.
   * Falls back to "default" variant if the requested variant is not found.
   */
  private async loadMerchantTemplate(
    merchantName: string,
    templateName: string,
    variant: string = "default"
  ): Promise<PageConfig> {
    try {
      const template = await this.fsLoader.loadTemplate(
        merchantName,
        templateName,
        variant
      );

      if (!template) {
        throw new Error(
          `Template not returned for ${merchantName}/${templateName}/${variant}`
        );
      }

      return template;
    } catch (error) {
      if (variant !== "default") {
        console.warn(
          `[TemplateResolver] Variant "${variant}" not found for ${merchantName}/${templateName}, ` +
            `falling back to default`
        );
        return this.loadMerchantTemplate(merchantName, templateName, "default");
      }
      console.error(
        `[TemplateResolver] Failed to load ${merchantName}/${templateName}/${variant}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Validate that a pageConfig has the required structure.
   */
  validateTemplate(template: PageConfig): boolean {
    if (!template.id || !template.sections) {
      console.error(
        "[TemplateResolver] Validation failed: missing id or sections"
      );
      return false;
    }

    if (!Array.isArray(template.sections) || template.sections.length === 0) {
      console.error(
        "[TemplateResolver] Validation failed: sections must be a non-empty array"
      );
      return false;
    }

    for (const section of template.sections) {
      if (!section.id || !section.widgets || !Array.isArray(section.widgets)) {
        console.error(
          "[TemplateResolver] Validation failed: section missing id or widgets array",
          { id: section.id }
        );
        return false;
      }

      if (!section.name || !section.type) {
        console.error(
          "[TemplateResolver] Validation failed: section missing name or type",
          { id: section.id }
        );
        return false;
      }

      if (!section.settings) {
        console.error(
          "[TemplateResolver] Validation failed: section missing settings",
          { id: section.id }
        );
        return false;
      }

      for (const widget of section.widgets) {
        if (!widget.id || !widget.type || !widget.name) {
          console.error(
            "[TemplateResolver] Validation failed: widget missing id, type, or name",
            { id: widget.id }
          );
          return false;
        }

        if (!widget.settings) {
          console.error(
            "[TemplateResolver] Validation failed: widget missing settings",
            { id: widget.id }
          );
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Clear the filesystem template cache.
   */
  clearCache(): void {
    templateCache.clear();
  }
}
