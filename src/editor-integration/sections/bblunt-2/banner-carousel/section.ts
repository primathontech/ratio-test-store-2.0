import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "banner-carousel-section",
  name: "Banner Carousel",
  type: SECTION_TYPES.CONTENT_SECTION,
  isCommon: false,

  settings: {
    layout: SECTION_LAYOUT_OPTIONS.FULL,
    responsive: {
      mobile: {
        margin: { top: -58, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      tablet: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      desktop: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
    },
  },

  widgets: [
    {
      id: "bblunt-2-banner-carousel",
      name: "Banner Carousel",
      type: WIDGET_TYPES.BannerCarousel,
      settings: {
        variant: "v1",
        autoplayInterval: 5000,
        autoplay: true,
        loop: true,
        pauseOnHover: true,
        draggable: true,
        showIndicators: true,
        indicatorType: "media",
        mobileAspectRatio: "1/1",
        desktopAspectRatio: "1440/529",
        bannerCarousel: "t:sections.banner_carousel.items",
      },
    },
  ],
};
