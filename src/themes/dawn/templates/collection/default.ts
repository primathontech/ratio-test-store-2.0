import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Collection Page Template for dawn
 * Adapted from bblunt collection template
 */
export const template: PageConfig = {
  id: "dawn-collection",
  dataSources: {
    // Static header data source - no API calls needed
    headerData: {
      type: DATA_SOURCE_TYPES.STATIC,
      params: {
        brandName: "Dawn",
        homePageUrl: "/",
      },
      required: true,
    },
    // Collection data source - fetches collection by handle from route params
    collectionData: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        first: 12,
      },
      required: true,
    },
  },
  sections: [
    // Announcement Bar Section
    {
      id: "announcement-bar-section",
      name: "Announcement Bar",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "announcement-bar-widget",
          name: "Announcement Bar V2",
          type: WIDGET_TYPES.AnnouncementBar,
          settings: {
            variant: "v2",
            enableSlider: true,
            backgroundColor: "#C5CAFF",
            fontColor: "#1D1D1D",
            fontColorMobile: "#000",
            texts: "t:common.announcement-bar__rich",
            autoplay: false,
            autoplayInterval: 4000,
            infinite: true,
            width: "100%",
            showNavigationArrows: true,
            navigationPosition: "inside",
            navigationIconStyle: "chevron",
            enableDragScroll: true,
            dragSensitivity: 50,
            navigationArrowColor: "#000",
            navigationArrowBackgroundColor: "transparent",
            navigationArrowSize: "16px",
            heightMobile: "30px",
            heightDesktop: "34px",
            fontSizeMobile: "12px",
            fontSizeDesktop: "14px",
          },
        },
      ],
    },

    // Header Section
    {
      id: "header-section",
      name: "Header",
      type: SECTION_TYPES.HEADER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.PAGE,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "header-widget",
          name: "Header",
          type: WIDGET_TYPES.Header,
          dataSourceKey: "headerData",
          settings: {
            variant: "v2",
            isFixed: true,
            height: 65,
            logoWidth: 136,
            showCartIcon: true,
            showLanguageSwitcher: true,
            backgroundColor: "#ffffff",
            textColor: "#000000",
            // Navigation translations
            navigation: "t:common.header.navigation",
            search: "t:common.header.search",
            userActions: "t:common.header.user_actions",
            accessibility: "t:common.header.accessibility",
            tooltips: "t:common.header.tooltips",
            connectWithUs: "t:common.header.connect_with_us",
            getApp: "t:common.header.get_app",
          },
        },
      ],
    },

    // Banner Carousel Section
    {
      id: "banner-carousel-section",
      name: "Banner Carousel",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "banner-carousel-widget",
          name: "Collection Banner Carousel",
          type: WIDGET_TYPES.BannerCarousel,
          settings: {
            variant: "v1",
            bannerCarousel: "t:dawn_collection_default.banner_carousel",
            autoplay: true,
            autoplayInterval: 5000,
            loop: true,
            pauseOnHover: true,
            draggable: true,
            showIndicators: true,
            indicatorType: "simple",
            mobileAspectRatio: "294/165",
            desktopAspectRatio: "155/57",
          },
        },
      ],
    },

    // Collection Widget Section
    {
      id: "collection-widget-section",
      name: "Collection Widget",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "collection-widget",
          name: "Collection Widget",
          type: WIDGET_TYPES.CollectionWidget,
          dataSourceKey: "collectionData",
          settings: {
            variant: "v1",
            autoLoadMore: true,
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            actionButtonTextMobile:
              "t:common.product_card.add_to_cart_button_text_mobile",
            soldOutText: "t:common.product_card.sold_out_text",
            soldOutTextMobile: "t:common.product_card.sold_out_text_mobile",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            sectionTextColor: "#1D1D1D",
            filterTitle: "t:common.collection_page.filter_title",
            sortDropdownText:
              "t:common.collection_page.sort_dropdown_button_text",
          },
        },
      ],
    },

    // Testimonials Section
    {
      id: "testimonials-section",
      name: "Customer Testimonials",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 40, right: 0, bottom: 56, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 56, left: 0 } },
          desktop: { padding: { top: 100, right: 0, bottom: 125, left: 0 } },
        },
      },
      widgets: [
        {
          id: "testimonials-widget",
          name: "Customer Testimonials Carousel",
          type: WIDGET_TYPES.Testimonials,
          settings: {
            variant: "v1",
            heading: "t:common.testimonials.heading__rich",
            subheading: "t:common.testimonials.subheading",
            testimonials: "t:common.testimonials.list",
            autoplay: false,
            loop: false,
            pauseOnHover: true,
            interval: 5000,
            showArrows: true,
            arrowSize: 46,
            arrowOffsetX: -24,
            arrowOffsetY: 0,
            showIndicators: false,
            slidesPerView: 3,
            mobileSlidesPerView: 1.3,
            spacing: 22,
            cardVariant: "bblunt",
          },
        },
      ],
    },

    // Footer Section
    {
      id: "footer-section",
      name: "Footer",
      type: SECTION_TYPES.FOOTER_SECTION,
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
          id: "footer-widget",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          settings: {
            variant: "v1",
            backgroundColor: "#000000",
            showSocialLinks: true,
            showPaymentMethods: true,
            showAppDownload: true,
            // Footer content translations
            mobileFooterTagline: "t:common.footer.mobileFooterTagline__rich",
            logoUrl: "t:common.footer.logoUrl",
            logoAlt: "t:common.footer.logoAlt",
            appDownloadText: "t:common.footer.appDownloadText",
            googlePlayUrl: "t:common.footer.googlePlayUrl",
            appStoreUrl: "t:common.footer.appStoreUrl",
            googlePlayImage: "t:common.footer.googlePlayImage",
            googlePlayAlt: "t:common.footer.googlePlayAlt",
            appStoreImage: "t:common.footer.appStoreImage",
            appStoreAlt: "t:common.footer.appStoreAlt",
            serviceSectionsIcons: "t:common.footer.serviceSectionsIcons",
            aboutTitle: "t:common.footer.aboutTitle",
            aboutLinks: "t:common.footer.aboutLinks",
            usefulLinksTitle: "t:common.footer.usefulLinksTitle",
            usefulLinks: "t:common.footer.usefulLinks",
            ourSalonsTitle: "t:common.footer.ourSalonsTitle",
            ourSalonsLinks: "t:common.footer.ourSalonsLinks",
            categoriesTitle: "t:common.footer.categoriesTitle",
            categoriesLinks: "t:common.footer.categoriesLinks",
            myAccountTitle: "t:common.footer.myAccountTitle",
            myAccountLinks: "t:common.footer.myAccountLinks",
            socialLinks: "t:common.footer.socialLinks",
            paymentProtectionText: "t:common.footer.paymentProtectionText",
            copyrightText: "t:common.footer.copyrightText",
            paymentMethods: "t:common.footer.paymentMethods",
          },
        },
      ],
    },
  ],
};
