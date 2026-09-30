import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Footer chrome template for ratio.
 *
 * Shared layout chrome (Shopify "footer-group" model). Rendered once by the
 * root layout via `renderChrome()` and placed below page content on every page.
 * Page templates must NOT include a footer section.
 */
export const template: PageConfig = {
  id: "ratio-footer",
  dataSources: {},
  sections: [
    // Footer Section
    {
      id: "footer-section",
      name: "Footer",
      type: SECTION_TYPES.FOOTER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "ratio-footer",
          name: "Footer",
          type: WIDGET_TYPES.RatioFooter,
          settings: {
            variant: "v1",
            // Per-section nav-menu handles (admin-managed via useNav). Section
            // links come from these menus; titles stay from the *Title settings.
            aboutMenuHandle: "about-us",
            usefulLinksMenuHandle: "useful-links",
            ourSalonsMenuHandle: "our-salons",
            categoriesMenuHandle: "categories",
            myAccountMenuHandle: "my-account",
            mobileFooterTagline: "t:common.footer.mobileFooterTagline__rich",
            logoUrl: "t:common.footer.logoUrl",
            logoAlt: "t:common.footer.logoAlt",
            appDownloadText: "t:common.footer.appDownloadText",
            googlePlayUrl: "t:common.footer.googlePlayUrl",
            appStoreUrl: "t:common.footer.appStoreUrl",
            googlePlayImage: "t:common.footer.googlePlayImage",
            googlePlayAlt: "t:common.footer.googlePlayAlt",
            appStoreImage: "t:common.footer.appStoreImage",
            appStoreAlt: "t:common.footer.appStoreAlt",
            serviceSectionsIcons: "t:common.footer.serviceSectionsIcons",
            socialLinks: "t:common.footer.socialLinks",
            paymentProtectionText: "t:common.footer.paymentProtectionText",
            copyrightText: "t:common.footer.copyrightText",
            paymentMethods: "t:common.footer.paymentMethods",
          },
        },
      ],
    },
  ],
};
