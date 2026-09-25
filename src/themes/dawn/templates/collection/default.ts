import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import {
  SECTION_TYPES,
  SECTION_LAYOUT_OPTIONS,
  DATA_SOURCE_TYPES,
} from "@shopkit/builder";

/**
 * Collection Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-collection",
  dataSources: {
    collectionData: {
      type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
      params: {
        handles: [
          "bestsellers",
          "baby-care",
          "mom-care",
          "essentials",
          "baby-wash",
          "baby-shampoo",
          "baby-face-cream",
          "baby-lotion",
          "under-eye",
          "diaper-rash-cream",
          "natural-water-wipes",
          "all-day-baby-wipes",
          "shop-all",
        ],
      },
      required: false,
    },
    collectionDataAll: {
      type: DATA_SOURCE_TYPES.COLLECTIONS,
      params: { first: 30 },
      required: false,
    },
    currentCollectionData: {
      type: DATA_SOURCE_TYPES.COLLECTION,
      params: { productLimit: 100 },
      required: false,
    },
  },
  sections: [
    // Collection Banner Section
    {
      id: "collection-banner-section",
      name: "CollectionBanner",
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
          id: "nintarababy-collection-banner",
          name: "CollectionBanner",
          type: WIDGET_TYPES.CollectionBanner,
          dataSourceKey: "collectionDataAll",
          settings: {
            variant: "v1",
            desktopImageUrl: "t:collections.collectionBanner.desktopImageUrl",
            mobileImageUrl: "t:collections.collectionBanner.mobileImageUrl",
            altText: "t:collections.collectionBanner.altText",
          },
        },
      ],
    },

    // Collection Header Section (Breadcrumb + H1 + Subtitle)
    {
      id: "collection-header-section",
      name: "CollectionHeader",
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
          id: "nintarababy-collection-header",
          name: "CollectionHeader",
          type: WIDGET_TYPES.CollectionHeader,
          dataSourceKey: "collectionDataAll",
          settings: {
            variant: "v1",
            heading: "t:collections.collectionHeader.heading",
            subtitle: "t:collections.collectionHeader.subtitle",
          },
        },
      ],
    },

    // Category Tab Bar Section (pill navigation between collections)
    {
      id: "category-tab-bar-section",
      name: "CategoryTabBar",
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
          id: "nintarababy-category-tab-bar",
          name: "CategoryTabBar",
          type: WIDGET_TYPES.CategoryTabBar,
          dataSourceKey: "collectionDataAll",
          settings: {
            variant: "v1",
            activeHandle: "",
            categories: "t:collections.categoryTabBar.categories",
          },
        },
      ],
    },

    // Filter & Sort Bar Section (toolbar above the product grid)
    {
      id: "filter-sort-bar-section",
      name: "FilterSortBar",
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
          id: "nintarababy-filter-sort-bar",
          name: "FilterSortBar",
          type: WIDGET_TYPES.FilterSortBar,
          dataSourceKey: "collectionDataAll",
          settings: {
            variant: "v1",
            activeSortValue: "",
            filterButtonText: "t:collections.filterSortBar.filterButtonText",
            sortByLabel: "t:collections.filterSortBar.sortByLabel",
            clearAllText: "t:collections.filterSortBar.clearAllText",
            applyFiltersText: "t:collections.filterSortBar.applyFiltersText",
            sortOptions: "t:collections.filterSortBar.sortOptions",
          },
        },
      ],
    },

    // Product Grid Section
    {
      id: "product-grid-section",
      name: "ProductGrid",
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
          id: "nintarababy-product-grid",
          name: "ProductGrid",
          type: WIDGET_TYPES.ProductGrid,
          dataSourceKey: "currentCollectionData",
          settings: {
            variant: "v1",
            addToCartText: "t:collections.productGrid.addToCartText",
            outOfStockText: "t:collections.productGrid.outOfStockText",
            reviewsText: "t:collections.productGrid.reviewsText",
            savePrefix: "t:collections.productGrid.savePrefix",
          },
        },
      ],
    },

    // Load More Pagination Section
    {
      id: "load-more-pagination-section",
      name: "LoadMorePagination",
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
          id: "nintarababy-load-more-pagination",
          name: "LoadMorePagination",
          type: WIDGET_TYPES.LoadMorePagination,
          settings: {
            variant: "v1",
            buttonText: "t:collections.loadMorePagination.buttonText",
          },
        },
      ],
    },
  ],
};
