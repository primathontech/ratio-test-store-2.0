import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS, DATA_SOURCE_TYPES } from "@shopkit/builder";

/**
 * Product Page Template B (Variant) for dawn
 */
export const template: PageConfig = {
  id: "dawn-product-b",
  dataSources: {
    product: {
      type: DATA_SOURCE_TYPES.PRODUCT,
      params: {},
      required: true,
    },
  },
  sections: [
    // Header Section (empty - Header widget not yet created)
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
      widgets: [],
    },

    // Product Info Section B
    {
      id: "product-info-section-b",
      name: "Product Info B",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 16, right: 16, bottom: 16, left: 16 } },
          tablet: { padding: { top: 24, right: 24, bottom: 24, left: 24 } },
          desktop: { padding: { top: 32, right: 32, bottom: 32, left: 32 } },
        },
      },
      widgets: [
        {
          id: "dawn-product-info-b",
          name: "Product Info",
          type: WIDGET_TYPES.ProductInfo,
          settings: { variant: "v1" },
          dataSourceKey: "product",
        },
        {
          id: "dawn-product-gallery-b",
          name: "Product Gallery",
          type: WIDGET_TYPES.ProductGallery,
          settings: { variant: "v1" },
          dataSourceKey: "product",
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
