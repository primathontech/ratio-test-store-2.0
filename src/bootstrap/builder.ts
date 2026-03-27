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
  type ITemplateLoader,
  type FileSystemPresetOptions,
} from "@shopkit/builder";

// App-specific imports - these are WHY this file must be separate from the package
import { WIDGET_MANIFEST } from "@/widgets/.generated/manifest";
import { getCommerceClient } from "@/config/commerce";
import { SectionWrapper } from "@/ui/layout/SectionWrapper";
import {
  merchantTemplateLoader,
  FileSystemThemeLoader,
  TemplateResolver,
} from "@/assembly/loaders";

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
// TEMPLATE LOADER (API-first via shared TemplateResolver)
// =============================================================================

/**
 * Shared resolver: API-first when NEXT_PUBLIC_ENABLE_EDITOR_CHANGES is set,
 * filesystem fallback always. Same resolver used by the editor API route.
 * @internal
 */
const merchantTemplateResolver = new TemplateResolver(merchantTemplateLoader);

/**
 * Thin ITemplateLoader adapter that bridges TemplateResolver.resolveTemplate
 * (which takes a full routeContext) to the ITemplateLoader.loadTemplate interface
 * expected by getPageBuilderCore.
 *
 * fetchAPITemplate is hardcoded true because every template in theme-structure.json
 * has fetchAPITemplate: true. The actual gate is NEXT_PUBLIC_ENABLE_EDITOR_CHANGES.
 *
 * @internal
 */
const templateLoader: ITemplateLoader = {
  loadTemplate: (merchantName, templateName, variant) =>
    merchantTemplateResolver.resolveTemplate({
      merchantName,
      routeContext: {
        templateName,
        path: "",
        params: {},
        query: {},
        fetchAPITemplate: true,
      },
      variant,
    }),
  loadVariantRegistry: (merchantName) =>
    merchantTemplateLoader.loadVariantRegistry
      ? merchantTemplateLoader.loadVariantRegistry(merchantName)
      : Promise.resolve(null),
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
  themeLoader: new FileSystemThemeLoader(),
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
 *     query: {},
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
