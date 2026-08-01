import { THEMES } from "@/editor-integration/theme-constants";
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";

export const themeRegistry = {
  id: "dawn",
  supportedLanguages: ["en"],

  templateStructure: {
    // Dynamic templates
    [TEMPLATE_TYPES.home]: {
      default: {
        templatePath: "/themes/dawn/templates/home/default.ts",
        translationsPath: "/themes/dawn/locales/pages/home",
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
        templatePath: "/themes/dawn/templates/products/default.ts",
        translationsPath: "/themes/dawn/locales/pages/products",
        routeContext: {
          templateName: TEMPLATE_TYPES.products,
          type: "products",
          path: "/products/natural-baby-shampoo-200ml",
          params: { handle: "natural-baby-shampoo-200ml" },
          query: {},
          productHandle: "natural-baby-shampoo-200ml",
          fetchAPITemplate: true,
        },
      },
    },
    [TEMPLATE_TYPES.collection]: {
      default: {
        templatePath: "/themes/dawn/templates/collection/default.ts",
        translationsPath: "/themes/dawn/locales/pages/collections",
        routeContext: {
          templateName: "collection",
          type: "collection",
          path: "/collections/bestsellers",
          params: { handle: "bestsellers" },
          query: {},
        },
      },
    },
    // NOTE: orders, search, account, addresses, and order-history are
    // intentionally NOT registered here. They are account/utility pages that
    // should not appear as editable templates in the visual editor's template
    // dropdown. Their routes still render normally at runtime — they're just
    // excluded from theme migration (migrate:theme) so the editor doesn't list
    // them. Re-add an entry here only if a page should become editor-editable.
    ["about-us"]: {
      default: {
        templatePath: "/themes/dawn/templates/about-us/default.ts",
        translationsPath: "/themes/dawn/locales/pages/about-us",
        routeContext: {
          templateName: "about-us",
          type: "about-us",
          path: "/about-us",
          params: {},
          query: {},
        },
      },
    },
    // Shared layout chrome — rendered once by the root layout via renderChrome()
    // (templates/header, templates/footer), not as page sections. routeContext.type
    // must be exactly "header"/"footer": the visual editor keys on it.
    [TEMPLATE_TYPES.header]: {
      default: {
        templatePath: "/themes/dawn/templates/header/default.ts",
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
        templatePath: "/themes/dawn/templates/footer/default.ts",
        routeContext: {
          templateName: "footer",
          type: "footer",
          path: "/",
          params: {},
          query: {},
        },
      },
    },
    // Static templates
    [THEMES.DAWN.static_templates.PRIVACY_POLICY]: {
      default: {
        translationsPath: "/themes/dawn/locales/pages/privacy-policy",
      },
    },
    [THEMES.DAWN.static_templates.SHIPPING_POLICY]: {
      default: {
        translationsPath: "/themes/dawn/locales/pages/shipping-policy",
      },
    },
    [THEMES.DAWN.static_templates.CANCELLATION_POLICY]: {
      default: {
        translationsPath: "/themes/dawn/locales/pages/cancellation-policy",
      },
    },
    [THEMES.DAWN.static_templates.TERMS_OF_USE]: {
      default: {
        translationsPath: "/themes/dawn/locales/pages/terms-of-use",
      },
    },
  },
};
