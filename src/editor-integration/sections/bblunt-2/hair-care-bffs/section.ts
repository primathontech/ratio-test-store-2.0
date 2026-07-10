import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

export default {
  id: "hair-care-bffs-section",
  name: "Hair Care BFFs",
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
      id: "hair-care-bffs-widget",
      name: "Hair Care BFFs",
      type: WIDGET_TYPES.HairCareBFFs,
      dataSourceTemplate: {
        type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
        params: {
          handles: [
            "most-loved-home-page",
            "shampoo-haircarebffs",
            "shampoo-haircarebffs-copy",
            "spray-haircarebffs",
            "salon-haircarebffs",
            "hair-mask-haircarebffs",
          ],
        },
        options: { params: { productLimit: 12 } },
        required: false,
      },
      settings: {
        variant: "v1",
        heading: "t:sections.hair_care_bffs.heading__rich",
        backgroundImage: "t:sections.hair_care_bffs.backgroundImage",
        backgroundImageMobile:
          "t:sections.hair_care_bffs.backgroundImageMobile",
        actionButtonText: "t:common.product_card.add_to_cart",
        soldOutText: "t:common.product_card.sold_out",
        collections: "t:sections.hair_care_bffs.collections",
        carouselBreakpoints: [
          { minWidth: 0, cards: 2.1, gap: 0 },
          { minWidth: 768, cards: 2.1, gap: 0 },
          { minWidth: 992, cards: 4, gap: 0 },
          { minWidth: 1150, cards: 5, gap: 0 },
        ],
      },
    },
  ],
};
