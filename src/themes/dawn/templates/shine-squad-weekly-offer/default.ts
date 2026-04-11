import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Shine Squad Weekly Offer Page Template for dawn
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
/*  Template                                                           */
/* ------------------------------------------------------------------ */

export const template: PageConfig = {
  id: "dawn-shine-squad-weekly-offer",
  dataSources: {
    mostLovedCollection: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "most-loved-home-page",
        productLimit: 1,
      },
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
                text: "Buy 3 Products at \u20B9999 | Use code : ",
                href: "/pages/flat3",
                boldPart: "FLAT3",
              },
              {
                text: "Shop for \u20B9499 & Get 2 Best Sellers FREE | Code : ",
                href: "/pages/shine-squad-weekly-offer",
                boldPart: "FREEHF",
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

    // Hero Banner Section
    {
      id: "hero-banner-section",
      name: "Hero Banner",
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
          id: "shine-squad-hero-banner",
          name: "Hero Banner",
          type: WIDGET_TYPES.HeroBanner,
          settings: {
            variant: "v1",
            desktopImage: "/HeroBanner/images/hero-desktop.jpg",
            mobileImage: "/HeroBanner/images/hero-mobile.jpg",
            alt: "Hair Fall Control Freebies - Use Code FREEHF - Shop Now",
            desktopWidth: 1440,
            desktopHeight: 529,
            mobileWidth: 1200,
            mobileHeight: 1200,
            paddingBottom: 7,
          },
        },
      ],
    },

    // How It Works Banner Section
    {
      id: "how-it-works-banner-section",
      name: "How It Works Banner",
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
          id: "shine-squad-how-it-works-banner",
          name: "How It Works Banner",
          type: WIDGET_TYPES.HowItWorksBanner,
          settings: {
            variant: "v1",
            desktopImage: "/HowItWorksBanner/images/howtoshop-desktop.jpg",
            mobileImage: "/HowItWorksBanner/images/howtoshop-mobile.jpg",
            alt: "How To Shop: 1. Add favorites worth 499 to cart, 2. Apply code FREEHF at checkout, 3. Free products delivered with your order",
            desktopWidth: 5692,
            desktopHeight: 692,
            mobileWidth: 1500,
            mobileHeight: 1167,
            containerMaxWidth: 1300,
            marginTop: 56,
            paddingBottom: 22,
          },
        },
      ],
    },

    // Countdown Timer Section
    {
      id: "countdown-timer-section",
      name: "Countdown Timer",
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
          id: "shine-squad-countdown-timer",
          name: "Countdown Timer",
          type: WIDGET_TYPES.CountdownTimer,
          settings: {
            variant: "v1",
            targetDate: "Apr 12, 2026 00:00:00",
            heading: "Hurry Up!",
            subheading: "Hurry! Offer Will Expire in",
            expiredText: "Oops! Offer is Expired",
          },
        },
      ],
    },

    // ── 4 Product Category Grid Sections ───────────────────────────
    categoryGridSection(
      "most-loved",
      "Most Loved",
      "Most Loved",
      40,
      "mostLovedCollection",
      "most-loved-home-page"
    ),

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
  ],
};
