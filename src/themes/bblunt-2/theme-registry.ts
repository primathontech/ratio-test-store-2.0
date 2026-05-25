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

    // ── Sale-page templates (all use the same SalePageBanner + CollectionPage layout) ──
    [TEMPLATE_TYPES["aff-get4-freebies"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/aff-get4-freebies/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/aff-get4-freebies",
        routeContext: {
          templateName: "aff-get4-freebies",
          path: "/pages/aff-get4-freebies",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["affiliate-flat250-off-above698"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/affiliate-flat250-off-above698/default.ts",
        translationsPath:
          "/themes/bblunt-2/locales/pages/affiliate-flat250-off-above698",
        routeContext: {
          templateName: "affiliate-flat250-off-above698",
          path: "/pages/affiliate-flat250-off-above698",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["aff-offer-flat250"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/aff-offer-flat250/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/aff-offer-flat250",
        routeContext: {
          templateName: "aff-offer-flat250",
          path: "/pages/aff-offer-flat250",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["bau-offer-page"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/bau-offer-page/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/bau-offer-page",
        routeContext: {
          templateName: "bau-offer-page",
          path: "/pages/bau-offer-page",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["crm-shine-squad-mega"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/crm-shine-squad-mega/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/crm-shine-squad-mega",
        routeContext: {
          templateName: "crm-shine-squad-mega",
          path: "/pages/crm-shine-squad-mega",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["fb-advance-smoothening-category-sale"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/fb-advance-smoothening-category-sale/default.ts",
        translationsPath:
          "/themes/bblunt-2/locales/pages/fb-advance-smoothening-category-sale",
        routeContext: {
          templateName: "fb-advance-smoothening-category-sale",
          path: "/pages/fb-advance-smoothening-category-sale",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["fb-hair-colour-category-sale"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/fb-hair-colour-category-sale/default.ts",
        translationsPath:
          "/themes/bblunt-2/locales/pages/fb-hair-colour-category-sale",
        routeContext: {
          templateName: "fb-hair-colour-category-sale",
          path: "/pages/fb-hair-colour-category-sale",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["fb-hairfall-category-sale"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/fb-hairfall-category-sale/default.ts",
        translationsPath:
          "/themes/bblunt-2/locales/pages/fb-hairfall-category-sale",
        routeContext: {
          templateName: "fb-hairfall-category-sale",
          path: "/pages/fb-hairfall-category-sale",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["fb-heat-protection-category-sale"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/fb-heat-protection-category-sale/default.ts",
        translationsPath:
          "/themes/bblunt-2/locales/pages/fb-heat-protection-category-sale",
        routeContext: {
          templateName: "fb-heat-protection-category-sale",
          path: "/pages/fb-heat-protection-category-sale",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["fb-intense-moisture-category-sale"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/fb-intense-moisture-category-sale/default.ts",
        translationsPath:
          "/themes/bblunt-2/locales/pages/fb-intense-moisture-category-sale",
        routeContext: {
          templateName: "fb-intense-moisture-category-sale",
          path: "/pages/fb-intense-moisture-category-sale",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES.flat3]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/flat3/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/flat3",
        routeContext: {
          templateName: "flat3",
          path: "/pages/flat3",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES.flat4]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/flat4/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/flat4",
        routeContext: {
          templateName: "flat4",
          path: "/pages/flat4",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["shine-squad-b2g2"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/shine-squad-b2g2/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/shine-squad-b2g2",
        routeContext: {
          templateName: "shine-squad-b2g2",
          path: "/pages/shine-squad-b2g2",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["shine-squad-bb30-offer"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/shine-squad-bb30-offer/default.ts",
        translationsPath:
          "/themes/bblunt-2/locales/pages/shine-squad-bb30-offer",
        routeContext: {
          templateName: "shine-squad-bb30-offer",
          path: "/pages/shine-squad-bb30-offer",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["shine-squad-get999"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/shine-squad-get999/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/shine-squad-get999",
        routeContext: {
          templateName: "shine-squad-get999",
          path: "/pages/shine-squad-get999",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["shine-squad-mega-offer"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/shine-squad-mega-offer/default.ts",
        translationsPath:
          "/themes/bblunt-2/locales/pages/shine-squad-mega-offer",
        routeContext: {
          templateName: "shine-squad-mega-offer",
          path: "/pages/shine-squad-mega-offer",
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

    [TEMPLATE_TYPES["return-policy"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/return-policy/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/return-policy",
        routeContext: {
          templateName: "return-policy",
          path: "/pages/return-policy",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["terms-and-conditions"]]: {
      default: {
        templatePath:
          "/themes/bblunt-2/templates/terms-and-conditions/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/terms-and-conditions",
        routeContext: {
          templateName: "terms-and-conditions",
          path: "/pages/terms-and-conditions",
          params: {},
          query: {},
        },
      },
    },

    [TEMPLATE_TYPES["not-found"]]: {
      default: {
        templatePath: "/themes/bblunt-2/templates/not-found/default.ts",
        translationsPath: "/themes/bblunt-2/locales/pages/not-found",
        routeContext: {
          templateName: "not-found",
          path: "/404",
          params: {},
          query: {},
        },
      },
    },
  },
};
