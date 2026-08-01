import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Header chrome template for dawn (momsco).
 *
 * Shared layout chrome (Shopify "header-group" model): announcement bar + header.
 * Rendered once by the root layout via `renderChrome()` and placed above page
 * content on every page. Page templates must NOT include these sections.
 *
 * `menuHandle` is what wires the live admin mega menu (useNav("main-menu")); the
 * collectionDataAll source still feeds the header's collection-metadata nav as a
 * fallback when no admin menu is published.
 */
export const template: PageConfig = {
  id: "dawn-header",
  dataSources: {
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [
    // Announcement Bar Section
    {
      id: "announcement-bar-section",
      name: "AnnouncementBar",
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
          id: "nintarababy-announcement-bar",
          name: "AnnouncementBar",
          type: WIDGET_TYPES.AnnouncementBar,
          settings: {
            variant: "v1",
            autoPlayInterval: 4500,
            pauseOnHover: true,
            transitionDuration: 600,
            messages: "t:common.announcement_bar.messages",
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
          id: "nintarababy-header",
          name: "Header",
          type: WIDGET_TYPES.Header,
          dataSourceKey: "collectionDataAll",
          settings: {
            variant: "v1",
            menuHandle: "main-menu",
            logoPath: "t:common.header.logoPath",
            isSticky: "t:common.header.isSticky",
            hideOnScrollDown: "t:common.header.hideOnScrollDown",
            searchPlaceholder: "t:common.header.searchPlaceholder",
            whatsappHref: "t:common.header.whatsappHref",
            cartHref: "t:common.header.cartHref",
            navLinks: "t:common.header.navLinks",
            dropdownItems: "t:common.header.dropdownItems",
          },
        },
      ],
    },
  ],
};
