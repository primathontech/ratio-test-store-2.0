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
            showProductMarquee: true,
            productMarqueeText: "Shop for ₹499 & Get 2 Bestsellers Free",
            productMarqueeCouponCode: "FREEHF",
            productMarqueeSpeed: "8s",
            productMarqueeHref:
              "https://bblunt.com/pages/shine-squad-weekly-offer",

            // Right-column copy
            netContentText: "Net content",
            inclusiveOfAllTaxesText: "Incl. of all taxes",
            reviewsText: "reviews",
            mrp: "M.R.P.",
            usp: "USP",
            discount: "% off",
            selectSizeText: "Select Size",
            soldOutText: "Sold out",
            rupeeSymbol: "₹",
            addToCartText: "Add to Cart",

            // Gallery tuning — forward-compat. Widget currently uses the
            // hardcoded GALLERY_DEFAULTS (see PDP_PRODUCT_GALLERY_FLOW.md §7.2);
            // these values are accepted but not yet plumbed through.
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

    // People Also Bought Section
    {
      id: "people-also-bought-section",
      name: "People Also Bought",
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
          id: "dawn-people-also-bought",
          name: "People Also Bought",
          type: WIDGET_TYPES.PeopleAlsoBought,
          settings: {
            variant: "v1",
            heading: "People Also Bought",
            products: [
              {
                href: "/products/high-shine-conditioning-hair-colour-cherry-red-shade-6-62",
                title:
                  "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)",
                alt: "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1FOP_1_c61589f1-a9b9-4937-a65a-bf8fa2f11fe1.jpg?v=1757585023&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace.jpg?v=1757585144&width=360",
                category: "Hair Colour",
                badge: "Get3@\u20B9799",
                badgeVariant: "trending",
                rating: 4.85,
                reviewCount: 13,
                salePrice: 399,
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-mahogany-reddish-brown-shade-4-56pack-of-2",
                title:
                  "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)(Pack of 2)",
                alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)(Pack of 2)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/Mahogany_Reddish_Brown_FOP.jpg?v=1762754842&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKM_624e7dc2-83af-41f4-b3d2-bebd81fea683.jpg?v=1762754842&width=360",
                category: "Combos",
                badge: "New Launch",
                badgeVariant: "new",
                rating: 5.0,
                reviewCount: 1,
                salePrice: 638,
                originalPrice: 798,
                discount: "20% off",
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-wine-deep-burgundy-shade-4-20",
                title:
                  "High Shine Conditioning Hair Colour - Wine Deep Burgundy (Shade 4.20)",
                alt: "High Shine Conditioning Hair Colour - Wine Deep Burgundy (Shade 4.20)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/FOP_1_738d4d42-2fe0-4ab3-a29d-856a3b990327.jpg?v=1757585872&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace_a6ec38b3-509e-4377-bf7e-cfe6a0c0b3f2.jpg?v=1757585872&width=360",
                category: "Hair Colour",
                badge: "Get3@\u20B9799",
                badgeVariant: "trending",
                rating: 4.9,
                reviewCount: 20,
                salePrice: 399,
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-mahogany-reddish-brown-shade-4-56pack-of-3",
                title:
                  "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)(Pack of 3)",
                alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)(Pack of 3)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/Mahogany_Reddish_Brown_FOP_Pack_of_3.jpg?v=1762754883&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace_7a3792cc-20ea-4c47-9bc8-bfbee0aa0b5c.jpg?v=1762754883&width=360",
                category: "Kits",
                badge: "New Launch",
                badgeVariant: "new",
                rating: 0,
                reviewCount: 0,
                salePrice: 898,
                originalPrice: 1197,
                discount: "25% off",
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-coffee-natural-brown-shade-4-31",
                title:
                  "High Shine Conditioning Hair Colour - Coffee Natural Brown (Shade 4.31)",
                alt: "High Shine Conditioning Hair Colour - Coffee Natural Brown (Shade 4.31)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1_FOP_1.jpg?v=1753695913&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/4_Model.jpg?v=1753696146&width=360",
                category: "Hair Colour",
                badge: "Get3@\u20B9799",
                badgeVariant: "trending",
                rating: 4.64,
                reviewCount: 106,
                salePrice: 399,
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-natural-black-shade-1",
                title:
                  "High Shine Conditioning Hair Colour - Natural Black (Shade 1)",
                alt: "High Shine Conditioning Hair Colour - Natural Black (Shade 1)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1FOP_1_d530b216-131a-49d6-b164-7b4c4e1935b2.jpg?v=1753698490&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKM_917f7769-a802-42d4-8ecf-c78500dbf98c.jpg?v=1753698590&width=360",
                category: "Hair Colour",
                badge: "Get3@\u20B9799",
                badgeVariant: "trending",
                rating: 4.58,
                reviewCount: 78,
                salePrice: 399,
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-cherry-red-shade-6-62pack-of-2",
                title:
                  "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)(Pack of 2)",
                alt: "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)(Pack of 2)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/Cherry_Red_fop.jpg?v=1762754099&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace_77494407-e9c4-46c4-8615-a94085cbcce9.jpg?v=1762754099&width=360",
                category: "Combos",
                badge: "New Launch",
                badgeVariant: "new",
                rating: 0,
                reviewCount: 0,
                salePrice: 638,
                originalPrice: 798,
                discount: "20% off",
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-chocolate-dark-brown-shade-3",
                title:
                  "High Shine Conditioning Hair Colour - Chocolate Dark Brown (Shade 3)",
                alt: "High Shine Conditioning Hair Colour - Chocolate Dark Brown (Shade 3)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/1FOP_1.jpg?v=1753438944&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKM.jpg?v=1753439356&width=360",
                category: "Hair Colour",
                badge: "Get3@\u20B9799",
                badgeVariant: "trending",
                rating: 4.65,
                reviewCount: 110,
                salePrice: 399,
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
              {
                href: "/products/high-shine-conditioning-hair-colour-cherry-red-shade-6-62pack-of-3",
                title:
                  "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)(Pack of 3)",
                alt: "High Shine Conditioning Hair Colour - Cherry Red (Shade 6.62)(Pack of 3)",
                mainImage:
                  "https://bblunt.com/cdn/shop/files/Cherry_Red_fop_pack_of_3.jpg?v=1762754279&width=360",
                hoverImage:
                  "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace_77494407-e9c4-46c4-8615-a94085cbcce9.jpg?v=1762754279&width=360",
                category: "Kits",
                badge: "New Launch",
                badgeVariant: "new",
                rating: 0,
                reviewCount: 0,
                salePrice: 898,
                originalPrice: 1197,
                discount: "25% off",
                weight: "130g",
                description:
                  "Intense High Shine Hair Colour at Home | Colour Outside, Care Inside",
              },
            ],
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
          mobile: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
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
