import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Not Found (404) Page Template for ratio
 */
export const template: PageConfig = {
  id: "ratio-not-found",
  dataSources: {},
  sections: [
    // Not Found Content Section
    {
      id: "not-found-section",
      name: "Not Found",
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
          id: "ratio-not-found",
          name: "Not Found",
          type: WIDGET_TYPES.NotFound,
          settings: {
            variant: "v1",
            errorCode: "t:ratio_not-found_default.not_found.errorCode",
            heading: "t:ratio_not-found_default.not_found.heading",
            description: "t:ratio_not-found_default.not_found.description",
            buttonText: "t:ratio_not-found_default.not_found.buttonText",
            buttonHref: "t:ratio_not-found_default.not_found.buttonHref",
          },
        },
      ],
    },
  ],
};
