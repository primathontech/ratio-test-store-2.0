import { THEMES } from "@/editor-integration/theme-constants";
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";

/**
 * bblunt-2 theme registry — used by the editor migration script and the
 * editor-aware template loader.
 *
 * Dynamic templates: have `templatePath` and `routeContext`.
 * Static templates:  only have `translationsPath`.
 */
export const themeRegistry = {
  id: THEMES.BBLUNT_2.id,
  supportedLanguages: ["en"],

  templateStructure: {
    // Dynamic templates
    [TEMPLATE_TYPES.home]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/home/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/home",
        routeContext: {
          templateName: "home",
          type: "home",
          path: "/",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["home-b"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/home-b/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/home-b",
        routeContext: {
          templateName: "home-b",
          path: "/home-b",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES.products]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/products/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/products",
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

    [TEMPLATE_TYPES["products-b"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/products-b/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/products-b",
        routeContext: {
          templateName: "products-b",
          path: "/products-b/high-shine-conditioning-hair-colour-honey-light-golden-brown-shade-5-32",
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
        templatePath: "/themes/bblunt-2/templates/collection/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/collections",
        routeContext: {
          templateName: "collection",
          path: "/collections/colour-bundles",
          params: { handle: "colour-bundles" },
          query: {},
          collectionHandle: "colour-bundles",
        },
      },
    },

    [TEMPLATE_TYPES["collection-b"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/collection-b/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/collections-b",
        routeContext: {
          templateName: "collection-b",
          path: "/collections-b/colour-bundles",
          params: { handle: "colour-bundles" },
          query: {},
          collectionHandle: "colour-bundles",
        },
      },
    },

    [TEMPLATE_TYPES["collection-list"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/collection-list/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/collection-list",
        routeContext: {
          templateName: "collection-list",
          path: "/collections",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES.orders]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/orders/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/orders",
        routeContext: {
          templateName: "orders",
          path: "/orders",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["shine-squad-weekly-offer"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/shine-squad-weekly-offer/default.ts",
        translationsPath:
          "/themes/bblunt-2/locales/pages/shine-squad-weekly-offer",
        routeContext: {
          templateName: "shine-squad-weekly-offer",
          path: "/pages/shine-squad-weekly-offer",
          params: {},
          query: {},
        },
      },
    },

    // Static templates (only translationsPath)
    [TEMPLATE_TYPES["about-us"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/about-us/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/about-us",
        routeContext: {
          templateName: "about-us",
          path: "/pages/about-us",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["privacy-policy"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/privacy-policy/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/privacy-policy",
        routeContext: {
          templateName: "privacy-policy",
          path: "/pages/privacy-policy",
          params: {},
          query: {},
        },
      },
    },
  },
};
