import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Orders Page Template for ratio
 */
export const template: PageConfig = {
  id: "ratio-orders",
  dataSources: {},
  sections: [
    // Main Content Section
    {
      id: "main-content-section",
      name: "Main Content",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.PAGE,
        responsive: {
          mobile: { padding: { top: 16, right: 16, bottom: 16, left: 16 } },
          tablet: { padding: { top: 24, right: 24, bottom: 24, left: 24 } },
          desktop: { padding: { top: 32, right: 32, bottom: 32, left: 32 } },
        },
      },
      widgets: [
        {
          id: "ratio-orders-content",
          name: "Page Content",
          type: WIDGET_TYPES.PageContent,
          settings: {
            variant: "v1",
            title: "t:orders.heading",
            subtitle: "t:orders.description",
          },
        },
      ],
    },
  ],
};
