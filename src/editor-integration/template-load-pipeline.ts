import type { ITemplateLoader } from "@shopkit/builder";
import { merchantTemplateLoader } from "./loaders/template-loader";
import { TemplateResolver } from "./loaders/template-resolver";

const resolver = new TemplateResolver(merchantTemplateLoader);

/**
 * Editor-aware template loader.
 *
 * API-first when NEXT_PUBLIC_ENABLE_EDITOR_CHANGES is set and the template
 * has fetchAPITemplate: true. Falls back to the filesystem loader always.
 *
 * Used as a drop-in replacement for the core templateLoader in builder.ts
 * when the editor integration is active.
 *
 * @internal
 */
export const editorTemplateLoader: ITemplateLoader = {
  loadTemplate: (merchantName, templateName, variant) =>
    resolver.resolveTemplate({
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
