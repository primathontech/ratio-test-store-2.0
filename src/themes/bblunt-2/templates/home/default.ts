import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/* ------------------------------------------------------------------ */
/*  Shared carousel breakpoints                                         */
/* ------------------------------------------------------------------ */
// Tuned per viewport bucket. SwipeCarousel resolves the active entry
// from useResponsive's flags. Widgets fall back to their own built-in
// defaults when this setting is omitted.
// Mirrors bblunt.com:
//   <768    → 2.3 cards (mobile)
//   768–991 → 2.3 cards (lower tablet)
//   992–1149 → 4 cards (upper tablet)
//   ≥1150   → 5 cards (desktop)
const FEATURED_CAROUSEL_BREAKPOINTS = [
  { minWidth: 0, cards: 2.3, gap: 0 },
  { minWidth: 768, cards: 2.3, gap: 0 },
  { minWidth: 992, cards: 4, gap: 0 },
  { minWidth: 1150, cards: 5, gap: 0 },
];

// Mirrors bblunt.com:
//   <768    → 2.2 cards (mobile)
//   768–991 → 2.2 cards (lower tablet)
//   992–1149 → 4 cards (upper tablet)
//   ≥1150   → 5 cards (desktop)
const HAIR_CARE_BFFS_CAROUSEL_BREAKPOINTS = [
  { minWidth: 0, cards: 2.2, gap: 0 },
  { minWidth: 768, cards: 2.2, gap: 0 },
  { minWidth: 992, cards: 4, gap: 0 },
  { minWidth: 1150, cards: 5, gap: 0 },
];

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
          carouselBreakpoints: FEATURED_CAROUSEL_BREAKPOINTS,
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
        handles: [
          "most-loved-home-page",
          "shampoo-haircarebffs",
          "shampoo-haircarebffs-copy",
          "spray-haircarebffs",
          "salon-haircarebffs",
          "hair-mask-haircarebffs",
        ],
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    hairFallControlCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "for-hair-fall-control-home-page-1",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    partyReadyHairAtHomeCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "for-party-ready-hair-at-home-home-page-1",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    dullAndDryHairCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "for-dull-dry-hair-home-page-1",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    highShineCremeHairColourCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "salon-secret-home-page-1",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    damageRepairCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "for-damage-repair-home-page-1",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    advancedSmootheningCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "for-advanced-smoothening-home-page-new",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    extraordinaryShinyHairCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "for-extraordinary-shiny-hair-home-page-1",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    bondRepairCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "for-bond-repair-home-page",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    dandruffControlCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "for-dandruff-control-home-page-1",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    fiveMinuteShampooHairColourCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "5-minute-shampoo-hair-colour-home-page-1",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
    nourishedAndDefinedCurlCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "for-nourished-defined-curls-home-page-1",
      },
      options: { params: { productLimit: 12 } },
      required: false,
    },
  },
  sections: [
    // SEO Metadata Section
    {
      id: "seo-metadata-section",
      name: "SEO Metadata",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "seo-metadata-widget",
          name: "SEO Metadata",
          type: WIDGET_TYPES.SEOMetadata,
          settings: {
            variant: "v1",
            title: "t:bblunt-2_home_default.seo_metadata.title",
            description: "t:bblunt-2_home_default.seo_metadata.description",
          },
        },
      ],
    },

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

    // Banner Carousel Section
    {
      id: "banner-carousel-section",
      name: "Banner Carousel",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: {
            margin: { top: -58, right: 0, bottom: 0, left: 0 },
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
          },
          tablet: {
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
          },
          desktop: {
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
          },
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
            carouselBreakpoints: HAIR_CARE_BFFS_CAROUSEL_BREAKPOINTS,
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
      "hairFallControlCarousel",
      "hairfall"
    ),

    // For Party Ready Hair — FeaturedCollectionCarousel #2
    carouselSection(
      "for-party-ready-hair",
      "For Party Ready Hair",
      "t:bblunt-2_home_default.featured_collection_carousels.for_party_ready_hair__rich",
      "partyReadyHairAtHomeCarousel",
      "hair-styling"
    ),

    // For Dull & Dry Hair — FeaturedCollectionCarousel #3
    carouselSection(
      "for-dull-dry-hair",
      "For Dull & Dry Hair",
      "t:bblunt-2_home_default.featured_collection_carousels.for_dull_dry_hair__rich",
      "dullAndDryHairCarousel",
      "dry-hair"
    ),

    // High Shine Creme Hair Colour — FeaturedCollectionCarousel #4
    carouselSection(
      "high-shine-creme-hair-colour",
      "High Shine Creme Hair Colour",
      "t:bblunt-2_home_default.featured_collection_carousels.high_shine_creme_hair_colour__rich",
      "highShineCremeHairColourCarousel",
      "salon-secret"
    ),

    // For Damage Repair — FeaturedCollectionCarousel #5
    carouselSection(
      "for-damage-repair",
      "For Damage Repair",
      "t:bblunt-2_home_default.featured_collection_carousels.for_damage_repair__rich",
      "damageRepairCarousel",
      "damaged-hair"
    ),

    // For Advanced Smoothening — FeaturedCollectionCarousel #6
    carouselSection(
      "for-advanced-smoothening",
      "For Advanced Smoothening",
      "t:bblunt-2_home_default.featured_collection_carousels.for_advanced_smoothening__rich",
      "advancedSmootheningCarousel",
      "advanced-smoothening"
    ),

    // For Extraordinary Shiny Hair — FeaturedCollectionCarousel #7
    carouselSection(
      "for-extraordinary-shiny-hair",
      "For Extraordinary Shiny Hair",
      "t:bblunt-2_home_default.featured_collection_carousels.for_extraordinary_shiny_hair__rich",
      "extraordinaryShinyHairCarousel",
      "intense-shine"
    ),

    // For Bond Repair — FeaturedCollectionCarousel #8
    carouselSection(
      "for-bond-repair",
      "For Bond Repair",
      "t:bblunt-2_home_default.featured_collection_carousels.for_bond_repair__rich",
      "bondRepairCarousel",
      "bond-repair"
    ),

    // For Dandruff Control — FeaturedCollectionCarousel #10
    carouselSection(
      "for-dandruff-control",
      "For Dandruff Control",
      "t:bblunt-2_home_default.featured_collection_carousels.for_dandruff_control__rich",
      "dandruffControlCarousel",
      "anti-dandruff"
    ),

    // 5 Minute Shampoo Hair Colour — FeaturedCollectionCarousel #11
    carouselSection(
      "five-minute-shampoo-hair-colour",
      "5 Minute Shampoo Hair Colour",
      "t:bblunt-2_home_default.featured_collection_carousels.five_minute_shampoo_hair_colour__rich",
      "fiveMinuteShampooHairColourCarousel",
      "hair-colour-shampoo"
    ),

    // For Nourished & Defined Curls — FeaturedCollectionCarousel #9
    carouselSection(
      "for-nourished-defined-curls",
      "For Nourished & Defined Curls",
      "t:bblunt-2_home_default.featured_collection_carousels.for_nourished_defined_curls__rich",
      "nourishedAndDefinedCurlCarousel",
      "curly-hair"
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
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
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
  ],
};
