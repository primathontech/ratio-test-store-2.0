import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Terms & Conditions Page Template for bblunt-2
 */
export const template: PageConfig = {
  id: "bblunt-2-terms-and-conditions",
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
          settings: {
            variant: "v1",
            logoSrc: "t:common.header.logoSrc",
            searchPlaceholder: "t:common.header.searchPlaceholder",
            searchSuggestions: "t:common.header.searchSuggestions",
            product_label: "t:common.header.product_label",
            product_href: "t:common.header.product_href",
            product_items: "t:common.header.product_items",
            hair_care_label: "t:common.header.hair_care_label",
            hair_care_href: "t:common.header.hair_care_href",
            hair_care_type_label: "t:common.header.hair_care_type_label",
            hair_care_type_href: "t:common.header.hair_care_type_href",
            hair_care_type_items: "t:common.header.hair_care_type_items",
            hair_care_concern_label: "t:common.header.hair_care_concern_label",
            hair_care_concern_href: "t:common.header.hair_care_concern_href",
            hair_care_concern_items: "t:common.header.hair_care_concern_items",
            hair_colour_label: "t:common.header.hair_colour_label",
            hair_colour_href: "t:common.header.hair_colour_href",
            hair_colour_items: "t:common.header.hair_colour_items",
            hair_styling_label: "t:common.header.hair_styling_label",
            hair_styling_href: "t:common.header.hair_styling_href",
            hair_styling_items: "t:common.header.hair_styling_items",
            salon_label: "t:common.header.salon_label",
            salon_href: "t:common.header.salon_href",
            salon_items: "t:common.header.salon_items",
            getApp: "t:common.header.get_app",
          },
        },
      ],
    },

    // SEO Metadata Section
    {
      id: "seo-metadata-section",
      name: "SEO Metadata",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
      },
      widgets: [
        {
          id: "seo-metadata-widget",
          name: "SEO Metadata",
          type: WIDGET_TYPES.SEOMetadata,
          settings: {
            variant: "v1",
            title: "t:bblunt-2_terms-and-conditions_default.seo_metadata.title",
            description:
              "t:bblunt-2_terms-and-conditions_default.seo_metadata.description",
            canonical:
              "t:bblunt-2_terms-and-conditions_default.seo_metadata.canonical",
          },
        },
      ],
    },

    // Terms & Conditions Content Section
    {
      id: "terms-and-conditions-content-section",
      name: "Terms & Conditions Content",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 15, right: 15, bottom: 12, left: 15 } },
          tablet: { padding: { top: 17, right: 30, bottom: 14, left: 30 } },
          desktop: { padding: { top: 20, right: 30, bottom: 17, left: 30 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-terms-and-conditions-content",
          name: "Terms & Conditions Content",
          type: WIDGET_TYPES.CustomHtml,
          settings: {
            variant: "v1",
            html: "t:bblunt-2_terms-and-conditions_default.content__rich",
          },
        },
      ],
    },

    // Delete Account Section
    {
      id: "terms-and-conditions-delete-account-section",
      name: "Delete Account",
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
          id: "bblunt-2-terms-and-conditions-delete-account",
          name: "Delete Account",
          type: WIDGET_TYPES.DeleteAccount,
          settings: {
            variant: "v1",
            heading: "t:common.deleteAccount.heading",
            description: "t:common.deleteAccount.description",
            submitLabel: "t:common.deleteAccount.submitLabel",
            successMessage: "t:common.deleteAccount.successMessage",
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
          mobile: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "bblunt-2-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          settings: {
            variant: "v1",
            mobileFooterTagline: "t:common.footer.mobileFooterTagline__rich",
            logoUrl: "t:common.footer.logoUrl",
            logoAlt: "t:common.footer.logoAlt",
            appDownloadText: "t:common.footer.appDownloadText",
            googlePlayUrl: "t:common.footer.googlePlayUrl",
            appStoreUrl: "t:common.footer.appStoreUrl",
            googlePlayImage: "t:common.footer.googlePlayImage",
            googlePlayAlt: "t:common.footer.googlePlayAlt",
            appStoreImage: "t:common.footer.appStoreImage",
            appStoreAlt: "t:common.footer.appStoreAlt",
            serviceSectionsIcons: "t:common.footer.serviceSectionsIcons",
            aboutTitle: "t:common.footer.aboutTitle",
            aboutLinks: "t:common.footer.aboutLinks",
            usefulLinksTitle: "t:common.footer.usefulLinksTitle",
            usefulLinks: "t:common.footer.usefulLinks",
            ourSalonsTitle: "t:common.footer.ourSalonsTitle",
            ourSalonsLinks: "t:common.footer.ourSalonsLinks",
            categoriesTitle: "t:common.footer.categoriesTitle",
            categoriesLinks: "t:common.footer.categoriesLinks",
            myAccountTitle: "t:common.footer.myAccountTitle",
            myAccountLinks: "t:common.footer.myAccountLinks",
            socialLinks: "t:common.footer.socialLinks",
            paymentProtectionText: "t:common.footer.paymentProtectionText",
            copyrightText: "t:common.footer.copyrightText",
            paymentMethods: "t:common.footer.paymentMethods",
          },
        },
      ],
    },
  ],
};
