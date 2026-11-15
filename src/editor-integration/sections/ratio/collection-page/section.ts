import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

export default {
  id: "collection-page-section",
  name: "Collection Widget",
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
      id: "collection-page-widget",
      name: "Collection Widget",
      type: WIDGET_TYPES.CollectionPage,
      dataSourceTemplate: {
        type: DATA_SOURCE_TYPES.COLLECTION,
        params: { handle: "" },
        options: {
          version: "v2",
          params: { first: 12 },
        },
        required: false,
      },
      settings: {
        variant: "v1",
        autoLoadMore: false,
        showFilterAndSort: false,
        showActionButton: true,
        actionButtonText: "t:common.product_card.add_to_cart",
        soldOutText: "t:common.product_card.sold_out",
        showBadge: true,
        showRating: true,
        actionButtonTextColor: "#ffffff",
        sectionTextColor: "#1D1D1D",
        title: "t:sections.collection_page.title",
      },
    },
  ],
};
