import type {
  ITemplateLoader,
  PageConfig,
  VariantRegistryResult,
} from "@shopkit/builder";

export const merchantTemplateLoader: ITemplateLoader = {
  async loadTemplate(merchantName, templateName, variant): Promise<PageConfig> {
    try {
      const module = await import(
        `@/themes/${merchantName}/templates/${templateName}/${variant}`
      );
      if (!module?.template) {
        throw new Error(
          `Missing 'template' export in themes/${merchantName}/templates/${templateName}/${variant}`
        );
      }
      return module.template;
    } catch (err) {
      console.error(
        `[TemplateLoader] Failed to load template for ${merchantName}/${templateName}/${variant}`,
        err
      );
      throw err;
    }
  },

  async loadVariantRegistry(
    merchantName
  ): Promise<VariantRegistryResult | null> {
    try {
      return await import(
        `@/themes/${merchantName}/templates/variant-registry`
      );
    } catch {
      // Variant registry is optional — return null if not found
      return null;
    }
  },
};
