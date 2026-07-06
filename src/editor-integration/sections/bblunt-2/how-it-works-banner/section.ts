import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "how-it-works-banner-section",
  name: "How It Works Banner",
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
      id: "how-it-works-banner-widget",
      name: "How It Works Banner",
      type: WIDGET_TYPES.HowItWorksBanner,
      settings: {
        variant: "v1",
        desktopImage: "t:sections.how_it_works_banner.desktopImage",
        mobileImage: "t:sections.how_it_works_banner.mobileImage",
        alt: "t:sections.how_it_works_banner.alt",
        mobileAspectRatio: "t:sections.how_it_works_banner.mobileAspectRatio",
        desktopAspectRatio: "t:sections.how_it_works_banner.desktopAspectRatio",
      },
    },
  ],
};
