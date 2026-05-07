import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/* ------------------------------------------------------------------ */
/*  Helper: section config for a FeaturedCollectionCarousel widget      */
/* ------------------------------------------------------------------ */

function carouselSection(
  id: string,
  name: string,
  /**
   * Rich-text heading. Inline HTML allowed for emphasis — e.g.
   * `For <strong>Hair Fall Control</strong>`. Rendered via
   * `dangerouslySetInnerHTML` in the widget.
   */
  headingRich: string,
  dataSourceKey: string,
  /**
   * Optional override for the "View all" link target. The server handle
   * comes from the data source (single source of truth). Omit to reuse it
   * with no extra fetch; pass a different handle to redirect View All
   * elsewhere — the widget then lazy-fetches it on intersection.
   */
  viewAllCollectionHandle?: string
) {
  return {
    id: `${id}-section`,
    name,
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
        id: `bblunt-2-${id}`,
        name,
        type: WIDGET_TYPES.FeaturedCollectionCarousel,
        dataSourceKey,
        settings: {
          variant: "v1",
          heading: headingRich,
          actionButtonText: "t:common.product_card.add_to_cart",
          soldOutText: "t:common.product_card.sold_out",
          ...(viewAllCollectionHandle ? { viewAllCollectionHandle } : {}),
        },
      },
    ],
  };
}

/**
 * Home Page Template for bblunt-2
 */
