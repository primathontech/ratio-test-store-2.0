import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS, DATA_SOURCE_TYPES } from "@shopkit/builder";

/**
 * Collection Page Template B (Variant) for dawn
 */
export const template: PageConfig = {
  id: "dawn-collection-b",
  dataSources: {
    collection: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {},
      required: true,
    },
  },
  sections: [
    // Header Section (empty - Header widget not yet created)
    {
      id: "header-section",
      name: "Header",
      type: SECTION_TYPES.HEADER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [],
    },

    // Collection Products Section B
    {
      id: "collection-products-section-b",
      name: "Collection Products B",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 40, right: 0, bottom: 40, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 56, left: 0 } },
          desktop: { padding: { top: 80, right: 0, bottom: 80, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-collection-products-b",
          name: "Collection Products Grid",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "collection",
          settings: {
            variant: "v1",
            heading: "",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            showBadge: true,
            showRating: true,
            autoplay: false,
            infinite: false,
            iconStyle: "arrow",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            viewAllButtonText: "t:common.collection_page.view_all_button_text",
            redirectionLink: "/collections/all",
          },
        },
      ],
    },

    // Footer Section
    {
      id: "footer-section",
      name: "Footer",
      type: SECTION_TYPES.FOOTER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
