import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Account Page Template for ratio
 */
export const template: PageConfig = {
  id: "ratio-account",
  dataSources: {},
  sections: [
    // Account Content Section
    {
      id: "account-content-section",
      name: "Account Content",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 27, right: 0, bottom: 27, left: 0 } },
          tablet: { padding: { top: 30, right: 0, bottom: 30, left: 0 } },
          desktop: { padding: { top: 36, right: 0, bottom: 36, left: 0 } },
        },
      },
      widgets: [
        {
          id: "ratio-account-widget",
          name: "Account",
          type: WIDGET_TYPES.Account,
          settings: {
            variant: "v1",
            showGetAppBanner: true,
            getAppBannerTitle: "Get the App",
            getAppBannerSubtitle: "To track your order status smoothly",
            getAppButtonText: "Use app",
            getAppButtonUrl: "https://onelink.to/zwhyy8",
            accountDetailsTitle: "Account details",
            greetingText: "Hello",
            logoutText: "Log out",
            notYouText: "not",
            nameLabel: "Name",
            emailLabel: "Email",
          },
        },
      ],
    },
  ],
};
