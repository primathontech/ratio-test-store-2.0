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

    // Product Gallery with Info Section B
    {
      id: "product-gallery-with-info-section-b",
      name: "Product Gallery with Info B",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 30, right: 0, bottom: 20, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 26, left: 0 } },
          desktop: { padding: { top: 40, right: 0, bottom: 40, left: 0 } },
        },
      },
      widgets: [
        {
          id: "product-gallery-with-info-widget-b",
          name: "Product Gallery with Info",
          type: WIDGET_TYPES.ProductGalleryWithInfo,
          dataSourceKey: "product",
          settings: {
            variant: "v1",
            addToCartText: "t:product_info.product.add_to_cart",
            netContentText: "t:product_info.product.net_content",
            inclusiveOfAllTaxesText: "t:product_info.product.inclusive_of_all_taxes",
            reviewsText: "t:product_info.product.reviews",
            mrp: "t:product_info.product.mrp",
            usp: "t:product_info.product.usp",
            discount: "t:product_info.product.discount",
            selectSizeText: "t:product_info.product.select_size",
            soldOutText: "t:product_info.product.sold_out",
            rupeeSymbol: "₹",
            productGallery: {
              variant: "v1",
              layout: "vertical",
              mainImageRadius: 16,
              mobileMainImageRadius: 16,
              showNavigationArrows: true,
              navigationArrowSize: 46,
              navigationArrowBgColor: "#ffffff",
              navigationArrowIconColor: "#000000",
              navigationArrowShape: "circle",
              thumbnailSize: "81px",
              mobileThumbnailSize: "18.5%",
              thumbnailRadius: 6,
              thumbnailSpacing: 16,
              mobileThumbnailSpacing: 10,
              activeThumbnailBorderColor: "#000000",
              activeThumbnailBorderWidth: 2,
              thumbnailsPerRow: 4,
              thumbnailLayout: "single-row",
              showThumbnailArrows: false,
              enableHoverPreview: true,
              autoPlay: false,
              autoPlayInterval: 1500,
              autoPlayAnimation: "slide-left",
              pauseOnHover: true,
              showExpandIcon: false,
              enableZoom: true,
              lightboxBgColor: "rgba(255, 255, 255)",
              lightboxOverlayOpacity: 1,
              enablePinchZoom: true,
              zoomIconColor: "#000",
            },
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
