import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * shine-squad-b2g2 sale-page template for bblunt-2.
 * Mirrors `shine-squad-weekly-offer/default.ts` — same active sections
 * (announcement, header, sale banner, collection page, footer) plus the
 * same TODO-commented sections (hero, how-it-works, countdown, most-loved
 * grid) ready to enable per page.
 */

/* ------------------------------------------------------------------ */
/*  Helper: section config for a FeaturedCollectionGrid widget          */
/* ------------------------------------------------------------------ */

function categoryGridSection(
  id: string,
  name: string,
  categoryTitle: string,
  paddingTop: number,
  dataSourceKey: string,
  collectionHandle: string
) {
  return {
    id: `${id}-section`,
    name,
    type: SECTION_TYPES.CONTENT_SECTION,
    settings: {
      layout: SECTION_LAYOUT_OPTIONS.FULL,
      responsive: {
        mobile: {
          padding: { top: paddingTop, right: 0, bottom: 0, left: 0 },
        },
        tablet: {
          padding: { top: paddingTop, right: 0, bottom: 0, left: 0 },
        },
        desktop: {
          padding: { top: paddingTop, right: 0, bottom: 0, left: 0 },
        },
      },
    },
    widgets: [
      {
        id: `${id}-widget`,
        name,
        type: WIDGET_TYPES.FeaturedCollectionGrid,
        dataSourceKey,
        settings: {
          variant: "v1",
          categoryTitle,
          collectionHandle,
        },
      },
    ],
  };
}

