import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * shine-squad-get999 sale-page template for bblunt-2.
 * Mirrors `shine-squad-weekly-offer/default.ts` — same active sections
 * (announcement, header, sale banner, collection page, footer) plus the
 * same TODO-commented sections (hero, how-it-works, countdown, most-loved
 * grid) ready to enable per page.
 */

/* ------------------------------------------------------------------ */
/*  Helper: section config for a FeaturedCollectionGrid widget          */
/* ------------------------------------------------------------------ */

function categoryGridSection(
  id: string,
  name: string,
  categoryTitle: string,
  paddingTop: number,
  dataSourceKey: string,
  collectionHandle: string
) {
  return {
    id: `${id}-section`,
    name,
    type: SECTION_TYPES.CONTENT_SECTION,
    settings: {
      layout: SECTION_LAYOUT_OPTIONS.FULL,
      responsive: {
        mobile: {
          padding: { top: paddingTop, right: 0, bottom: 0, left: 0 },
        },
        tablet: {
          padding: { top: paddingTop, right: 0, bottom: 0, left: 0 },
        },
        desktop: {
          padding: { top: paddingTop, right: 0, bottom: 0, left: 0 },
        },
      },
    },
    widgets: [
      {
        id: `${id}-widget`,
        name,
        type: WIDGET_TYPES.FeaturedCollectionGrid,
        dataSourceKey,
        settings: {
          variant: "v1",
          categoryTitle,
          collectionHandle,
        },
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Helper: section config for a CollectionPage widget                  */
/*  Renders a titled product grid for a single collection. Used to show */
/*  the four live collections (Most Loved / Trending / Expert Hair Care */
/*  Range / Explore more) as stacked CollectionPage sections.           */
/* ------------------------------------------------------------------ */
function collectionPageSection(
  id: string,
  name: string,
  title: string,
  dataSourceKey: string
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
        id: `${id}-widget`,
        name,
        type: WIDGET_TYPES.CollectionPage,
        dataSourceKey,
        settings: {
          variant: "v1",
          autoLoadMore: false,
          showFilterAndSort: false,
          showActionButton: true,
          actionButtonText: "t:common.product_card.add_to_cart",
          soldOutText: "t:common.product_card.sold_out",
          showBadge: true,
          showRating: true,
          actionButtonTextColor: "#ffffff",
          sectionTextColor: "#1D1D1D",
          title,
        },
      },
    ],
  };
}

export const template: PageConfig = {
  id: "bblunt-2-shine-squad-get999",
  dataSources: {
    mostLovedCollection: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "most-loved-home-page",
        productLimit: 1,
      },
      required: false,
    },
    // Hardcoded sale-page collection feeding the CollectionPage widget.
    saleCollectionData: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "anti-dandruff",
      },
      options: {
        version: "v2",
        params: { first: 12 },
      },
      required: false,
    },

    // Multiple-collection product carousels (mirrors live shine-squad-b2g2).
    mostLovedCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "most-loved-single-products" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    trendingCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "trending-single-products" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    expertHairCareCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "expert-hair-care-range-single-products" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    exploreMoreCarousel: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "explore-more-single-products" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
  },
  sections: [
    // TODO: Enable this section if we are showing the sale banner according bblunt.com
    // Hero Banner Section
    // {
    //   id: "hero-banner-section",
    //   name: "Hero Banner",
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
    //       id: "shine-squad-get999-hero-banner",
    //       name: "Hero Banner",
    //       type: WIDGET_TYPES.HeroBanner,
    //       settings: {
    //         variant: "v1",
    //         desktopImage: "t:bblunt-2_shine-squad-get999_default.hero_banner.desktopImage",
    //         mobileImage: "t:bblunt-2_shine-squad-get999_default.hero_banner.mobileImage",
    //         alt: "t:bblunt-2_shine-squad-get999_default.hero_banner.alt",
    //         mobileAspectRatio: "t:bblunt-2_shine-squad-get999_default.hero_banner.mobileAspectRatio",
    //         desktopAspectRatio: "t:bblunt-2_shine-squad-get999_default.hero_banner.desktopAspectRatio",
    //       },
    //     },
    //   ],
    // },

    // TODO: Enable this section if we are showing the sale banner according bblunt.com
    // How It Works Banner Section
    // {
    //   id: "how-it-works-banner-section",
    //   name: "How It Works Banner",
    //   type: SECTION_TYPES.CONTENT_SECTION,
    //   settings: {
    //     layout: SECTION_LAYOUT_OPTIONS.FULL,
    //     responsive: {
    //       mobile: { padding: { top: 56, right: 0, bottom: 22, left: 0 } },
    //       tablet: { padding: { top: 56, right: 0, bottom: 22, left: 0 } },
    //       desktop: { padding: { top: 56, right: 0, bottom: 22, left: 0 } },
    //     },
    //   },
    //   widgets: [
    //     {
    //       id: "shine-squad-get999-how-it-works-banner",
    //       name: "How It Works Banner",
    //       type: WIDGET_TYPES.HowItWorksBanner,
    //       settings: {
    //         variant: "v1",
    //         desktopImage: "t:bblunt-2_shine-squad-get999_default.how_it_works_banner.desktopImage",
    //         mobileImage: "t:bblunt-2_shine-squad-get999_default.how_it_works_banner.mobileImage",
    //         alt: "t:bblunt-2_shine-squad-get999_default.how_it_works_banner.alt",
    //         mobileAspectRatio: "t:bblunt-2_shine-squad-get999_default.how_it_works_banner.mobileAspectRatio",
    //         desktopAspectRatio: "t:bblunt-2_shine-squad-get999_default.how_it_works_banner.desktopAspectRatio",
    //       },
    //     },
    //   ],
    // },

    // TODO: Enable this section if we are showing the sale banner according bblunt.com
    // Countdown Timer Section
    // {
    //   id: "countdown-timer-section",
    //   name: "Countdown Timer",
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
    //       id: "shine-squad-get999-countdown-timer",
    //       name: "Countdown Timer",
    //       type: WIDGET_TYPES.CountdownTimer,
    //       settings: {
    //         variant: "v1",
    //         targetDate: "t:bblunt-2_shine-squad-get999_default.countdown_timer.targetDate",
    //         heading: "t:bblunt-2_shine-squad-get999_default.countdown_timer.heading",
    //         subheading: "t:bblunt-2_shine-squad-get999_default.countdown_timer.subheading",
    //         expiredText: "t:bblunt-2_shine-squad-get999_default.countdown_timer.expiredText",
    //       },
    //     },
    //   ],
    // },

    // ── Sale Page Banner Section ───────────────────────────────────
    {
      id: "sale-page-banner-section",
      name: "Sale Page Banner",
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
          id: "shine-squad-get999-sale-page-banner",
          name: "Sale Page Banner",
          type: WIDGET_TYPES.SalePageBanner,
          settings: {
            variant: "v1",
            timerInterval: 1000,
            mobileSrc:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.mobileSrc",
            desktopSrc:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.desktopSrc",
            offerTitle:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.offer.title",
            offerPrice:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.offer.price",
            currencySymbol:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.offer.currencySymbol",
            couponCode:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.offer.couponCode",
            expiryText:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.offer.expiryText",
            endDateString:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.countdown",
            bannerCtaLabel:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.banner_cta",
            howToShopTitle:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.how_to_shop_title",
            howToShopSteps:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.how_to_shop_steps__rich",
            termsAndConditionsTitle:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.terms_and_conditions.title",
            termsAndConditionsPoints:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.terms_and_conditions.points",
            primaryButtonLabel:
              "t:bblunt-2_shine-squad-get999_default.sale_banner.primary_button",
          },
        },
      ],
    },

    // ── Four Collection Grids (one CollectionPage per collection, mirrors live) ──
    collectionPageSection(
      "most-loved",
      "Most Loved",
      "t:bblunt-2_shine-squad-get999_default.collection_sections.most_loved",
      "mostLovedCarousel"
    ),
    collectionPageSection(
      "trending",
      "Trending",
      "t:bblunt-2_shine-squad-get999_default.collection_sections.trending",
      "trendingCarousel"
    ),
    collectionPageSection(
      "expert-hair-care-range",
      "Expert Hair Care Range",
      "t:bblunt-2_shine-squad-get999_default.collection_sections.expert_hair_care_range",
      "expertHairCareCarousel"
    ),
    collectionPageSection(
      "explore-more",
      "Explore more",
      "t:bblunt-2_shine-squad-get999_default.collection_sections.explore_more",
      "exploreMoreCarousel"
    ),

    // ── 4 Product Category Grid Sections (kept as TODO for parity) ─
    // categoryGridSection(
    //   "most-loved",
    //   "Most Loved",
    //   "t:bblunt-2_shine-squad-get999_default.most_loved_grid.category_title",
    //   40,
    //   "mostLovedCollection",
    //   "most-loved-home-page"
    // ),

    // ── Sale Collection Page Section ───────────────────────────────
    // Disabled to match live bblunt.com/pages/shine-squad-get999, which shows
    // the multiple-collection carousels above (Most Loved / Trending / Expert
    // Hair Care Range / Explore more) instead of a single most-loved grid.
    // Re-enable if a filterable sale grid is wanted on this page.
    /* {
      id: "sale-collection-page-section",
      name: "Sale Collection Page",
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
          id: "shine-squad-get999-sale-collection-page",
          name: "Sale Collection Page",
          type: WIDGET_TYPES.CollectionPage,
          dataSourceKey: "saleCollectionData",
          settings: {
            variant: "v1",
            autoLoadMore: false,
            showFilterAndSort: false,
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart",
            soldOutText: "t:common.product_card.sold_out",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#ffffff",
            sectionTextColor: "#1D1D1D",
            title:
              "t:bblunt-2_shine-squad-get999_default.sale_collection.title",
          },
        },
      ],
    },
    */
  ],
};
