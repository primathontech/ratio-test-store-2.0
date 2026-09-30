import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Contact Us page template for ratio.
 * Content-driven via the generic PageContent widget + locale data.
 */
export const template: PageConfig = {
  id: "ratio-contact",
  dataSources: {},
  sections: [
    {
      id: "contact-section",
      name: "Contact Us",
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
          id: "ratio-contact-content",
          name: "Contact Us Content",
          type: WIDGET_TYPES.PageContent,
          settings: {
            variant: "v1",
            eyebrow: "t:ratio_contact_default.eyebrow",
            title: "t:ratio_contact_default.title",
            subtitle: "t:ratio_contact_default.subtitle",
            contact: "t:ratio_contact_default.contact",
            sections: "t:ratio_contact_default.sections",
          },
        },
      ],
    },
  ],
};
