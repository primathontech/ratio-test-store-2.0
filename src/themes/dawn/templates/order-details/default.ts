import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Order Details Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-order-details",
  dataSources: {
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [
    // Announcement Bar Section (commented out — editor sync issue with common translations)
    // {
    //   id: "announcement-bar-section",
    //   name: "AnnouncementBar",
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
    //       id: "nintarababy-announcement-bar",
    //       name: "AnnouncementBar",
    //       type: WIDGET_TYPES.AnnouncementBar,
    //       settings: {
    //         variant: "v1",
    //         autoPlayInterval: 4500,
    //         pauseOnHover: true,
    //         transitionDuration: 600,
    //         messages: "t:common.announcement_bar.messages",
    //       },
    //     },
    //   ],
    // },
    // Order Details Section
    {
      id: "order-details-section",
      name: "OrderDetails",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 20, right: 0, bottom: 20, left: 0 } },
          tablet: { padding: { top: 30, right: 0, bottom: 30, left: 0 } },
          desktop: { padding: { top: 40, right: 0, bottom: 40, left: 0 } },
        },
      },
      widgets: [
        {
          id: "nintarababy-order-details",
          name: "OrderDetails",
          type: WIDGET_TYPES.OrderDetails,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
