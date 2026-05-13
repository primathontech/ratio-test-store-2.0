import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Products Page Template for bblunt-2
 */
export const template: PageConfig = {
  id: "bblunt-2-products",
  dataSources: {
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
      type: SECTION_TYPES.HEADER_SECTION,
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
          id: "bblunt-2-announcement-bar",
          name: "Announcement Bar",
          type: WIDGET_TYPES.AnnouncementBar,
          settings: {
            variant: "v1",
            backgroundColor: "#000000",
            textColor: "#ffffff",
            speed: 35,
            pauseOnHover: true,
            items: "t:common.announcement_bar__rich",
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
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-header",
          name: "Header",
          type: WIDGET_TYPES.Header,
          settings: {
            variant: "v1",
            logoSrc: "t:common.header.logoSrc",
            searchPlaceholder: "t:common.header.searchPlaceholder",
            searchSuggestions: "t:common.header.searchSuggestions",
            product_label: "t:common.header.product_label",
            product_href: "t:common.header.product_href",
            product_items: "t:common.header.product_items",
            hair_care_label: "t:common.header.hair_care_label",
            hair_care_href: "t:common.header.hair_care_href",
            hair_care_type_label: "t:common.header.hair_care_type_label",
            hair_care_type_href: "t:common.header.hair_care_type_href",
            hair_care_type_items: "t:common.header.hair_care_type_items",
            hair_care_concern_label: "t:common.header.hair_care_concern_label",
            hair_care_concern_href: "t:common.header.hair_care_concern_href",
            hair_care_concern_items: "t:common.header.hair_care_concern_items",
            hair_colour_label: "t:common.header.hair_colour_label",
            hair_colour_href: "t:common.header.hair_colour_href",
            hair_colour_items: "t:common.header.hair_colour_items",
            hair_styling_label: "t:common.header.hair_styling_label",
            hair_styling_href: "t:common.header.hair_styling_href",
            hair_styling_items: "t:common.header.hair_styling_items",
            salon_label: "t:common.header.salon_label",
            salon_href: "t:common.header.salon_href",
            salon_items: "t:common.header.salon_items",
            getApp_title: "t:common.header.get_app.title",
            getApp_description: "t:common.header.get_app.description",
            getApp_button_text: "t:common.header.get_app.button_text",
            getApp_logo_alt: "t:common.header.get_app.logo_alt",
            getApp_logo_url: "t:common.header.get_app.logo_url",
            getApp_app_url: "t:common.header.get_app.app_url",
          },
        },
      ],
    },

    // Product Detail Section
    {
      id: "product-detail-section",
      name: "Product Detail",
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
          id: "bblunt-2-product-detail",
          name: "Product Detail",
          type: WIDGET_TYPES.ProductDetail,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",

            // Coupon marquee (between price block and variant picker)
            showProductMarquee:
              "t:bblunt-2_products_default.product_detail.showProductMarquee",
            productMarqueeText:
              "t:bblunt-2_products_default.product_detail.productMarqueeText",
            productMarqueeCouponCode:
              "t:bblunt-2_products_default.product_detail.productMarqueeCouponCode",
            productMarqueeSpeed:
              "t:bblunt-2_products_default.product_detail.productMarqueeSpeed",
            productMarqueeHref:
              "t:bblunt-2_products_default.product_detail.productMarqueeHref",

            // Right-column copy (from translations)
            netContentText:
              "t:bblunt-2_products_default.product_detail.netContentText",
            inclusiveOfAllTaxesText:
              "t:bblunt-2_products_default.product_detail.inclusiveOfAllTaxesText",
            reviewsText:
              "t:bblunt-2_products_default.product_detail.reviewsText",
            mrp: "t:bblunt-2_products_default.product_detail.mrp",
            usp: "t:bblunt-2_products_default.product_detail.usp",
            discount: "t:bblunt-2_products_default.product_detail.discount",
            selectSizeText:
              "t:bblunt-2_products_default.product_detail.selectSizeText",
            rupeeSymbol:
              "t:bblunt-2_products_default.product_detail.rupeeSymbol",
            // Add-to-cart and sold-out shared across product widgets
            addToCartText: "t:common.product_card.add_to_cart",
            soldOutText: "t:common.product_card.sold_out_in_pdp",

            productGallery: {
              variant: "v1",
              layout: "vertical",
              mainImageRadius: 0,
              mobileMainImageRadius: 0,
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
              lightboxBgColor: "rgba(255, 255, 255, 1)",
              lightboxOverlayOpacity: 1,
              enablePinchZoom: true,
              zoomIconColor: "#000",
            },

            responsive: {
              mobile: {
                stackVertically: true,
                galleryWidth: 100,
                infoWidth: 100,
                gap: 24,
              },
            },
          },
        },
      ],
    },

    // Reasons to Love Section
    {
      id: "reasons-to-love-section",
      name: "Reasons to Love",
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
          id: "bblunt-2-reasons-to-love",
          name: "Reasons to Love",
          type: WIDGET_TYPES.ReasonsToLove,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            sectionTitle:
              "t:bblunt-2_products_default.reasons_to_love.section_title",
          },
        },
      ],
    },

    // Product Tabs Section
    {
      id: "product-tabs-section",
      name: "Product Tabs",
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
          id: "bblunt-2-product-tabs",
          name: "Product Tabs",
          type: WIDGET_TYPES.ProductTabs,
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
      name: "Product FAQ",
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
          id: "bblunt-2-product-faq",
          name: "Product FAQ",
          type: WIDGET_TYPES.ProductFAQ,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            title: "t:bblunt-2_products_default.product_faq.title",
            defaultExpanded:
              "t:bblunt-2_products_default.product_faq.defaultExpanded",
          },
        },
      ],
    },

    // Customer Reviews Section
    {
      id: "customer-reviews-section",
      name: "Customer Reviews",
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
          id: "bblunt-2-customer-reviews",
          name: "Customer Reviews",
          type: WIDGET_TYPES.CustomerReviews,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            title: "t:bblunt-2_products_default.customer_reviews.title",
            writeReviewButtonText:
              "t:bblunt-2_products_default.customer_reviews.writeReviewButtonText",
            cancelReviewButtonText:
              "t:bblunt-2_products_default.customer_reviews.cancelReviewButtonText",
          },
        },
      ],
    },

    // Recently Viewed Section
    {
      id: "recently-viewed-section",
      name: "Recently Viewed",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 24, left: 0 } },
          tablet: { padding: { top: 27, right: 0, bottom: 27, left: 0 } },
          desktop: { padding: { top: 32, right: 0, bottom: 32, left: 0 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-recently-viewed",
          name: "Recently Viewed",
          type: WIDGET_TYPES.RecentlyViewed,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            heading: "t:bblunt-2_products_default.recently_viewed.heading",
            actionButtonText: "t:common.product_card.add_to_cart",
            soldOutText: "t:common.product_card.sold_out",
          },
        },
      ],
    },

    // Additional Information Section
    {
      id: "additional-information-section",
      name: "Additional Information",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 24, left: 0 } },
          tablet: { padding: { top: 27, right: 0, bottom: 27, left: 0 } },
          desktop: { padding: { top: 32, right: 0, bottom: 32, left: 0 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-additional-information",
          name: "Additional Information",
          type: WIDGET_TYPES.AdditionalInformation,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            title: "t:bblunt-2_products_default.additional_information.title",
            defaultExpanded:
              "t:bblunt-2_products_default.additional_information.defaultExpanded",
          },
        },
      ],
    },

    // Product Disclaimer Section
    {
      id: "product-disclaimer-section",
      name: "Product Disclaimer",
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
          id: "bblunt-2-product-disclaimer",
          name: "Product Disclaimer",
          type: WIDGET_TYPES.ProductDisclaimer,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            sectionTitle:
              "t:bblunt-2_products_default.product_disclaimer.sectionTitle",
          },
        },
      ],
    },

    // Breadcrumb Section
    // {
    //   id: "breadcrumb-section",
    //   name: "Breadcrumb",
    //   type: SECTION_TYPES.CONTENT_SECTION,
    //   settings: {
    //     layout: SECTION_LAYOUT_OPTIONS.FULL,
    //     responsive: {
    //       mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    //       tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    //       desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    //     },
    //   },
    //   widgets: [
    //     {
    //       id: "bblunt-2-breadcrumb",
    //       name: "Breadcrumb",
    //       type: WIDGET_TYPES.Breadcrumb,
    //       dataSourceKey: "productData",
    //       settings: {
    //         variant: "v1",
    //       },
    //     },
    //   ],
    // },

    // Footer Section
    {
      id: "footer-section",
      name: "Footer",
      type: SECTION_TYPES.FOOTER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 60, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 70, left: 0 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
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

    // Sticky Add To Cart Bar (fixed bottom bar)
    {
      id: "sticky-add-to-cart-section",
      name: "Sticky Add To Cart",
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
          id: "bblunt-2-sticky-add-to-cart",
          name: "Sticky Add To Cart",
          type: WIDGET_TYPES.StickyAddToCart,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            buttonText: "t:common.product_card.add_to_cart",
            inclusiveOfAllTaxesText:
              "t:bblunt-2_products_default.product_detail.inclusiveOfAllTaxesText",
          },
        },
      ],
    },
  ],
};
