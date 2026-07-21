import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Order Details Page Template for ratio
 */
export const template: PageConfig = {
  id: "ratio-order-details",
  dataSources: {},
  sections: [
    // Order Details Content Section
    {
      id: "order-details-content-section",
      name: "Order Details Content",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 24, left: 0 } },
          tablet: { padding: { top: 32, right: 24, bottom: 32, left: 24 } },
          desktop: { padding: { top: 36, right: 0, bottom: 36, left: 0 } },
        },
      },
      widgets: [
        {
          id: "ratio-order-details-widget",
          name: "Order Details",
          type: WIDGET_TYPES.OrderDetails,
          settings: {
            variant: "v1",
            showGetAppBanner: true,
            getAppBannerTitle: "Get the App",
            getAppBannerSubtitle: "To track your order status smoothly",
            getAppButtonText: "Use app",
            getAppButtonUrl: "https://onelink.to/zwhyy8",
            greetingText: "Hello",
            logoutText: "Log out",
            notYouText: "not",
          },
        },
      ],
    },
  ],
};
