import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "shine-academy-banner-section",
  name: "Shine Academy Banner",
  type: SECTION_TYPES.CONTENT_SECTION,
  isCommon: true,

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
      id: "bblunt-2-shine-academy-banner",
      name: "Shine Academy Banner",
      type: WIDGET_TYPES.ShineAcademyBanner,
      settings: {
        variant: "v1",
        logoSrc: "t:common.shine_academy_banner.logoSrc",
        logoAlt: "t:common.shine_academy_banner.logoAlt",
        tagline: "t:common.shine_academy_banner.tagline",
        mosaicSrcDesktop: "t:common.shine_academy_banner.mosaicSrcDesktop",
        mosaicSrcMobile: "t:common.shine_academy_banner.mosaicSrcMobile",
        mosaicAlt: "t:common.shine_academy_banner.mosaicAlt",
      },
    },
  ],
};
