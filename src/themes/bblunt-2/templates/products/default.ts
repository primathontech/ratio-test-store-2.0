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

    // Video App Section — shoppable-video rail (SDK-driven, lazy-loaded
    // 1s after PDP mount). Filters videos to the current product.
    // {
    //   id: "video-app-section",
    //   name: "Video App",
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
    //       id: "bblunt-2-video-app",
    //       name: "Video App",
    //       type: WIDGET_TYPES.VideoApp,
    //       dataSourceKey: "productData",
    //       settings: {
    //         variant: "v1",
    //         title: "Watch & Shop",
    //         layout: "grid",
    //         itemsPerRow: 4,
    //         enableCtaButton: false,
    //       },
    //     },
    //   ],
    // },

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

    // FBT (Frequently Bought Together) Section — SDK-driven bundle rail.
    // The widget self-hides if the SDK reports no bundle for this product.
    {
      id: "fbt-section",
      name: "Frequently Bought Together",
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
          id: "bblunt-2-fbt",
          name: "Frequently Bought Together",
          type: WIDGET_TYPES.FBT,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            title: "Frequently Bought Together",
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
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
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
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
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
          mobile: { padding: { top: 20, right: 0, bottom: 20, left: 0 } },
          tablet: { padding: { top: 32, right: 0, bottom: 32, left: 0 } },
          desktop: { padding: { top: 64, right: 0, bottom: 64, left: 0 } },
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
            soldOutText: "t:common.product_card.sold_out_in_pdp",
            inclusiveOfAllTaxesText:
              "t:bblunt-2_products_default.product_detail.inclusiveOfAllTaxesText",
            mrpLabel: "t:bblunt-2_products_default.product_detail.mrp",
          },
        },
      ],
    },
  ],
};
