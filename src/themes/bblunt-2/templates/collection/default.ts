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
