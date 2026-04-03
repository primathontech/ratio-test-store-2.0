import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";
import { additionalInfoProseBlocks } from "./additional-info-content";

/**
 * Collection Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-collection",
  dataSources: {},
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
          settings: {
            variant: "v1",
            desktopImage: "/images/collections/shampoo-hero-desktop.jpg",
            mobileImage: "/images/collections/shampoo-hero-mobile.jpg",
            alt: "Showstopper Shampoos for Salon-Like Hair",
            desktopWidth: 1300,
            desktopHeight: 406,
            mobileWidth: 360,
            mobileHeight: 191,
          },
        },
      ],
    },

    // Collection Heading Section
    {
      id: "collection-heading-section",
      name: "Collection Heading",
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
          id: "collection-heading-widget",
          name: "Collection Heading",
          type: WIDGET_TYPES.CollectionHeading,
          settings: { variant: "v1" },
        },
      ],
    },

    // Collection Grid Section
    {
      id: "collection-grid-section",
      name: "Collection Grid",
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
          id: "collection-grid-widget",
          name: "Collection Grid",
          type: WIDGET_TYPES.CollectionGrid,
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
          settings: {
            variant: "v1",
            title: "FAQ",
            items: [
              {
                question: "Which is the best shampoo for hair?",
                answer:
                  "Your hair type and particular requirements will determine which shampoo suits you. Look for moisturising shampoos that contain shea butter or argan oil for dry hair. To remove extra oil from you hair, use clarifying shampoos that contain lemon tea tree oil or charcoal. To maintain the color of your color-treated hair, use sulfate-free substitutes. Smoothening shampoos can tame hair that frizzes easily and is difficult to manage. Consulting with a hair care expert can help you select the ideal shampoo for your hair type. This premium shampoo is designed especially for Indian hair types, a sulfur-free, and has a colour-protecting formula.",
              },
              {
                question: "Which shampoo is best for hair growth?",
                answer:
                  "For hair growth, look for shampoos containing biotin, caffeine, ketoconazole, or saw palmetto. These ingredients help stimulate follicles, improve blood circulation to the scalp, and reduce hair thinning. BBlunt's hair growth shampoos are formulated with salon-grade ingredients to nourish your scalp and promote healthier, thicker hair.",
              },
              {
                question:
                  "Which shampoo is best for hair growth and thickness?",
                answer:
                  "Shampoos with biotin, collagen, keratin, and natural extracts like amla or bhringraj are excellent for both hair growth and thickness. They strengthen hair strands from root to tip while encouraging new growth. BBlunt offers specially formulated shampoos that address both growth and volume concerns.",
              },
              {
                question: "Which shampoo is good for hair?",
                answer:
                  "A good shampoo depends on your hair type. For oily hair, use clarifying formulas. For dry hair, choose moisturizing shampoos with argan oil or shea butter. For colour-treated hair, sulfate-free options are best. BBlunt shampoos are crafted with premium ingredients suited for Indian hair conditions.",
              },
              {
                question: "Which shampoo is best for hair growth in India?",
                answer:
                  "In India, shampoos with natural ingredients like bhringraj, amla, hibiscus, and onion are popular for hair growth. Combined with modern actives like biotin and caffeine, these formulations address common Indian hair concerns like hard water damage, pollution, and humidity. BBlunt's range is specifically designed for Indian hair types and conditions.",
              },
              {
                question: "Which is the best hair growth shampoo for women?",
                answer:
                  "The best hair growth shampoo for women combines gentle cleansing with growth-stimulating ingredients. Look for formulas with biotin, keratin, and natural botanical extracts. BBlunt's women-focused hair care line offers salon-quality shampoos that promote growth while keeping hair soft, manageable, and healthy-looking.",
              },
            ],
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
          settings: {
            variant: "v2",
            title: "Additional Information",
            proseBlocks: additionalInfoProseBlocks,
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
          mobile: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
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
