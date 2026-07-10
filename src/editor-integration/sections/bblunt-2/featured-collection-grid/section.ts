import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

export default {
  id: "featured-collection-grid-section",
  name: "Featured Collection Grid",
  type: SECTION_TYPES.CONTENT_SECTION,
  isCommon: false,

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
      id: "featured-collection-grid-widget",
      name: "Featured Collection Grid",
      type: WIDGET_TYPES.FeaturedCollectionGrid,
      dataSourceTemplate: {
        type: DATA_SOURCE_TYPES.COLLECTION,
        params: {
          handle: "most-loved-home-page",
        },
        required: false,
      },
      settings: {
        variant: "v1",
        categoryTitle: "t:sections.featured_collection_grid.categoryTitle",
        collectionHandle: "most-loved-home-page",
      },
    },
  ],
};
