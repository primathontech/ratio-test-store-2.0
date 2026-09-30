import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Terms of Service page template for ratio.
 * Content-driven via the generic PageContent widget + locale data.
 */
export const template: PageConfig = {
  id: "ratio-terms-of-service",
  dataSources: {},
  sections: [
    {
      id: "terms-of-service-section",
      name: "Terms of Service",
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
          id: "ratio-terms-of-service-content",
          name: "Terms of Service Content",
          type: WIDGET_TYPES.PageContent,
          settings: {
            variant: "v1",
            eyebrow: "t:ratio_terms-of-service_default.eyebrow",
            title: "t:ratio_terms-of-service_default.title",
            subtitle: "t:ratio_terms-of-service_default.subtitle",
            updatedAt: "t:ratio_terms-of-service_default.updatedAt",
            sections: "t:ratio_terms-of-service_default.sections",
          },
        },
      ],
    },
  ],
};
