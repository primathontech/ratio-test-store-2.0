import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Orders Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-orders",
  dataSources: {},
  sections: [
    // Orders / Thank You Section (no header/footer — ThankYou has its own)
    {
      id: "orders-section",
      name: "Orders",
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
          id: "nintarababy-orders",
          name: "Orders",
          type: WIDGET_TYPES.Orders,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
