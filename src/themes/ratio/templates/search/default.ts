import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Search Page Template for ratio
 * URL: /pages/searchtap-search?q=<query>
 *
 * Renders the Search widget which reads `q` from the URL and shows a
 * filterable, sortable grid of (currently dummy) search results.
 */
export const template: PageConfig = {
  id: "ratio-search",
  dataSources: {},
  sections: [
    // Search Section
    {
      id: "search-section",
      name: "Search",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 8, bottom: 16, left: 8 } },
          tablet: { padding: { top: 0, right: 15, bottom: 0, left: 15 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "ratio-search",
          name: "Search",
          type: WIDGET_TYPES.Search,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
