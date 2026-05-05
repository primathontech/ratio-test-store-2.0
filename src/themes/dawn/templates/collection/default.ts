import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Collection Page Template for dawn
 *
 * `collectionData` is fed by the v2 collection API. The handle is injected
 * by the page builder from the route (`/collections/[collectionname]`),
 * so `params: {}` is intentional — the builder merges `routeContext.params`
 * into each dataSource at render time.
 */
export const template: PageConfig = {
  id: "dawn-collection",
  dataSources: {
    collectionData: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: {},
      options: {
        version: "v2",
        params: { productLimit: 24 },
      },
      required: true,
    },
  },
  sections: [
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
          id: "dawn-header",
          name: "Header",
          type: WIDGET_TYPES.Header,
          settings: { variant: "v1" },
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
            bannerCarousel: [],
            autoplay: true,
            autoplayInterval: 5000,
            loop: true,
            pauseOnHover: true,
            draggable: true,
            showIndicators: true,
            indicatorType: "simple",
            mobileAspectRatio: "1/1",
            desktopAspectRatio: "1440/450",
          },
        },
      ],
    },

    // Collection Timer Section (urgency strip)
    {
      id: "collection-timer-section",
      name: "Collection Timer",
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
          id: "collection-timer-widget",
          name: "Collection Timer",
          type: WIDGET_TYPES.CollectionTimer,
          settings: {
            variant: "v1",
            endDateString: "Dec 31, 2026 23:59:59",
            urgencyText: "Hurry Up!",
            saleLabel: "Sale ends in:",
            expiredText: "Oops! Offer is Expired",
            visible: true,
            backgroundColor: "#ffffff",
            textColor: "#1D1D1D",
            urgencyColor: "#FF0000",
            timerInterval: 1000,
          },
        },
      ],
    },

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
            title: "FAQ",
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
          id: "shine-academy-banner-widget",
          name: "Shine Academy Banner",
          type: WIDGET_TYPES.ShineAcademyBanner,
          settings: {
            variant: "v1",
            logoSrc: "/images/shine-academy/shine-academy-logo.webp",
            logoAlt: "BBlunt Shine Academy",
            tagline:
              "Every time you buy from our website, you play a significant role in impacting a woman\u2019s life by empowering her to shine on.",
            mosaicSrc: "/images/shine-academy/mosaic-collage.webp",
            mosaicAlt:
              "BBlunt Shine Academy - salon stylists and trainees collage",
            backgroundColor: "#E8F0F7",
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
          id: "testimonials-widget",
          name: "Testimonials",
          type: WIDGET_TYPES.Testimonials,
          settings: {
            variant: "v1",
            headingRegular: "What our",
            headingBold: "customers are saying?",
            cardBackground: "rgb(29, 29, 29)",
            starColor: "rgb(255, 192, 2)",
            testimonials: [
              {
                heading: "Surprised at the result",
                reviewText:
                  "So easy peasy to use! In just 5 minutes like shampoo I can apply and it leaves my hair so shiny and wonderful!! Totally recommended for people like me who can\u2019t get roots touched up every other week! Thanks BBLUNT!",
                authorName: "Amaira Joe",
                avatarSrc: "/images/testimonials/amaira-joe.jpg",
                stars: 5,
              },
              {
                heading: "Last Longing Hair Colour!",
                reviewText:
                  "My friend suggested me use this hair colour, and I tried it. Guess what? I was shocked as it gives a smooth glossy & nourished finish, covers grey hairs, and looks natural. The colour easily lasted for more than two months, unlike other brands in the market.",
                authorName: "Nikita Advani",
                avatarSrc: "/images/testimonials/nikita-advani.jpg",
                stars: 5,
              },
              {
                heading: "Love this Intense Moisture Range!",
                reviewText:
                  "The first impression after using the shampoo is really impressive. It gives smoothness & hydration and also helps to reduce dryness from my dry and color-treated hair. I highly recommend it to everyone with dry and damaged hair.",
                authorName: "Anita Agrawal",
                avatarSrc: "/images/testimonials/anita-agrawal.jpg",
                stars: 5,
              },
              {
                heading: "Curly Girls Will Love This",
                reviewText:
                  "This BBLUNT Curly Hair Shampoo & Conditioner is the best combo for people with curly hair. It makes our hair frizz free and smooth, and even it makes it bounce that looks so gorgeous every time. Use both products together to get the best result.",
                authorName: "Tarini Menon",
                avatarSrc: "/images/testimonials/tarini-menon.jpg",
                stars: 5,
              },
            ],
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
            title: "Additional Information",
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
          mobile: { padding: { top: 20, right: 0, bottom: 60, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
