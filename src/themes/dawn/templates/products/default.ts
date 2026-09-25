import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Products Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-products",
  dataSources: {
    product: {
      type: DATA_SOURCE_TYPES.PRODUCT,
      params: { handle: "{{params.handle}}" },
      required: false,
    },
    productByParentsChoice: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: ["baby-care"],
      },
      required: true,
    },
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 50 },
      required: false,
    },
  },
  sections: [
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
          id: "nintarababy-breadcrumb",
          name: "Breadcrumb",
          type: WIDGET_TYPES.Breadcrumb,
          dataSourceKey: "product",
          settings: { variant: "v1" },
        },
      ],
    },

    // ProductMain Section
    {
      id: "product-main-section",
      name: "ProductMain",
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
          id: "nintarababy-product-main",
          name: "ProductMain",
          type: WIDGET_TYPES.ProductMain,
          dataSourceKey: "product",
          settings: {
            variant: "v1",
            badgeText: "t:products.productMain.badgeText",
            saveLabel: "t:products.productMain.saveLabel",
            mrpNote: "t:products.productMain.mrpNote",
            addToCartText: "t:products.productMain.addToCartText",
            addingText: "t:products.productMain.addingText",
            offerLabel: "t:products.productMain.offerLabel",
            offersCountSuffix: "t:products.productMain.offersCountSuffix",
            reviewsText: "t:products.productMain.reviewsText",
            shippingEstimate: "t:products.productMain.shippingEstimate",
            offers: "t:products.productMain.offers",
          },
        },
      ],
    },

    // KeyFeatures Section
    {
      id: "key-features-section",
      name: "KeyFeatures",
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
          id: "nintarababy-key-features",
          name: "KeyFeatures",
          type: WIDGET_TYPES.KeyFeatures,
          settings: {
            variant: "v1",
            heading: "t:products.keyFeatures.heading",
            features: "t:products.keyFeatures.features",
          },
        },
      ],
    },

    // ProductTabs Section
    {
      id: "product-tabs-section",
      name: "ProductTabs",
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
          id: "nintarababy-product-tabs",
          name: "ProductTabs",
          type: WIDGET_TYPES.ProductTabs,
          dataSourceKey: "product",
          settings: {
            variant: "v1",
            details: "t:products.productTabs.details",
            descriptionIntro: "t:products.productTabs.descriptionIntro",
            descriptionItems: "t:products.productTabs.descriptionItems",
            descriptionImageUrl: "t:products.productTabs.descriptionImageUrl",
            descriptionImageAlt: "t:products.productTabs.descriptionImageAlt",
            deliveryReturns: "t:products.productTabs.deliveryReturns",
          },
        },
      ],
    },

    // TestimonialsCarousel Section
    // {
    //   id: "testimonials-carousel-section",
    //   name: "TestimonialsCarousel",
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
    //       id: "nintarababy-testimonials-carousel",
    //       name: "TestimonialsCarousel",
    //       type: WIDGET_TYPES.TestimonialsCarousel,
    //       settings: { variant: "v1" },
    //     },
    //   ],
    // },

    // HowToUseInstructions Section
    // {
    //   id: "how-to-use-instructions-section",
    //   name: "HowToUseInstructions",
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
    //       id: "nintarababy-how-to-use-instructions",
    //       name: "HowToUseInstructions",
    //       type: WIDGET_TYPES.HowToUseInstructions,
    //       settings: { variant: "v1" },
    //     },
    //   ],
    // },

    // VideoAndBrandValues Section
    // {
    //   id: "video-brand-values-section",
    //   name: "VideoAndBrandValues",
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
    //       id: "nintarababy-video-brand-values",
    //       name: "VideoAndBrandValues",
    //       type: WIDGET_TYPES.VideoAndBrandValues,
    //       settings: { variant: "v1" },
    //     },
    //   ],
    // },

    // LovedByParentsCarousel Section
    {
      id: "loved-by-parents-carousel-section",
      name: "LovedByParentsCarousel",
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
          id: "nintarababy-loved-by-parents-carousel",
          name: "LovedByParentsCarousel",
          type: WIDGET_TYPES.LovedByParentsCarousel,
          dataSourceKey: "productByParentsChoice", // Using the new data source for LovedByParentsCarousel
          settings: {
            variant: "v1",
            heading: "t:products.lovedByParents.heading",
          },
        },
      ],
    },

    // WhatsAppCommunity Section
    // {
    //   id: "whatsapp-community-section",
    //   name: "WhatsAppCommunity",
    //   type: SECTION_TYPES.CONTENT_SECTION,
    //   settings: {
    //     layout: SECTION_LAYOUT_OPTIONS.FULL,
    //     responsive: {
    //       mobile: {
    //         padding: { top: 0, right: 0, bottom: 0, left: 0 },
    //       },
    //       tablet: {
    //         padding: { top: 0, right: 0, bottom: 0, left: 0 },
    //       },
    //       desktop: {
    //         padding: { top: 0, right: 0, bottom: 0, left: 0 },
    //       },
    //     },
    //   },
    //   widgets: [
    //     {
    //       id: "nintarababy-whatsapp-community",
    //       name: "WhatsAppCommunity",
    //       type: WIDGET_TYPES.WhatsAppCommunity,
    //       settings: { variant: "v1" },
    //     },
    //   ],
    // },

    // FAQsAccordion Section
    // {
    //   id: "faqs-accordion-section",
    //   name: "FAQsAccordion",
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
    //       id: "nintarababy-faqs-accordion",
    //       name: "FAQsAccordion",
    //       type: WIDGET_TYPES.FAQsAccordion,
    //       settings: { variant: "v1" },
    //     },
    //   ],
    // },

    // CustomerReviews Section
    {
      id: "customer-reviews-section",
      name: "CustomerReviews",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: {
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
          },
          tablet: {
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
          },
          desktop: {
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
          },
        },
      },
      widgets: [
        {
          id: "nintarababy-customer-reviews",
          name: "CustomerReviews",
          type: WIDGET_TYPES.CustomerReviews,
          dataSourceKey: "product",
          settings: {
            variant: "v1",
            heading: "t:products.customerReviews.heading",
          },
        },
      ],
    },
  ],
};
