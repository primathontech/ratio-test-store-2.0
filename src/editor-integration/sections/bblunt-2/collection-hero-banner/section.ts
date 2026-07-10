import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

export default {
  id: "collection-hero-banner-section",
  name: "Collection Hero Banner",
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
      id: "collection-hero-banner-widget",
      name: "Collection Hero Banner",
      type: WIDGET_TYPES.CollectionHeroBanner,
      dataSourceTemplate: {
        type: DATA_SOURCE_TYPES.COLLECTION,
        params: { handle: "colour-bundles" },
        required: false,
      },
      settings: {
        variant: "v1",
        autoplay: true,
        autoplayInterval: 5000,
        loop: true,
        pauseOnHover: true,
        draggable: true,
        showIndicators: true,
        indicatorType: "simple",
        mobileAspectRatio:
          "t:sections.collection_hero_banner.mobileAspectRatio",
        desktopAspectRatio:
          "t:sections.collection_hero_banner.desktopAspectRatio",
      },
    },
  ],
};
