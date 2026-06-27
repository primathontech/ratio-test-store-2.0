import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * aff-offer-flat250 sale-page template for bblunt-2.
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

export const template: PageConfig = {
  id: "bblunt-2-aff-offer-flat250",
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
        handle: "most-loved-home-page",
      },
      options: {
        version: "v2",
        params: { first: 12 },
      },
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
    //       id: "aff-offer-flat250-hero-banner",
    //       name: "Hero Banner",
    //       type: WIDGET_TYPES.HeroBanner,
    //       settings: {
    //         variant: "v1",
    //         desktopImage: "t:bblunt-2_aff-offer-flat250_default.hero_banner.desktopImage",
    //         mobileImage: "t:bblunt-2_aff-offer-flat250_default.hero_banner.mobileImage",
    //         alt: "t:bblunt-2_aff-offer-flat250_default.hero_banner.alt",
    //         mobileAspectRatio: "t:bblunt-2_aff-offer-flat250_default.hero_banner.mobileAspectRatio",
    //         desktopAspectRatio: "t:bblunt-2_aff-offer-flat250_default.hero_banner.desktopAspectRatio",
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
    //       id: "aff-offer-flat250-how-it-works-banner",
    //       name: "How It Works Banner",
    //       type: WIDGET_TYPES.HowItWorksBanner,
    //       settings: {
    //         variant: "v1",
    //         desktopImage: "t:bblunt-2_aff-offer-flat250_default.how_it_works_banner.desktopImage",
    //         mobileImage: "t:bblunt-2_aff-offer-flat250_default.how_it_works_banner.mobileImage",
    //         alt: "t:bblunt-2_aff-offer-flat250_default.how_it_works_banner.alt",
    //         mobileAspectRatio: "t:bblunt-2_aff-offer-flat250_default.how_it_works_banner.mobileAspectRatio",
    //         desktopAspectRatio: "t:bblunt-2_aff-offer-flat250_default.how_it_works_banner.desktopAspectRatio",
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
    //       id: "aff-offer-flat250-countdown-timer",
    //       name: "Countdown Timer",
    //       type: WIDGET_TYPES.CountdownTimer,
    //       settings: {
    //         variant: "v1",
    //         targetDate: "t:bblunt-2_aff-offer-flat250_default.countdown_timer.targetDate",
    //         heading: "t:bblunt-2_aff-offer-flat250_default.countdown_timer.heading",
    //         subheading: "t:bblunt-2_aff-offer-flat250_default.countdown_timer.subheading",
    //         expiredText: "t:bblunt-2_aff-offer-flat250_default.countdown_timer.expiredText",
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
          id: "aff-offer-flat250-sale-page-banner",
          name: "Sale Page Banner",
          type: WIDGET_TYPES.SalePageBanner,
          settings: {
            variant: "v1",
            timerInterval: 1000,
            mobileSrc:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.mobileSrc",
            desktopSrc:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.desktopSrc",
            offerTitle:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.offer.title",
            offerPrice:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.offer.price",
            currencySymbol:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.offer.currencySymbol",
            couponCode:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.offer.couponCode",
            expiryText:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.offer.expiryText",
            endDateString:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.countdown",
            bannerCtaLabel:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.banner_cta",
            howToShopTitle:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.how_to_shop_title",
            howToShopSteps:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.how_to_shop_steps__rich",
            termsAndConditionsTitle:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.terms_and_conditions.title",
            termsAndConditionsPoints:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.terms_and_conditions.points",
            primaryButtonLabel:
              "t:bblunt-2_aff-offer-flat250_default.sale_banner.primary_button",
          },
        },
      ],
    },

    // ── 4 Product Category Grid Sections (kept as TODO for parity) ─
    // categoryGridSection(
    //   "most-loved",
    //   "Most Loved",
    //   "t:bblunt-2_aff-offer-flat250_default.most_loved_grid.category_title",
    //   40,
    //   "mostLovedCollection",
    //   "most-loved-home-page"
    // ),

    // ── Sale Collection Page Section ───────────────────────────────
    {
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
          id: "aff-offer-flat250-sale-collection-page",
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
            title: "t:bblunt-2_aff-offer-flat250_default.sale_collection.title",
          },
        },
      ],
    },
  ],
};