export const template: PageConfig = {
  id: "bblunt-2-home",
  dataSources: {
    hairCareBffsCollections: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["shampoo-haircarebffs", "most-loved-home-page"],
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    mostLovedCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "most-loved-home-page",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    shampooCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "shampoo-haircarebffs",
      },
      options: { params: { productLimit: 12 } },
      required: false,
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
            logoSrc: "/Header/images/logo.png",
            logoAlt: "BBlunt",
            searchPlaceholder: "Search For Conditioner, Shampoo...",
            cartHref: "/cart",
            accountHref: "/account",
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
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
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
            bannerCarousel: "t:bblunt-2_home_default.banner_carousel",
          },
        },
      ],
    },

    // Shop by Concerns Section
    {
      id: "shop-by-concerns-section",
      name: "Shop by Concerns",
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
          id: "bblunt-2-shop-by-concerns",
          name: "Shop by Concerns",
          type: WIDGET_TYPES.ShopByConcerns,
          settings: {
            variant: "v1",
            heading: "t:bblunt-2_home_default.shop_by_concerns.heading__rich",
            tiles: "t:bblunt-2_home_default.shop_by_concerns.tiles",
          },
        },
      ],
    },

    // Shop by Categories Section
    {
      id: "shop-by-categories-section",
      name: "Shop by Categories",
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
          id: "bblunt-2-shop-by-categories",
          name: "Shop by Categories",
          type: WIDGET_TYPES.ShopByCategories,
          settings: {
            variant: "v1",
            heading: "t:bblunt-2_home_default.shop_by_categories.heading__rich",
            tiles: "t:bblunt-2_home_default.shop_by_categories.tiles",
          },
        },
      ],
    },

    // Hair Care BFFs Section
    {
      id: "hair-care-bffs-section",
      name: "Hair Care BFFs",
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
          id: "bblunt-2-hair-care-bffs",
          name: "Hair Care BFFs",
          type: WIDGET_TYPES.HairCareBFFs,
          dataSourceKey: "hairCareBffsCollections",
          settings: {
            variant: "v1",
            heading: "t:bblunt-2_home_default.hair_care_bffs.heading__rich",
            backgroundImage:
              "t:bblunt-2_home_default.hair_care_bffs.backgroundImage",
            actionButtonText: "t:common.product_card.add_to_cart",
            soldOutText: "t:common.product_card.sold_out",
            collections: "t:bblunt-2_home_default.hair_care_bffs.collections",
          },
        },
      ],
    },

    // ── FeaturedCollectionCarousel Sections (API-driven) ────────────
    // Note: All sections currently use mostLovedCarousel or shampooCarousel
    // as placeholder dataSources. Replace with proper per-collection
    // dataSources when those API handles are ready.

    // For Hair Fall Control — FeaturedCollectionCarousel #1
    // Server fetches "most-loved-home-page" for the carousel products,
    // but the "View all" button targets a different collection
    // ("shampoo-haircarebffs") — triggers the LazyViewAllButton lazy-fetch path.
    carouselSection(
      "for-hair-fall-control",
      "For Hair Fall Control",
      "t:bblunt-2_home_default.featured_collection_carousels.for_hair_fall_control__rich",
      "mostLovedCarousel",
      "shampoo-haircarebffs"
    ),

    // For Party Ready Hair — FeaturedCollectionCarousel #2
    carouselSection(
      "for-party-ready-hair",
      "For Party Ready Hair",
      "t:bblunt-2_home_default.featured_collection_carousels.for_party_ready_hair__rich",
      "shampooCarousel"
    ),

    // For Dull & Dry Hair — FeaturedCollectionCarousel #3
    carouselSection(
      "for-dull-dry-hair",
      "For Dull & Dry Hair",
      "t:bblunt-2_home_default.featured_collection_carousels.for_dull_dry_hair__rich",
      "mostLovedCarousel"
    ),

    // High Shine Creme Hair Colour — FeaturedCollectionCarousel #4
    carouselSection(
      "high-shine-creme-hair-colour",
      "High Shine Creme Hair Colour",
      "t:bblunt-2_home_default.featured_collection_carousels.high_shine_creme_hair_colour__rich",
      "mostLovedCarousel"
    ),

    // For Damage Repair — FeaturedCollectionCarousel #5
    carouselSection(
      "for-damage-repair",
      "For Damage Repair",
      "t:bblunt-2_home_default.featured_collection_carousels.for_damage_repair__rich",
      "mostLovedCarousel"
    ),

    // For Advanced Smoothening — FeaturedCollectionCarousel #6
    carouselSection(
      "for-advanced-smoothening",
      "For Advanced Smoothening",
      "t:bblunt-2_home_default.featured_collection_carousels.for_advanced_smoothening__rich",
      "mostLovedCarousel"
    ),

    // For Extraordinary Shiny Hair — FeaturedCollectionCarousel #7
    carouselSection(
      "for-extraordinary-shiny-hair",
      "For Extraordinary Shiny Hair",
      "t:bblunt-2_home_default.featured_collection_carousels.for_extraordinary_shiny_hair__rich",
      "mostLovedCarousel"
    ),

    // For Bond Repair — FeaturedCollectionCarousel #8
    carouselSection(
      "for-bond-repair",
      "For Bond Repair",
      "t:bblunt-2_home_default.featured_collection_carousels.for_bond_repair__rich",
      "mostLovedCarousel"
    ),

    // For Nourished & Defined Curls — FeaturedCollectionCarousel #9
    carouselSection(
      "for-nourished-defined-curls",
      "For Nourished & Defined Curls",
      "t:bblunt-2_home_default.featured_collection_carousels.for_nourished_defined_curls__rich",
      "mostLovedCarousel"
    ),

    // For Dandruff Control — FeaturedCollectionCarousel #10
    carouselSection(
      "for-dandruff-control",
      "For Dandruff Control",
      "t:bblunt-2_home_default.featured_collection_carousels.for_dandruff_control__rich",
      "mostLovedCarousel"
    ),

    // 5 Minute Shampoo Hair Colour — FeaturedCollectionCarousel #11
    carouselSection(
      "five-minute-shampoo-hair-colour",
      "5 Minute Shampoo Hair Colour",
      "t:bblunt-2_home_default.featured_collection_carousels.five_minute_shampoo_hair_colour__rich",
      "mostLovedCarousel"
    ),

    // Shine Academy Banner Section
    {
      id: "shine-academy-banner-section",
      name: "Shine Academy Banner",
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
    },

    // Testimonials Section
    {
      id: "testimonials-section",
      name: "Testimonials",
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
          id: "bblunt-2-testimonials",
          name: "Testimonials",
          type: WIDGET_TYPES.Testimonials,
          settings: {
            variant: "v1",
            heading: "t:common.testimonials.heading__rich",
            testimonials: "t:common.testimonials.items",
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
          mobile: { padding: { top: 0, right: 0, bottom: 60, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
