import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * About Us Page Template for momsco
 */
export const template: PageConfig = {
  id: "momsco-about-us",
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

    // About Us Content Section
    {
      id: "about-us-section",
      name: "About Us",
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
          id: "nintarababy-about-us",
          name: "About Us",
          type: WIDGET_TYPES.AboutUs,
          settings: {
            variant: "v1",
            title: "t:about-us.title",
            heroDesktopImage: "t:about-us.hero_desktop_image",
            heroMobileImage: "t:about-us.hero_mobile_image",
            heroAlt: "t:about-us.hero_alt",
            block1Image: "t:about-us.story_block1_image",
            block1Heading: "t:about-us.story_block1_heading",
            block1Text: "t:about-us.story_block1_text",
            block2Image: "t:about-us.story_block2_image",
            block2Heading: "t:about-us.story_block2_heading",
            block2Text: "t:about-us.story_block2_text",
            block3Image: "t:about-us.story_block3_image",
            block3Heading: "t:about-us.story_block3_heading",
            block3Text: "t:about-us.story_block3_text",
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
