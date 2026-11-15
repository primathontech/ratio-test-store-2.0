import { THEMES } from "@/editor-integration/theme-constants";
import { TEMPLATE_TYPES } from "@/themes/ratio/templates/.generated/types";

/**
 * ratio theme registry — used by the editor migration script and the
 * editor-aware template loader.
 *
 * Dynamic templates: have `templatePath` and `routeContext`.
 * Static templates:  only have `translationsPath`.
 */
export const themeRegistry = {
  id: THEMES.RATIO.id,
  supportedLanguages: ["en"],

  templateStructure: {
    // Dynamic templates
    [TEMPLATE_TYPES.home]: {
      default: {
        templatePath: "/themes/ratio/templates/home/default.ts",
        translationsPath: "/themes/ratio/locales/pages/home",
        routeContext: {
          templateName: "home",
          type: "home",
          path: "/",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES.products]: {
      default: {
        templatePath: "/themes/ratio/templates/products/default.ts",
        translationsPath: "/themes/ratio/locales/pages/products",
        routeContext: {
          templateName: "products",
          path: "/products/high-shine-conditioning-hair-colour-honey-light-golden-brown-shade-5-32",
          params: {
            handle:
              "high-shine-conditioning-hair-colour-honey-light-golden-brown-shade-5-32",
          },
          query: {},
          productHandle:
            "high-shine-conditioning-hair-colour-honey-light-golden-brown-shade-5-32",
        },
      },
    },

    [TEMPLATE_TYPES.collection]: {
      default: {
        templatePath: "/themes/ratio/templates/collection/default.ts",
        translationsPath: "/themes/ratio/locales/pages/collections",
        routeContext: {
          templateName: "collection",
          path: "/collections/colour-bundles",
          params: { handle: "colour-bundles" },
          query: {},
          collectionHandle: "colour-bundles",
        },
      },
    },

    [TEMPLATE_TYPES["collection-list"]]: {
      default: {
        templatePath: "/themes/ratio/templates/collection-list/default.ts",
        translationsPath: "/themes/ratio/locales/pages/collection-list",
        routeContext: {
          templateName: "collection-list",
          path: "/collections",
          params: {},
          query: {},
        },
      },
    },

    // Static templates (only translationsPath)
    [TEMPLATE_TYPES["about-us"]]: {
      default: {
        templatePath: "/themes/ratio/templates/about-us/default.ts",
        translationsPath: "/themes/ratio/locales/pages/about-us",
        routeContext: {
          templateName: "about-us",
          path: "/pages/about-us",
          params: {},
          query: {},
        },
      },
    },

    // ── Shared chrome templates (header-group / footer-group model) ──
    // Rendered once by the root layout via renderChrome(); the editor keys on
    // routeContext.type being exactly "header" / "footer".
    [TEMPLATE_TYPES.header]: {
      default: {
        templatePath: "/themes/ratio/templates/header/default.ts",
        routeContext: {
          templateName: "header",
          type: "header",
          path: "/",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES.footer]: {
      default: {
        templatePath: "/themes/ratio/templates/footer/default.ts",
        routeContext: {
          templateName: "footer",
          type: "footer",
          path: "/",
          params: {},
          query: {},
        },
      },
    },
  },
};
