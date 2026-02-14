import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Home Page Template for dawn
 * Adapted from bblunt home template
 */
export const template: PageConfig = {
  id: "dawn-orders",
  // Define what data your page needs
  dataSources: {},

  // Define the page sections
  sections: [
    // Header Section
    {
      id: "header-section",
      name: "Header",
      type: SECTION_TYPES.HEADER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.PAGE,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "header-widget",
          name: "Header",
          type: WIDGET_TYPES.Header,
          dataSourceKey: "headerData",
          settings: {
            variant: "v2",
            isFixed: true,
            height: 65,
            logoWidth: 136,
            showCartIcon: true,
            showLanguageSwitcher: true,
            backgroundColor: "#ffffff",
            textColor: "#000000",
            // Navigation translations
            navigation: "t:common.header.navigation",
            search: "t:common.header.search",
            userActions: "t:common.header.user_actions",
            accessibility: "t:common.header.accessibility",
            tooltips: "t:common.header.tooltips",
            connectWithUs: "t:common.header.connect_with_us",
            getApp: "t:common.header.get_app",
          },
        },
      ],
    },

    // Main Content Section
    {
      id: "thank-you-section",
      name: "Thank You Content",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: "full",
      },
      widgets: [
        {
          id: "thank-you-widget",
          name: "Thank You Widget",
          type: WIDGET_TYPES.ThankYou,
          settings: {
            variant: "v1",
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
      },
      widgets: [
        {
          id: "footer-widget",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          settings: {
            variant: "v1",
            backgroundColor: "#000000",
            showSocialLinks: true,
            showPaymentMethods: true,
            showAppDownload: true,
            // Footer content translations
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
