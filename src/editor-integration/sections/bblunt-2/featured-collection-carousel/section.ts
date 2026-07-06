import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

export default {
  id: "featured-collection-carousel-section",
  name: "Featured Collection Carousel",
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
      id: "featured-collection-carousel-widget",
      name: "Featured Collection Carousel",
      type: WIDGET_TYPES.FeaturedCollectionCarousel,
      dataSourceTemplate: {
        type: DATA_SOURCE_TYPES.COLLECTION,
        params: {
          handle: "most-loved-home-page",
        },
        options: { params: { productLimit: 12 } },
        required: false,
      },
      settings: {
        variant: "v1",
        heading: "t:sections.featured_collection_carousel.heading",
        actionButtonText: "t:common.product_card.add_to_cart",
        soldOutText: "t:common.product_card.sold_out",
        carouselBreakpoints: [
          { minWidth: 0, cards: 2.25, gap: 0 },
          { minWidth: 768, cards: 2.25, gap: 0 },
          { minWidth: 992, cards: 4, gap: 0 },
          { minWidth: 1150, cards: 5, gap: 0 },
        ],
      },
    },
  ],
};
