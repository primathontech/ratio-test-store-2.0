/**
 * Page Builder Bootstrap - @shopkit/builder Configuration
 *
 * This file configures the @shopkit/builder package for this application.
 * It is the COMPOSITION ROOT that wires together app-specific implementations
 * with the package's interfaces.
 *
 * ============================================================================
 * ARCHITECTURE NOTE: Why This File Exists
 * ============================================================================
 *
 * When @shopkit/builder is published as an NPM package, consumers must
 * provide their own implementations of:
 *   - Theme loading (where are themes stored?)
 *   - Template loading (where are templates stored?)
 *   - Widget registry (what widgets are available?)
 *   - Commerce client (what backend provides product data?)
 *   - Section renderer (how are sections styled?)
 *
 * This follows the same pattern as other configurable packages:
 *   - next-auth → app/api/auth/[...nextauth]/route.ts
 *   - prisma → prisma/schema.prisma
 *   - tailwind → tailwind.config.js
 *
 * The builder package has ZERO knowledge of:
 *   - @/widgets/.generated/manifest (app's widget registry)
 *   - @/config/commerce (app's commerce client)
 *   - @/ui/layout/SectionWrapper (app's section component)
 *   - @/themes/* (app's theme file structure)
 *
 * ============================================================================
 * FOR AGENCIES: This file is INTERNAL INFRASTRUCTURE
 * ============================================================================
 *
 * Agency developers should NOT modify this file. It is part of the core
 * platform setup. To customize page rendering:
 *   - Create new widgets in @/widgets/{theme}/
 *   - Create new templates in @/themes/{theme}/templates/
 *   - Customize theme settings in @/themes/{theme}/theme.json
 *
 * @module bootstrap/builder
 * @internal
 */

import {
  getPageBuilder as getPageBuilderCore,
  createSectionRendererFromComponent,
  type PageBuilder,
  type IThemeLoader,
  type ITemplateLoader,
  type Theme,
  type ThemeRole,
  type VariantRegistryResult,
  type FileSystemPresetOptions,
} from "@shopkit/builder";

// App-specific imports - these are WHY this file must be separate from the package
import { WIDGET_MANIFEST } from "@/widgets/.generated/manifest";
import { getCommerceClient } from "@/config/commerce";
import { SectionWrapper } from "@/ui/layout/SectionWrapper";

// =============================================================================
// COMMERCE CLIENT
// =============================================================================

/**
 * Gets the data-layer commerce client.
 *
 * The builder now uses data-layer's ICommerceClient directly:
 * - All methods return IResponse format (success, message, data, error, meta)
 * - Widgets handle the IResponse directly - no unwrapping needed
 * - Parameters are passed through exactly as defined in templates
 *
 * @internal
 */
function getBuilderCommerceClient() {
  return getCommerceClient();
}

// =============================================================================
// THEME LOADER IMPLEMENTATION
// =============================================================================

/**
 * Loads merchant themes from the file system using dynamic imports.
 * Expected file structure: @/themes/{merchantName}/theme.json
 *
 * @internal
 */
const themeLoader: IThemeLoader = {
  async loadTheme(merchantName: string): Promise<Theme> {
    const themePath = `@/themes/${merchantName}/theme.json`;

    try {
      const module = await import(`@/themes/${merchantName}/theme.json`);
      const data = module.default;

      if (!data || typeof data !== "object") {
        throw new Error(`Theme file is empty or invalid`);
      }

      if (!data.id || !data.name) {
        throw new Error(`Theme missing required fields: id, name`);
      }

      return {
        id: data.id,
        name: data.name,
        role: (data.role || "live") as ThemeRole,
        config: data.config || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`[ThemeLoader] Failed to load theme`, {
        merchantName,
        attemptedPath: themePath,
        error: errorMessage,
      });
      throw new Error(
        `Theme not found for merchant "${merchantName}". ` +
          `Ensure ${themePath} exists and exports valid theme data. ` +
          `Original error: ${errorMessage}`,
      );
    }
  },
};

// =============================================================================
// TEMPLATE LOADER IMPLEMENTATION
// =============================================================================

/**
 * Loads page templates from the file system using dynamic imports.
 * Expected file structure: @/themes/{merchantName}/templates/{templateName}/{variant}
 * Each template file must export a `template` object.
 *
 * @internal
 */
const templateLoader: ITemplateLoader = {
  async loadTemplate(
    merchantName: string,
    templateName: string,
    variant: string,
  ) {
    const templatePath = `@/themes/${merchantName}/templates/${templateName}/${variant}`;

    try {
      const module = await import(
        `@/themes/${merchantName}/templates/${templateName}/${variant}`
      );

      if (!module?.template) {
        throw new Error(
          `Template file must export a 'template' object. ` +
            `Found exports: ${Object.keys(module).join(", ") || "none"}`,
        );
      }

      return module.template;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`[TemplateLoader] Failed to load template`, {
        merchantName,
        templateName,
        variant,
        attemptedPath: templatePath,
        error: errorMessage,
      });
      throw new Error(
        `Template not found: "${templateName}" (variant: "${variant}") ` +
          `for merchant "${merchantName}". ` +
          `Ensure ${templatePath}.ts exists and exports { template }. ` +
          `Original error: ${errorMessage}`,
      );
    }
  },

  async loadVariantRegistry(
    merchantName: string,
  ): Promise<VariantRegistryResult | null> {
    try {
      return await import(
        `@/themes/${merchantName}/templates/variant-registry`
      );
    } catch {
      // Variant registry is optional - return null if not found
      return null;
    }
  },
};

// =============================================================================
// SECTION RENDERER
// =============================================================================

/**
 * Wraps the app's SectionWrapper component for use by the page builder.
 * @internal
 */
const sectionRenderer = createSectionRendererFromComponent(SectionWrapper);

// =============================================================================
// PAGE BUILDER CONFIGURATION
// =============================================================================

/**
 * Configuration options for this application's page builder.
 * @internal
 */
const pageBuilderOptions: FileSystemPresetOptions = {
  widgets: WIDGET_MANIFEST,
  commerceClient: getBuilderCommerceClient(),
  themeLoader,
  templateLoader,
  sectionRenderer,
  defaultLocale: "en",
};

/** Singleton instance - created on first access */
let pageBuilderInstance: PageBuilder | null = null;

/**
 * Get the configured page builder instance.
 *
 * This is the main entry point for rendering pages in this application.
 * The instance is created on first call and reused thereafter (singleton).
 *
 * @returns Configured PageBuilder instance
 *
 * @example
 * ```typescript
 * import { getPageBuilder } from "@/bootstrap/builder";
 *
 * // In a page component
 * const pageBuilder = getPageBuilder();
 * const content = await pageBuilder.renderPage({
 *   merchantName: "wellversed",
 *   routeContext: {
 *     templateName: "home",
 *     path: "/",
 *     params: {},
 *   },
 * });
 * ```
 */
export function getPageBuilder(): PageBuilder {
  if (!pageBuilderInstance) {
    pageBuilderInstance = getPageBuilderCore(pageBuilderOptions);
  }
  return pageBuilderInstance;
}

/**
 * Reset the page builder singleton instance.
 *
 * Use this for testing or when you need to reinitialize with fresh state.
 * After calling this, the next `getPageBuilder()` call will create a new instance.
 */
export function resetPageBuilder(): void {
  pageBuilderInstance = null;
}
