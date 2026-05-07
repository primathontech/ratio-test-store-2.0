import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Order Details Page Template for bblunt-2
 */
export const template: PageConfig = {
  id: "bblunt-2-order-details",
  dataSources: {},
  sections: [
    // Header Section
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
          id: "bblunt-2-header",
          name: "Header",
          type: WIDGET_TYPES.Header,
          settings: { variant: "v1" },
        },
      ],
    },

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
          id: "bblunt-2-order-details-widget",
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

    // Footer Section
    {
      id: "footer-section",
      name: "Footer",
      type: SECTION_TYPES.FOOTER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
