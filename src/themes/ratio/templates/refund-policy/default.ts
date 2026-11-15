import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Refund & Return Policy page template for ratio.
 * Content-driven via the generic PageContent widget + locale data.
 */
export const template: PageConfig = {
  id: "ratio-refund-policy",
  dataSources: {},
  sections: [
    {
      id: "refund-policy-section",
      name: "Refund & Return Policy",
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
          id: "ratio-refund-policy-content",
          name: "Refund & Return Policy Content",
          type: WIDGET_TYPES.PageContent,
          settings: {
            variant: "v1",
            eyebrow: "t:ratio_refund-policy_default.eyebrow",
            title: "t:ratio_refund-policy_default.title",
            subtitle: "t:ratio_refund-policy_default.subtitle",
            updatedAt: "t:ratio_refund-policy_default.updatedAt",
            sections: "t:ratio_refund-policy_default.sections",
          },
        },
      ],
    },
  ],
};
