import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Account Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-account",
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
            logoPath: "t:common.header.logoPath",
            isSticky: true,
            hideOnScrollDown: true,
            searchPlaceholder: "t:common.header.searchPlaceholder",
            whatsappHref: "t:common.header.whatsappHref",
            cartHref: "t:common.header.cartHref",
            navLinks: "t:common.header.navLinks",
            dropdownItems: "t:common.header.dropdownItems",
          },
        },
      ],
    },

    // Account Section
    {
      id: "account-section",
      name: "Account",
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
          id: "nintarababy-account",
          name: "Account",
          type: WIDGET_TYPES.Account,
          settings: { variant: "v1" },
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
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "nintarababy-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          dataSourceKey: "collectionDataAll",
          settings: {
            variant: "v1",
            seoHeading: "t:common.footer.seoHeading",
            contactAddress: "t:common.footer.contactAddress",
            contactWhatsapp: "t:common.footer.contactWhatsapp",
            contactEmail: "t:common.footer.contactEmail",
            categoriesHeading: "t:common.footer.categoriesHeading",
            helpHeading: "t:common.footer.helpHeading",
            otherLinksHeading: "t:common.footer.otherLinksHeading",
            newsletterHeading: "t:common.footer.newsletterHeading",
            facebookUrl: "t:common.footer.facebookUrl",
            instagramUrl: "t:common.footer.instagramUrl",
            helpLinks: "t:common.footer.helpLinks",
            otherLinks: "t:common.footer.otherLinks",
            categoryLinks: "t:common.footer.categoryLinks",
          },
        },
      ],
    },

    // Bottom Bar Section
    {
      id: "bottom-bar-section",
      name: "BottomBar",
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
          id: "nintarababy-bottom-bar",
          name: "BottomBar",
          type: WIDGET_TYPES.BottomBar,
          settings: {
            variant: "v1",
            copyrightText: "t:common.bottom_bar.copyrightText",
          },
        },
      ],
    },
  ],
};