export const template: PageConfig = {
  id: "bblunt-2-shine-squad-b2g2",
  dataSources: {
    mostLovedCollection: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "most-loved-home-page",
        productLimit: 1,
      },
      required: false,
    },
    // Hardcoded sale-page collection feeding the CollectionPage widget.
    saleCollectionData: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {
        handle: "most-loved-sale-page",
      },
      options: {
        version: "v2",
        params: { first: 12 },
      },
      required: false,
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

    // TODO: Enable this section if we are showing the sale banner according bblunt.com
    // Hero Banner Section
    // {
    //   id: "hero-banner-section",
    //   name: "Hero Banner",
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
    //       id: "shine-squad-b2g2-hero-banner",
    //       name: "Hero Banner",
    //       type: WIDGET_TYPES.HeroBanner,
    //       settings: {
    //         variant: "v1",
    //         desktopImage: "t:bblunt-2_shine-squad-b2g2_default.hero_banner.desktopImage",
    //         mobileImage: "t:bblunt-2_shine-squad-b2g2_default.hero_banner.mobileImage",
    //         alt: "t:bblunt-2_shine-squad-b2g2_default.hero_banner.alt",
    //         mobileAspectRatio: "t:bblunt-2_shine-squad-b2g2_default.hero_banner.mobileAspectRatio",
    //         desktopAspectRatio: "t:bblunt-2_shine-squad-b2g2_default.hero_banner.desktopAspectRatio",
    //       },
    //     },
    //   ],
    // },

    // TODO: Enable this section if we are showing the sale banner according bblunt.com
    // How It Works Banner Section
    // {
    //   id: "how-it-works-banner-section",
    //   name: "How It Works Banner",
    //   type: SECTION_TYPES.CONTENT_SECTION,
    //   settings: {
    //     layout: SECTION_LAYOUT_OPTIONS.FULL,
    //     responsive: {
    //       mobile: { padding: { top: 56, right: 0, bottom: 22, left: 0 } },
    //       tablet: { padding: { top: 56, right: 0, bottom: 22, left: 0 } },
    //       desktop: { padding: { top: 56, right: 0, bottom: 22, left: 0 } },
    //     },
    //   },
    //   widgets: [
    //     {
    //       id: "shine-squad-b2g2-how-it-works-banner",
    //       name: "How It Works Banner",
    //       type: WIDGET_TYPES.HowItWorksBanner,
    //       settings: {
    //         variant: "v1",
    //         desktopImage: "t:bblunt-2_shine-squad-b2g2_default.how_it_works_banner.desktopImage",
    //         mobileImage: "t:bblunt-2_shine-squad-b2g2_default.how_it_works_banner.mobileImage",
    //         alt: "t:bblunt-2_shine-squad-b2g2_default.how_it_works_banner.alt",
    //         mobileAspectRatio: "t:bblunt-2_shine-squad-b2g2_default.how_it_works_banner.mobileAspectRatio",
    //         desktopAspectRatio: "t:bblunt-2_shine-squad-b2g2_default.how_it_works_banner.desktopAspectRatio",
    //       },
    //     },
    //   ],
    // },

    // TODO: Enable this section if we are showing the sale banner according bblunt.com
    // Countdown Timer Section
    // {
    //   id: "countdown-timer-section",
    //   name: "Countdown Timer",
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
    //       id: "shine-squad-b2g2-countdown-timer",
    //       name: "Countdown Timer",
    //       type: WIDGET_TYPES.CountdownTimer,
    //       settings: {
    //         variant: "v1",
    //         targetDate: "t:bblunt-2_shine-squad-b2g2_default.countdown_timer.targetDate",
    //         heading: "t:bblunt-2_shine-squad-b2g2_default.countdown_timer.heading",
    //         subheading: "t:bblunt-2_shine-squad-b2g2_default.countdown_timer.subheading",
    //         expiredText: "t:bblunt-2_shine-squad-b2g2_default.countdown_timer.expiredText",
    //       },
    //     },
    //   ],
    // },

    // ── Sale Page Banner Section ───────────────────────────────────
    {
      id: "sale-page-banner-section",
      name: "Sale Page Banner",
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
          id: "shine-squad-b2g2-sale-page-banner",
          name: "Sale Page Banner",
          type: WIDGET_TYPES.SalePageBanner,
          settings: {
            variant: "v1",
            timerInterval: 1000,
            mobileSrc:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.mobileSrc",
            desktopSrc:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.desktopSrc",
            offerTitle:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.offer.title",
            offerPrice:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.offer.price",
            currencySymbol:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.offer.currencySymbol",
            couponCode:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.offer.couponCode",
            expiryText:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.offer.expiryText",
            endDateString:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.countdown",
            bannerCtaLabel:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.banner_cta",
            howToShopTitle:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.how_to_shop_title",
            howToShopSteps:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.how_to_shop_steps__rich",
            termsAndConditionsTitle:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.terms_and_conditions.title",
            termsAndConditionsPoints:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.terms_and_conditions.points",
            primaryButtonLabel:
              "t:bblunt-2_shine-squad-b2g2_default.sale_banner.primary_button",
          },
        },
      ],
    },

    // ── 4 Product Category Grid Sections (kept as TODO for parity) ─
    // categoryGridSection(
    //   "most-loved",
    //   "Most Loved",
    //   "t:bblunt-2_shine-squad-b2g2_default.most_loved_grid.category_title",
    //   40,
    //   "mostLovedCollection",
    //   "most-loved-home-page"
    // ),

    // ── Sale Collection Page Section ───────────────────────────────
    {
      id: "sale-collection-page-section",
      name: "Sale Collection Page",
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
          id: "shine-squad-b2g2-sale-collection-page",
          name: "Sale Collection Page",
          type: WIDGET_TYPES.CollectionPage,
          dataSourceKey: "saleCollectionData",
          settings: {
            variant: "v1",
            autoLoadMore: false,
            showFilterAndSort: false,
            showActionButton: true,
            actionButtonText: "t:common.product_card.add_to_cart",
            soldOutText: "t:common.product_card.sold_out",
            showBadge: true,
            showRating: true,
            actionButtonTextColor: "#ffffff",
            sectionTextColor: "#1D1D1D",
            title: "t:bblunt-2_shine-squad-b2g2_default.sale_collection.title",
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
