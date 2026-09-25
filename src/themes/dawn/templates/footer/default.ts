import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Footer chrome template for dawn (momsco).
 *
 * Shared layout chrome (Shopify "footer-group" model): footer + bottom bar
 * (copyright). Rendered once by the root layout via `renderChrome()` and placed
 * below page content on every page. Page templates must NOT include these sections.
 */
export const template: PageConfig = {
  id: "dawn-footer",
  dataSources: {
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [
    // Footer Section (Nintara Baby)
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
          id: "nintarababy-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          dataSourceKey: "collectionDataAll",
          settings: {
            variant: "v1",
            seoHeading: "t:common.footer.seoHeading",
            contactAddress: "t:common.footer.contactAddress",
            contactWhatsapp: "t:common.footer.contactWhatsapp",
            contactEmail: "t:common.footer.contactEmail",
            contactUsHeading: "t:common.footer.contactUsHeading",
            registeredOfficeLabel: "t:common.footer.registeredOfficeLabel",
            whatsappUsLabel: "t:common.footer.whatsappUsLabel",
            emailUsLabel: "t:common.footer.emailUsLabel",
            categoriesHeading: "t:common.footer.categoriesHeading",
            helpHeading: "t:common.footer.helpHeading",
            otherLinksHeading: "t:common.footer.otherLinksHeading",
            newsletterHeading: "t:common.footer.newsletterHeading",
            facebookUrl: "t:common.footer.facebookUrl",
            instagramUrl: "t:common.footer.instagramUrl",
            helpLinks: "t:common.footer.helpLinks",
            otherLinks: "t:common.footer.otherLinks",
            categoryLinks: "t:common.footer.categoryLinks",
          },
        },
      ],
    },

    // Bottom Bar Section (Copyright)
    {
      id: "bottom-bar-section",
      name: "BottomBar",
      type: SECTION_TYPES.CONTENT_SECTION,
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
          id: "nintarababy-bottom-bar",
          name: "BottomBar",
          type: WIDGET_TYPES.BottomBar,
          settings: {
            variant: "v1",
            copyrightText: "t:common.bottom_bar.copyrightText",
          },
        },
      ],
    },
  ],
};
