import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "sale-page-banner-section",
  name: "Sale Page Banner",
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
      id: "sale-page-banner-widget",
      name: "Sale Page Banner",
      type: WIDGET_TYPES.SalePageBanner,
      settings: {
        variant: "v1",
        timerInterval: 1000,
        mobileSrc: "t:sections.sale_page_banner.mobileSrc",
        desktopSrc: "t:sections.sale_page_banner.desktopSrc",
        offerTitle: "t:sections.sale_page_banner.offer.title",
        offerPrice: "t:sections.sale_page_banner.offer.price",
        currencySymbol: "t:sections.sale_page_banner.offer.currencySymbol",
        couponCode: "t:sections.sale_page_banner.offer.couponCode",
        expiryText: "t:sections.sale_page_banner.offer.expiryText",
        endDateString: "t:sections.sale_page_banner.countdown",
        bannerCtaLabel: "t:sections.sale_page_banner.banner_cta",
        howToShopTitle: "t:sections.sale_page_banner.how_to_shop_title",
        howToShopSteps: "t:sections.sale_page_banner.how_to_shop_steps__rich",
        termsAndConditionsTitle:
          "t:sections.sale_page_banner.terms_and_conditions.title",
        termsAndConditionsPoints:
          "t:sections.sale_page_banner.terms_and_conditions.points",
        primaryButtonLabel: "t:sections.sale_page_banner.primary_button",
      },
    },
  ],
};
