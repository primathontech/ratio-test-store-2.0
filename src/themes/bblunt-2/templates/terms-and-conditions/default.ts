import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Terms & Conditions Page Template for bblunt-2
 */
export const template: PageConfig = {
  id: "bblunt-2-terms-and-conditions",
  dataSources: {},
  sections: [
    // SEO Metadata Section
    {
      id: "seo-metadata-section",
      name: "SEO Metadata",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "seo-metadata-widget",
          name: "SEO Metadata",
          type: WIDGET_TYPES.SEOMetadata,
          settings: {
            variant: "v1",
            title: "t:bblunt-2_terms-and-conditions_default.seo_metadata.title",
            description:
              "t:bblunt-2_terms-and-conditions_default.seo_metadata.description",
            canonical:
              "t:bblunt-2_terms-and-conditions_default.seo_metadata.canonical",
          },
        },
      ],
    },

    // Terms & Conditions Content Section
    {
      id: "terms-and-conditions-content-section",
      name: "Terms & Conditions Content",
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
          id: "bblunt-2-terms-and-conditions-content",
          name: "Terms & Conditions Content",
          type: WIDGET_TYPES.RichText,
          settings: {
            variant: "v1",
            body: "t:bblunt-2_terms-and-conditions_default.content__rich",
          },
        },
      ],
    },

    // Delete Account Section
    {
      id: "terms-and-conditions-delete-account-section",
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
          id: "bblunt-2-terms-and-conditions-delete-account",
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
