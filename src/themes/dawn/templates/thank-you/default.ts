import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Thank-you Page Template for dawn
 *
 * Rendered at /thank-you after a successful checkout. The ThankYou widget
 * reads orderId/requestId/customerId from the URL search params and fetches
 * order details from /api/v1/order. The widget renders its own brand logo
 * and footer, so no Header/Footer sections are included here.
 */
export const template: PageConfig = {
  id: "dawn-thank-you",
  dataSources: {},
  sections: [
    {
      id: "thank-you-section",
      name: "Thank You Content",
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
          id: "dawn-thank-you",
          name: "Thank You",
          type: WIDGET_TYPES.ThankYou,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
