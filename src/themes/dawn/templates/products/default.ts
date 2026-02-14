import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Product Page Template for dawn
 * Adapted from bblunt products template
 */
export const template: PageConfig = {
  id: "dawn-product",
  dataSources: {
    headerData: {
      type: DATA_SOURCE_TYPES.STATIC,
      params: {
        brandName: "Dawn",
        homePageUrl: "/",
      },
      required: true,
    },
    productData: {
      type: DATA_SOURCE_TYPES.PRODUCT,
      params: {},
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

    // Product Gallery with Info Section
    {
      id: "product-gallery-with-info-section",
      name: "Product Gallery with Info",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 30, right: 0, bottom: 20, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 26, left: 0 } },
          desktop: { padding: { top: 40, right: 0, bottom: 40, left: 0 } },
        },
      },
      widgets: [
        {
          id: "product-gallery-with-info-widget",
          name: "Product Gallery with Info",
          type: WIDGET_TYPES.ProductGalleryWithInfo,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            addToCartText: "t:product_info.product.add_to_cart",
            netContentText: "t:product_info.product.net_content",
            inclusiveOfAllTaxesText:
              "t:product_info.product.inclusive_of_all_taxes",
            reviewsText: "t:product_info.product.reviews",
            mrp: "t:product_info.product.mrp",
            usp: "t:product_info.product.usp",
            discount: "t:product_info.product.discount",
            selectSizeText: "t:product_info.product.select_size",
            soldOutText: "t:product_info.product.sold_out",
            rupeeSymbol: "₹",
            productGallery: {
              variant: "v1",
              layout: "vertical",
              mainImageRadius: 16,
              mobileMainImageRadius: 16,
              showNavigationArrows: true,
              navigationArrowSize: 46,
              navigationArrowBgColor: "#ffffff",
              navigationArrowIconColor: "#000000",
              navigationArrowShape: "circle",
              thumbnailSize: "81px",
              mobileThumbnailSize: "18.5%",
              thumbnailRadius: 6,
              thumbnailSpacing: 16,
              mobileThumbnailSpacing: 10,
              activeThumbnailBorderColor: "#000000",
              activeThumbnailBorderWidth: 2,
              thumbnailsPerRow: 4,
              thumbnailLayout: "single-row",
              showThumbnailArrows: false,
              enableHoverPreview: true,
              autoPlay: false,
              autoPlayInterval: 1500,
              autoPlayAnimation: "slide-left",
              pauseOnHover: true,
              showExpandIcon: false,
              enableZoom: true,
              lightboxBgColor: "rgba(255, 255, 255)",
              lightboxOverlayOpacity: 1,
              enablePinchZoom: true,
              zoomIconColor: "#000",
            },
          },
        },
      ],
    },

    // Reason to Love Section
    {
      id: "reason-to-love-section",
      name: "Reason To Love",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "product-page-image-section",
          name: "Reason to love",
          type: WIDGET_TYPES.ReasonToLoveSection,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            sectionTitle: "t:product_info.product.reasons_to_love",
          },
        },
      ],
    },

    // Product Description Tab Section
    {
      id: "product-detail-tab-section",
      name: "Product Detail Tab Section",
      type: SECTION_TYPES.CONTENT_SECTION,
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
          id: "product-page-detail-tab-section",
          name: "Product Details Tab",
          type: WIDGET_TYPES.ProductDetailTabSection,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
          },
        },
      ],
    },

    // Product FAQ Section
    {
      id: "product-faq-section",
      name: "Product Faq Section",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "product-faq",
          name: "Product Faq",
          type: WIDGET_TYPES.ProductFaqSection,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            faq: {
              title: "FAQs",
              variant: "v1",
              allowMultiple: true,
              showIcon: true,
              showBorderBottom: true,
              spacing: "relaxed",
              listGap: "noGap",
              isTitleItalic: false,
              titleMarginBottom: 0,
              showSideImage: false,
            },
          },
        },
      ],
    },

    // Reviews Section
    {
      id: "review-section",
      name: "Reviews Section",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "review-section-widget",
          name: "Reviews Section",
          type: WIDGET_TYPES.ReviewSection,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            title: "Customer Reviews",
          },
        },
      ],
    },

    // Frequently Bought Together Section
    {
      id: "fbt",
      name: "Frequently Bought Together",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "fbt-widget",
          name: "Frequently Bought Together",
          type: WIDGET_TYPES.FBT,
          dataSourceKey: "productData",
          settings: {
            variant: "V1",
            title: "Frequently Bought Together",
            maxFaqs: 9,
            itemBorderColor: "primary",
            container: "container-md",
            itemBorderRadius: "8px",
            questionBorderRadius: "8px",
          },
        },
      ],
    },

    // Product Additional Info Section
    {
      id: "product-additional-info-section",
      name: "Product Additional Information Section",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 35, bottom: 0, left: 0 } },
          tablet: { padding: { top: 27, right: 20, bottom: 27, left: 20 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "product-additional-information-section",
          name: "Product Additional Information",
          type: WIDGET_TYPES.ProductAdditionalInfoSection,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            sectionTitle: "Disclaimer & Additional Information",
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
          tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "footer-widget",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            backgroundColor: "#000000",
            showSocialLinks: true,
            showPaymentMethods: true,
            showAppDownload: true,
            addToCartText: "t:product_info.product.add_to_cart",
            soldOutText: "t:product_info.product.sold_out",
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
