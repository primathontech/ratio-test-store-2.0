import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Header chrome template for ratio.
 *
 * Shared layout chrome (Shopify "header-group" model). Rendered once by the
 * root layout via `renderChrome()` and placed above page content on every page.
 * Page templates must NOT include an announcement-bar or header section.
 */
export const template: PageConfig = {
  id: "ratio-header",
  dataSources: {},
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
          id: "ratio-announcement-bar",
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
          id: "ratio-header",
          name: "Header",
          type: WIDGET_TYPES.RatioHeader,
          settings: {
            variant: "v1",
            menuHandle: "main-menu",
            logoSrc: "t:common.header.logoSrc",
            searchSuggestions: "t:common.header.searchSuggestions",
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
  ],
};
