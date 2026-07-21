import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "hero-banner-section",
  name: "Hero Banner",
  type: SECTION_TYPES.CONTENT_SECTION,
  isCommon: false,

  settings: {
    layout: SECTION_LAYOUT_OPTIONS.FULL,
    responsive: {
      mobile: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      tablet: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      desktop: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
    },
  },

  widgets: [
    {
      id: "hero-banner-widget",
      name: "Hero Banner",
      type: WIDGET_TYPES.HeroBanner,
      settings: {
        variant: "v1",
        desktopImage: "t:sections.hero_banner.desktopImage",
        mobileImage: "t:sections.hero_banner.mobileImage",
        alt: "t:sections.hero_banner.alt",
        mobileAspectRatio: "t:sections.hero_banner.mobileAspectRatio",
        desktopAspectRatio: "t:sections.hero_banner.desktopAspectRatio",
      },
    },
  ],
};
