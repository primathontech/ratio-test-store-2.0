import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "shop-by-concerns-section",
  name: "Shop by Concerns",
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
      id: "bblunt-2-shop-by-concerns",
      name: "Shop by Concerns",
      type: WIDGET_TYPES.ShopByConcerns,
      settings: {
        variant: "v1",
        heading: "t:sections.shop_by_concerns.heading__rich",
        tiles: "t:sections.shop_by_concerns.tiles",
      },
    },
  ],
};
