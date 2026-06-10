import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Header chrome template for dawn.
 *
 * Shared layout chrome (Shopify "header-group" model). Rendered once by the
 * root layout via `renderChrome()` and placed above page content on every page.
 * Page templates must NOT include a header section.
 */
export const template: PageConfig = {
  id: "dawn-header",
  dataSources: {},
  sections: [
    {
      id: "header-section",
      name: "Header",
      type: SECTION_TYPES.HEADER_SECTION,
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
          id: "dawn-header",
          name: "Header",
          type: WIDGET_TYPES.Header,
          settings: { variant: "v1", menuHandle: "main-menu", brandName: "Store" },
        },
      ],
    },
  ],
};
