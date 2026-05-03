import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Products Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-products",
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
          id: "dawn-announcement-bar",
          name: "Announcement Bar",
          type: WIDGET_TYPES.AnnouncementBar,
          settings: {
            variant: "v1",
            backgroundColor: "#000000",
            textColor: "#ffffff",
            speed: 35,
            pauseOnHover: true,
            items: [
              {
                text: "Buy 3 Products at \u20B9799 | Use code : <strong>FLAT3</strong>",
                href: "/pages/flat3",
              },
              {
                text: "Shop for \u20B9499 & Get 2 Best Sellers FREE | Code : <strong>FREEIM</strong>",
                href: "/pages/shine-squad-weekly-offer",
              },
            ],
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
          id: "dawn-header",
          name: "Header",
          type: WIDGET_TYPES.Header,
          settings: {
            variant: "v1",
            logoSrc: "/Header/images/logo.png",
            logoAlt: "BBlunt",
            searchPlaceholder: "Search For Conditioner, Shampoo...",
            cartHref: "/cart",
            accountHref: "/account",
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
          id: "dawn-product-detail",
          name: "Product Detail",
          type: WIDGET_TYPES.ProductDetail,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",

            // Coupon marquee (between price block and variant picker)
            showProductMarquee: false,
            productMarqueeText: "Shop for ₹499 & Get 2 Bestsellers Free",
            productMarqueeCouponCode: "FREEHF",
            productMarqueeSpeed: "8s",
            productMarqueeHref:
              "https://bblunt.com/pages/shine-squad-weekly-offer",

            // Right-column copy
            netContentText: "Net content",
            inclusiveOfAllTaxesText: "Incl. of all taxes",
            reviewsText: "reviews",
            mrp: "MRP:",
            usp: "USP",
            discount: "% off",
            selectSizeText: "Select size",
            soldOutText: "Sold out",
            rupeeSymbol: "₹",
            addToCartText: "Add to cart",

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
          id: "dawn-reasons-to-love",
          name: "Reasons to Love",
          type: WIDGET_TYPES.ReasonsToLove,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
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
          id: "dawn-product-tabs",
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
          id: "dawn-product-faq",
          name: "Product FAQ",
          type: WIDGET_TYPES.ProductFAQ,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            title: "Product FAQs",
            defaultExpanded: true,
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
          id: "dawn-customer-reviews",
          name: "Customer Reviews",
          type: WIDGET_TYPES.CustomerReviews,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            title: "Customer Reviews",
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
          id: "dawn-recently-viewed",
          name: "Recently Viewed",
          type: WIDGET_TYPES.RecentlyViewed,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            heading: "Recently Viewed",
            maxProducts: 10,
            showActionButton: true,
            actionButtonText: "Add to cart",
            actionButtonTextMobile: "Add",
            actionButtonTextColor: "#ffffff",
            showBadge: true,
            showRating: true,
            soldOutText: "Sold Out",
            soldOutTextMobile: "Sold",
            productCardBackgroundColor: "#ffffff",
            sectionBackgroundColor: "#ffffff",
            sectionTextColor: "#1d1d1d",
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
          id: "dawn-additional-information",
          name: "Additional Information",
          type: WIDGET_TYPES.AdditionalInformation,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            title: "Additional Information",
            defaultExpanded: false,
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
          id: "dawn-product-disclaimer",
          name: "Product Disclaimer",
          type: WIDGET_TYPES.ProductDisclaimer,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            sectionTitle: "Disclaimer",
          },
        },
      ],
    },

    // Breadcrumb Section
    {
      id: "breadcrumb-section",
      name: "Breadcrumb",
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
          id: "dawn-breadcrumb",
          name: "Breadcrumb",
          type: WIDGET_TYPES.Breadcrumb,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
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
          id: "dawn-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          settings: { variant: "v1" },
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
          id: "dawn-sticky-add-to-cart",
          name: "Sticky Add To Cart",
          type: WIDGET_TYPES.StickyAddToCart,
          dataSourceKey: "productData",
          settings: {
            variant: "v1",
            buttonText: "Add to cart",
            cartHref: "/cart",
          },
        },
      ],
    },
  ],
};
