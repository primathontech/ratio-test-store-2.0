import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Home Page Template for dawn
 * Adapted from bblunt home template
 */
export const template: PageConfig = {
  id: "dawn-home",
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

    featuredCollectionOneData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: [
          "most-loved-home-page",
          "for-hair-fall-control-home-page-1",
          "for-dull-dry-hair-home-page-1",
          "for-advanced-smoothening-home-page-new",
        ],
        productLimit: 12,
      },
      required: true,
    },

    featuredCollectionTwoData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: [
          "most-loved-home-page",
          "for-hair-fall-control-home-page-1",
          "for-dull-dry-hair-home-page-1",
          "for-advanced-smoothening-home-page-new",
        ],
        productLimit: 12,
      },
      required: false,
    },

    featuredCollectionThreeData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["for-dull-dry-hair-home-page-1"],
        productLimit: 12,
      },
      required: false,
    },

    featuredCollectionFourData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["for-advanced-smoothening-home-page-new"],
        productLimit: 12,
      },
      required: false,
    },

    featuredCollectionFiveData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["salon-secret-home-page-1"],
        productLimit: 12,
      },
      required: false,
    },

    featuredCollectionSixData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["for-damage-repair-home-page-1"],
        productLimit: 12,
      },
      required: false,
    },

    featuredCollectionSevenData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["for-extraordinary-shiny-hair-home-page-1"],
        productLimit: 12,
      },
      required: false,
    },

    featuredCollectionEightData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["for-party-ready-hair-at-home-home-page-1"],
        productLimit: 12,
      },
      required: false,
    },

    featuredCollectionNineData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["for-nourished-defined-curls-home-page-1"],
        productLimit: 12,
      },
      required: false,
    },

    featuredCollectionTenData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["for-bond-repair-home-page"],
        productLimit: 12,
      },
      required: false,
    },

    featuredCollectionElevenData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["for-dandruff-control-home-page-1"],
        productLimit: 12,
      },
      required: false,
    },

    featuredCollectionTwelveData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["5-minute-shampoo-hair-colour-home-page-1"],
        productLimit: 12,
      },
      required: false,
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
          name: "Homepage Banner Carousel",
          type: WIDGET_TYPES.BannerCarousel,
          settings: {
            variant: "v1",
            bannerCarousel: "t:dawn_home_default.banner_carousel",
            autoplay: true,
            autoplayInterval: 5000,
            loop: true,
            pauseOnHover: true,
            draggable: true,
            showIndicators: true,
          },
        },
      ],
    },

    // Shop By Concerns Section
    {
      id: "shop-by-concerns-section",
      name: "Shop By Concerns",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "shop-by-concerns-widget",
          name: "Shop By Concerns",
          type: WIDGET_TYPES.ShopByConcerns,
          settings: {
            variant: "v1",
            heading: "t:dawn_home_default.shop_by_concerns.heading__rich",
            items: "t:dawn_home_default.shop_by_concerns.items",
            arrowIconSrc: "t:dawn_home_default.shop_by_concerns.arrowIconSrc",
          },
        },
      ],
    },

    // Shop by Category Section
    {
      id: "shop-by-category-section",
      name: "Shop by Category",
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
          id: "shop-by-category-widget",
          name: "Shop by Category Grid",
          type: WIDGET_TYPES.ShopByCategory,
          settings: {
            variant: "v1",
            title: "t:dawn_home_default.shop_by_category.title__rich",
            categories: "t:dawn_home_default.shop_by_category.categories",
            showNames: true,
            enableHoverEffects: true,
            backgroundColor: "#ffffff",
            textColor: "#1D1D1D",
          },
        },
      ],
    },

    // 1. Featured Collection with Tabs Section
    {
      id: "featured-collection-tabs-section",
      name: "Featured Collections with Tabs",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 94, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-tabs",
          name: "Product Grid with Collection Tabs",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionOneData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_one.heading__rich",
            collections: [
              { label: "All", handle: "most-loved-home-page" },
              { label: "Shampoo", handle: "for-hair-fall-control-home-page-1" },
              { label: "Conditioner", handle: "for-dull-dry-hair-home-page-1" },
              {
                label: "Advanced Smoothing",
                handle: "for-advanced-smoothening-home-page-new",
              },
            ],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionBackgroundColor:
              "linear-gradient(180deg, #323232 0%, #000000 100%)",
            sectionBackgroundDesktopImage:
              "/dawn/images/home-featured-collection-background.webp",
            sectionBackgroundMobileImage:
              "/dawn/images/home-featured-collection-mobile.webp",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            actionButtonTextMobile:
              "t:common.product_card.add_to_cart_button_text_mobile",
            soldOutText: "t:common.product_card.sold_out_text",
            soldOutTextMobile: "t:common.product_card.sold_out_text_mobile",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            sectionTextColor: "#FFFFFF",
            productCardBackgroundColor: "#000",
            actionButtonTextColor: "#000",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_one.view_all_button_text",
          },
        },
      ],
    },

    // 2. Featured Collection Two Section
    {
      id: "featured-collection-two-section",
      name: "Featured Collection Two",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 88, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-two",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionTwoData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_two.heading__rich",
            collections: [
              { label: "All", handle: "most-loved-home-page" },
              { label: "Shampoo", handle: "for-hair-fall-control-home-page-1" },
              { label: "Conditioner", handle: "for-dull-dry-hair-home-page-1" },
              {
                label: "Advanced Smoothing",
                handle: "for-advanced-smoothening-home-page-new",
              },
            ],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
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
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_two.view_all_button_text",
          },
        },
      ],
    },

    // Video App Section
    {
      id: "video-app",
      name: "Video App",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 20, left: 0 } },
          tablet: { padding: { top: 16, right: 0, bottom: 24, left: 0 } },
          desktop: { padding: { top: 40, right: 0, bottom: 10, left: 0 } },
        },
      },
      widgets: [
        {
          id: "video-app-widget",
          name: "Video App",
          type: WIDGET_TYPES.VideoApp,
          settings: {
            title: "Watch & Shop",
            layout: "grid",
            itemsPerRow: 4,
            enableCtaButton: false,
          },
        },
      ],
    },

    // 3. Featured Collection Three Section
    {
      id: "featured-collection-three-section",
      name: "Featured Collection Three",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-three",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionThreeData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_three.heading__rich",
            collections: [
              { label: "", handle: "for-dull-dry-hair-home-page-1" },
            ],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_three.view_all_button_text",
          },
        },
      ],
    },

    // 4. Featured Collection Four Section
    {
      id: "featured-collection-four-section",
      name: "Featured Collection Four",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-four",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionFourData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_four.heading__rich",
            collections: [
              { label: "", handle: "for-advanced-smoothening-home-page-new" },
            ],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_four.view_all_button_text",
          },
        },
      ],
    },

    // 5. Featured Collection Five Section
    {
      id: "featured-collection-five-section",
      name: "Featured Collection Five",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-five",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionFiveData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_five.heading__rich",
            collections: [{ label: "", handle: "salon-secret-home-page-1" }],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_five.view_all_button_text",
          },
        },
      ],
    },

    // 6. Featured Collection Six Section
    {
      id: "featured-collection-six-section",
      name: "Featured Collection Six",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-six",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionSixData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_six.heading__rich",
            collections: [
              { label: "", handle: "for-damage-repair-home-page-1" },
            ],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_six.view_all_button_text",
          },
        },
      ],
    },

    // 7. Featured Collection Seven Section
    {
      id: "featured-collection-seven-section",
      name: "Featured Collection Seven",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-seven",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionSevenData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_seven.heading__rich",
            collections: [
              { label: "", handle: "for-extraordinary-shiny-hair-home-page-1" },
            ],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_seven.view_all_button_text",
          },
        },
      ],
    },

    // 8. Featured Collection Eight Section
    {
      id: "featured-collection-eight-section",
      name: "Featured Collection Eight",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-eight",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionEightData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_eight.heading__rich",
            collections: [
              { label: "", handle: "for-party-ready-hair-at-home-home-page-1" },
            ],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_eight.view_all_button_text",
          },
        },
      ],
    },

    // 9. Featured Collection Nine Section
    {
      id: "featured-collection-nine-section",
      name: "Featured Collection Nine",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-nine",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionNineData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_nine.heading__rich",
            collections: [
              { label: "", handle: "for-nourished-defined-curls-home-page-1" },
            ],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_nine.view_all_button_text",
          },
        },
      ],
    },

    // 10. Featured Collection Ten Section
    {
      id: "featured-collection-ten-section",
      name: "Featured Collection Ten",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-ten",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionTenData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_ten.heading__rich",
            collections: [{ label: "", handle: "for-bond-repair-home-page" }],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_ten.view_all_button_text",
          },
        },
      ],
    },

    // 11. Featured Collection Eleven Section
    {
      id: "featured-collection-eleven-section",
      name: "Featured Collection Eleven",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 56, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-eleven",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionElevenData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_eleven.heading__rich",
            collections: [
              { label: "", handle: "for-dandruff-control-home-page-1" },
            ],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_eleven.view_all_button_text",
          },
        },
      ],
    },

    // 12. Featured Collection Twelve Section
    {
      id: "featured-collection-twelve-section",
      name: "Featured Collection Twelve",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 24, right: 0, bottom: 24, left: 0 } },
          tablet: { padding: { top: 56, right: 0, bottom: 56, left: 0 } },
          desktop: { padding: { top: 56, right: 0, bottom: 56, left: 0 } },
        },
      },
      widgets: [
        {
          id: "featured-collection-widget-twelve",
          name: "Product Card Carousel Widget",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "featuredCollectionTwelveData",
          settings: {
            variant: "v2",
            heading:
              "t:dawn_home_default.featured_collection_twelve.heading__rich",
            collections: [
              { label: "", handle: "5-minute-shampoo-hair-colour-home-page-1" },
            ],
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            autoplayInterval: 4000,
            infinite: false,
            iconStyle: "chevron",
            navigationPosition: "outside",
            navigationButtonVariant: "outline",
            sectionTextColor: "#1D1D1D",
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart_button_text",
            soldOutText: "t:common.product_card.sold_out_text",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            viewAllButtonText:
              "t:dawn_home_default.featured_collection_twelve.view_all_button_text",
          },
        },
      ],
    },

    // Dawn Shine Academy Section
    {
      id: "dawn-shine-academy-section",
      name: "Dawn Shine Academy",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "dawn-shine-academy",
          name: "Dawn Shine Academy",
          type: WIDGET_TYPES.HomepageShineAcademySection,
          settings: {
            variant: "v1",
            mobileSrc: "t:common.dawn_shine_academy.mobileSrc",
            desktopSrc: "t:common.dawn_shine_academy.desktopSrc",
            logoSrc: "t:common.dawn_shine_academy.logoSrc",
            description: "t:common.dawn_shine_academy.description",
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
            indicatorWidth: 10,
            indicatorActiveWidth: 10,
            indicatorHeight: 10,
            indicatorActiveColor: "#000",
            indicatorInactiveColor: "#00000033",
            indicatorActiveBorderColor: "none",
            indicatorInactiveBorderColor: "none",
            indicatorBorderWidth: 0,
            gapBeetweenDots: "gap-4",
            isShowFocusRing: true,
            headingStyles: {
              fontSize: {
                desktop: "4rem",
                mobile: "2rem",
              },
              color: "#1D1D1D",
            },
            cardStyleConfig: {
              backgroundColor: "#000000",
              textColors: {
                name: "#000",
                location: "#FFFFFF",
                title: "#FFFFFF",
                description: "#FFFFFF",
              },
              starColor: "#ffc002",
              starEmptyColor: "#ecf0f1",
            },
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
