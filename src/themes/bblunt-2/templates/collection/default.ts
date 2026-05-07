import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Collection Page Template for bblunt-2
 *
 * `collectionData` is fed by the v2 collection API. The handle is injected
 * by the page builder from the route (`/collections/[collectionname]`),
 * so `params: {}` is intentional — the builder merges `routeContext.params`
 * into each dataSource at render time.
 */
export const template: PageConfig = {
  id: "bblunt-2-collection",
  dataSources: {
    collectionData: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {},
      options: {
        version: "v2",
        params: { productLimit: 24 },
      },
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
          settings: { variant: "v1" },
        },
      ],
    },

    // Collection Hero Banner Section
    {
      id: "collection-hero-banner-section",
      name: "Collection Hero Banner",
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
          id: "collection-hero-banner-widget",
          name: "Collection Hero Banner",
          type: WIDGET_TYPES.CollectionHeroBanner,
          dataSourceKey: "collectionData",
          settings: {
            variant: "v1",
            bannerCarousel: [],
            autoplay: true,
            autoplayInterval: 5000,
            loop: true,
            pauseOnHover: true,
            draggable: true,
            showIndicators: true,
            indicatorType: "simple",
            mobileAspectRatio: "1/1",
            desktopAspectRatio: "1440/450",
          },
        },
      ],
    },

    // Collection Timer Section (urgency strip)
    {
      id: "collection-timer-section",
      name: "Collection Timer",
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
          id: "collection-timer-widget",
          name: "Collection Timer",
          type: WIDGET_TYPES.CollectionTimer,
          settings: {
            variant: "v1",
            endDateString: "Dec 31, 2026 23:59:59",
            urgencyText: "Hurry Up!",
            saleLabel: "Sale ends in:",
            expiredText: "Oops! Offer is Expired",
            visible: true,
            backgroundColor: "#ffffff",
            textColor: "#1D1D1D",
            urgencyColor: "#FF0000",
            timerInterval: 1000,
          },
        },
      ],
    },

    // Collection Page Section
    {
      id: "collection-page-section",
      name: "Collection Page",
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
          id: "collection-page-widget",
          name: "Collection Page",
          type: WIDGET_TYPES.CollectionPage,
          dataSourceKey: "collectionData",
          settings: {
            variant: "v1",
          },
        },
      ],
    },

    // FAQ Accordion Section
    {
      id: "faq-accordion-section",
      name: "FAQ Accordion",
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
          id: "faq-accordion-widget",
          name: "FAQ Accordion",
          type: WIDGET_TYPES.FaqAccordion,
          dataSourceKey: "collectionData",
          settings: {
            variant: "v1",
            title: "FAQ",
          },
        },
      ],
    },

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
          id: "shine-academy-banner-widget",
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
          id: "testimonials-widget",
          name: "Testimonials",
          type: WIDGET_TYPES.Testimonials,
          settings: {
            variant: "v1",
            heading: "t:common.testimonials.heading__rich",
            cardBackground: "rgb(29, 29, 29)",
            starColor: "rgb(255, 192, 2)",
            testimonials: "t:common.testimonials.items",
          },
        },
      ],
    },

    // Additional Info Accordion Section (SEO content)
    {
      id: "additional-info-accordion-section",
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
          id: "additional-info-accordion-widget",
          name: "Additional Information Accordion",
          type: WIDGET_TYPES.AdditionalInformation,
          dataSourceKey: "collectionData",
          settings: {
            variant: "v2",
            title: "Additional Information",
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
          id: "breadcrumb-widget",
          name: "Breadcrumb",
          type: WIDGET_TYPES.Breadcrumb,
          settings: {
            variant: "v1",
            items: [{ text: "Home", href: "/" }, { text: "Shampoo" }],
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
          mobile: { padding: { top: 20, right: 0, bottom: 60, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
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
