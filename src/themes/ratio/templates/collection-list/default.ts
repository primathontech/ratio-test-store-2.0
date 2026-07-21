import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Collections List Page Template (ratio)
 *
 * Lists all collections in a paginated grid. Pagination is controlled
 * client-side via `?page=` URL parameter; the SSR data source returns
 * the full list (up to a generous max), and the widget slices per page.
 */
export const template: PageConfig = {
  id: "ratio-collection-list",
  dataSources: {
    collectionsData: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: {},
      options: { params: { page: 1, limit: 6 } },
      required: true,
    },
  },
  sections: [
    // Collection List Section
    {
      id: "collection-list-section",
      name: "Collection List",
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
          id: "ratio-collection-list",
          name: "Collection List",
          type: WIDGET_TYPES.CollectionList,
          dataSourceKey: "collectionsData",
          settings: {
            variant: "v1",
            heading: "Collections",
            pageSize: 6,
          },
        },
      ],
    },
  ],
};
