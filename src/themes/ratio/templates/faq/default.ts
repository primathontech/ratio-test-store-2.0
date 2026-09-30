import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * FAQ page template for ratio.
 * Content-driven via the generic PageContent widget + locale data
 * (each section is a question/answer pair).
 */
export const template: PageConfig = {
  id: "ratio-faq",
  dataSources: {},
  sections: [
    {
      id: "faq-section",
      name: "FAQ",
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
          id: "ratio-faq-content",
          name: "FAQ Content",
          type: WIDGET_TYPES.PageContent,
          settings: {
            variant: "v1",
            eyebrow: "t:ratio_faq_default.eyebrow",
            title: "t:ratio_faq_default.title",
            subtitle: "t:ratio_faq_default.subtitle",
            sections: "t:ratio_faq_default.sections",
          },
        },
      ],
    },
  ],
};
