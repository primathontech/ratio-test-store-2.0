import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "shop-by-categories-section",
  name: "Shop by Categories",
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
      id: "bblunt-2-shop-by-categories",
      name: "Shop by Categories",
      type: WIDGET_TYPES.ShopByCategories,
      settings: {
        variant: "v1",
        heading: "t:sections.shop_by_categories.heading__rich",
        tiles: "t:sections.shop_by_categories.tiles",
      },
    },
  ],
};
