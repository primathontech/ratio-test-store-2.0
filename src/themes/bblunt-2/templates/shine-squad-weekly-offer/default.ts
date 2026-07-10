import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Shine Squad Weekly Offer Page Template for bblunt-2
 * URL: /pages/shine-squad-weekly-offer
 *
 * 4 product category grids fetching live data via COLLECTION_BY_HANDLES.
 */

/* ------------------------------------------------------------------ */
/*  Helper: section config for a FeaturedCollectionGrid widget            */
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

/* ------------------------------------------------------------------ */
/*  Template                                                           */
/* ------------------------------------------------------------------ */

export const template: PageConfig = {
  id: "bblunt-2-shine-squad-weekly-offer",
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
    // Mirrors bblunt's `fb-*-category-sale` pattern: the slug is fixed at
    // the template level instead of being read from route params.
    saleCollectionData: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "most-loved-home-page",
      },
      options: {
        version: "v2",
        params: { first: 12 },
      },
      required: false,
    },

    // Multiple-collection product grids (one CollectionPage per collection).
    mostLovedSale: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "most-loved-sale-page" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    hairFallControl: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "for-hair-fall-control-home-page" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    partyReady: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "for-party-ready-hair-at-home-home-page" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    salonSecret: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "salon-secret-home-page" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    dullDry: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "for-dull-dry-hair-home-page" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    damageRepair: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "for-damage-repair-home-page" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    advanceSmoothening: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "for-advance-smoothening-home-page" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    dandruffControl: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "for-dandruff-control-home-page" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    extraordinaryShiny: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "for-extraordinary-shiny-hair-home-page" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    bondRepair: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "sale-page-for-bond-repair" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    fiveMinShampoo: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { handle: "5-minute-shampoo-hair-colour-home-page" },
      options: { version: "v2", params: { first: 12 } },
      required: false,
    },
    // trendingCollection: {
    //   type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
    //   params: {
    //     handles: ["trending-single-products"],
    //     productLimit: 12,
    //   },
    //   required: false,
    // },
    // expertHairCareCollection: {
    //   type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
    //   params: {
    //     handles: ["expert-hair-care-range-single-products"],
    //     productLimit: 12,
    //   },
    //   required: false,
    // },
    // exploreMoreCollection: {
    //   type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
    //   params: {
    //     handles: ["explore-more-single-products"],
    //     productLimit: 12,
    //   },
    //   required: false,
    // },
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
    //       id: "shine-squad-hero-banner",
    //       name: "Hero Banner",
    //       type: WIDGET_TYPES.HeroBanner,
    //       settings: {
    //         variant: "v1",
    //         desktopImage:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.hero_banner.desktopImage",
    //         mobileImage:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.hero_banner.mobileImage",
    //         alt: "t:bblunt-2_shine-squad-weekly-offer_default.hero_banner.alt",
    //         mobileAspectRatio:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.hero_banner.mobileAspectRatio",
    //         desktopAspectRatio:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.hero_banner.desktopAspectRatio",
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
    //       id: "shine-squad-how-it-works-banner",
    //       name: "How It Works Banner",
    //       type: WIDGET_TYPES.HowItWorksBanner,
    //       settings: {
    //         variant: "v1",
    //         desktopImage:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.how_it_works_banner.desktopImage",
    //         mobileImage:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.how_it_works_banner.mobileImage",
    //         alt: "t:bblunt-2_shine-squad-weekly-offer_default.how_it_works_banner.alt",
    //         mobileAspectRatio:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.how_it_works_banner.mobileAspectRatio",
    //         desktopAspectRatio:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.how_it_works_banner.desktopAspectRatio",
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
    //       id: "shine-squad-countdown-timer",
    //       name: "Countdown Timer",
    //       type: WIDGET_TYPES.CountdownTimer,
    //       settings: {
    //         variant: "v1",
    //         targetDate:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.countdown_timer.targetDate",
    //         heading:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.countdown_timer.heading",
    //         subheading:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.countdown_timer.subheading",
    //         expiredText:
    //           "t:bblunt-2_shine-squad-weekly-offer_default.countdown_timer.expiredText",
    //       },
    //     },
    //   ],
    // },

    // ── Sale Page Banner Section ───────────────────────────────────
    // Ported from bblunt's `fb-heat-protection-category-sale` page:
    // hero with offer + countdown + "How to shop" modal CTA.
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
          id: "shine-squad-sale-page-banner",
          name: "Sale Page Banner",
          type: WIDGET_TYPES.SalePageBanner,
          settings: {
            variant: "v1",
            timerInterval: 1000,
            mobileSrc:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.mobileSrc",
            desktopSrc:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.desktopSrc",
            offerTitle:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.offer.title",
            offerPrice:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.offer.price",
            currencySymbol:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.offer.currencySymbol",
            couponCode:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.offer.couponCode",
            expiryText:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.offer.expiryText",
            endDateString:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.countdown",
            bannerCtaLabel:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.banner_cta",
            howToShopTitle:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.how_to_shop_title",
            howToShopSteps:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.how_to_shop_steps__rich",
            termsAndConditionsTitle:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.terms_and_conditions.title",
            termsAndConditionsPoints:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.terms_and_conditions.points",
            primaryButtonLabel:
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_banner.primary_button",
          },
        },
      ],
    },

    // ── Collection Grids (one CollectionPage per collection) ───────
    collectionPageSection(
      "most-loved",
      "Most Loved",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.most_loved",
      "mostLovedSale"
    ),
    collectionPageSection(
      "hair-fall-control",
      "For Hair Fall Control",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.hair_fall_control",
      "hairFallControl"
    ),
    collectionPageSection(
      "party-ready",
      "For Party Ready Hair at Home",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.party_ready",
      "partyReady"
    ),
    collectionPageSection(
      "salon-secret",
      "High Shine Creme Hair Colour",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.salon_secret",
      "salonSecret"
    ),
    collectionPageSection(
      "dull-dry-hair",
      "For Dull & Dry Hair",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.dull_dry_hair",
      "dullDry"
    ),
    collectionPageSection(
      "damage-repair",
      "For Damage Repair",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.damage_repair",
      "damageRepair"
    ),
    collectionPageSection(
      "advanced-smoothening",
      "For Advanced Smoothening",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.advanced_smoothening",
      "advanceSmoothening"
    ),
    collectionPageSection(
      "dandruff-control",
      "For Dandruff Control",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.dandruff_control",
      "dandruffControl"
    ),
    collectionPageSection(
      "extraordinary-shiny",
      "For Extraordinary Shiny Hair",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.extraordinary_shiny",
      "extraordinaryShiny"
    ),
    collectionPageSection(
      "bond-repair",
      "For Bond Repair",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.bond_repair",
      "bondRepair"
    ),
    collectionPageSection(
      "five-min-shampoo",
      "5 Minute Shampoo Hair Colour",
      "t:bblunt-2_shine-squad-weekly-offer_default.collection_sections.five_min_shampoo",
      "fiveMinShampoo"
    ),

    // ── 4 Product Category Grid Sections ───────────────────────────
    // categoryGridSection(
    //   "most-loved",
    //   "Most Loved",
    //   "t:bblunt-2_shine-squad-weekly-offer_default.most_loved_grid.category_title",
    //   40,
    //   "mostLovedCollection",
    //   "most-loved-home-page"
    // ),

    // categoryGridSection(
    //   "trending",
    //   "Trending",
    //   "Trending",
    //   48,
    //   "trendingCollection",
    //   "trending-single-products"
    // ),

    // categoryGridSection(
    //   "expert-hair-care",
    //   "Expert Hair Care Range",
    //   "Expert Hair Care Range",
    //   48,
    //   "expertHairCareCollection",
    //   "expert-hair-care-range-single-products"
    // ),

    // categoryGridSection(
    //   "explore-more",
    //   "Explore More",
    //   "Explore More",
    //   48,
    //   "exploreMoreCollection",
    //   "explore-more-single-products"
    // ),

    // ── Sale Collection Page Section ───────────────────────────────
    // Disabled: the page now renders the multiple-collection grids above
    // instead of a single sale collection. Re-enable if a single filterable
    // sale grid is wanted on this page.
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
          id: "shine-squad-sale-collection-page",
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
              "t:bblunt-2_shine-squad-weekly-offer_default.sale_collection.title",
          },
        },
      ],
    },
    */
  ],
};
