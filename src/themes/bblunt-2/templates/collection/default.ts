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
        params: { first: 12 },
      },
      required: true,
    },
  },
  sections: [
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
            autoplay: true,
            autoplayInterval: 5000,
            loop: true,
            pauseOnHover: true,
            draggable: true,
            showIndicators: true,
            indicatorType: "simple",
            mobileAspectRatio:
              "t:bblunt-2_collection_default.banner.mobileAspectRatio",
            desktopAspectRatio:
              "t:bblunt-2_collection_default.banner.desktopAspectRatio",
          },
        },
      ],
    },

    // Collection Timer Section (urgency strip)
    // {
    //   id: "collection-timer-section",
    //   name: "Collection Timer",
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
    //       id: "collection-timer-widget",
    //       name: "Collection Timer",
    //       type: WIDGET_TYPES.CollectionTimer,
    //       settings: {
    //         variant: "v1",
    //         visible: true,
    //         endDateString:
    //           "t:bblunt-2_collection_default.collection_timer.endDateString",
    //         timerInterval: 1000,
    //         urgencyText:
    //           "t:bblunt-2_collection_default.collection_timer.urgencyText",
    //         saleLabel:
    //           "t:bblunt-2_collection_default.collection_timer.saleLabel",
    //         expiredText:
    //           "t:bblunt-2_collection_default.collection_timer.expiredText",
    //         backgroundColor: "#ffffff",
    //         textColor: "#1D1D1D",
    //         urgencyColor: "#FF0000",
    //       },
    //     },
    //   ],
    // },

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
            autoLoadMore: true,

            // Card settings
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart",
            soldOutText: "t:common.product_card.sold_out",
            currencySymbol: "₹",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#fff",
            sectionTextColor: "#1D1D1D",

            // Product Filter And Grid Settings
            filterTitle: "t:common.collection_page.filter_title",
            sortDropdownText:
              "t:common.collection_page.sort_dropdown_button_text",
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
            title: "t:bblunt-2_collection_default.collection_faq.title",
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
            title:
              "t:bblunt-2_collection_default.collection_additional_information.title",
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
  ],
};
