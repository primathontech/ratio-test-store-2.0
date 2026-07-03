import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Privacy Policy Page Template for bblunt-2
 */
export const template: PageConfig = {
  id: "bblunt-2-privacy-policy",
  dataSources: {},
  sections: [
    // Privacy Policy Content Section
    {
      id: "privacy-policy-content-section",
      name: "Privacy Policy Content",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 15, right: 15, bottom: 12, left: 15 } },
          tablet: { padding: { top: 17, right: 30, bottom: 14, left: 30 } },
          desktop: { padding: { top: 20, right: 30, bottom: 17, left: 30 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-privacy-policy-content",
          name: "Privacy Policy Content",
          type: WIDGET_TYPES.RichText,
          settings: {
            variant: "v1",
            body: "t:bblunt-2_privacy-policy_default.content__rich",
          },
        },
      ],
    },

    // Delete Account Section
    {
      id: "privacy-policy-delete-account-section",
      name: "Delete Account",
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
          id: "bblunt-2-privacy-policy-delete-account",
          name: "Delete Account",
          type: WIDGET_TYPES.DeleteAccount,
          settings: {
            variant: "v1",
            heading: "t:common.deleteAccount.heading",
            description: "t:common.deleteAccount.description",
            submitLabel: "t:common.deleteAccount.submitLabel",
            successMessage: "t:common.deleteAccount.successMessage",
          },
        },
      ],
    },
  ],
};
