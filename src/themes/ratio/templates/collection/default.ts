import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Collection Page Template for ratio
 *
 * `collectionData` is fed by the v2 collection API. The handle is injected
 * by the page builder from the route (`/collections/[collectionname]`),
 * so `params: {}` is intentional — the builder merges `routeContext.params`
 * into each dataSource at render time.
 */
export const template: PageConfig = {
  id: "ratio-collection",
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
              "t:ratio_collection_default.banner.mobileAspectRatio",
            desktopAspectRatio:
              "t:ratio_collection_default.banner.desktopAspectRatio",
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
    //           "t:ratio_collection_default.collection_timer.endDateString",
    //         timerInterval: 1000,
    //         urgencyText:
    //           "t:ratio_collection_default.collection_timer.urgencyText",
    //         saleLabel:
    //           "t:ratio_collection_default.collection_timer.saleLabel",
    //         expiredText:
    //           "t:ratio_collection_default.collection_timer.expiredText",
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
  ],
};
