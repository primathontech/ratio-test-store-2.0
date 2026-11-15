/**
 * Metafield keys used in Collection Page
 */
export enum COLLECTION_METAFIELD_KEYS {
  COLLECTION_MOBILE_BANNER = "mobile_banner",
  COLLECTION_DESKTOP_BANNER = "collection_banner_image",
  COLLECTION_REDIRECTION = "collection_redirection",
}

/**
 * API Filter Response Types - matching the v2 collection API
 */
export interface ApiFilterValue {
  value: string;
  count: number;
  options?: string[];
}

export interface ApiFilter {
  id: string;
  filter_label: string;
  source_type: string;
  values: ApiFilterValue[];
  position: number;
  sort_order: string;
}

export interface ApiFilterResponse {
  collection_id: string;
  collection_title: string;
  total_products: number;
  filters: ApiFilter[];
}

export const mockApiFilterResponse: ApiFilterResponse = {
  collection_id: "mock_collection_id",
  collection_title: "Mock Collection",
  total_products: 0,
  filters: [
    {
      id: "fd_product_type",
      filter_label: "Product type",
      source_type: "product_attribute",
      values: [
        { value: "combos", count: 0 },
        { value: "conditioner", count: 0 },
        { value: "hair mask", count: 0 },
        { value: "hair styling", count: 0 },
        { value: "kits", count: 0 },
        { value: "shampoo", count: 0 },
      ],
      position: 1,
      sort_order: "manually",
    },
    {
      id: "fd_shop_by_concern",
      filter_label: "Shop by concern",
      source_type: "product_attribute",
      values: [
        { value: "dry hair", count: 0 },
        { value: "damaged hair", count: 0 },
        { value: "frizzy hair", count: 0 },
        { value: "color treated", count: 0 },
      ],
      position: 2,
      sort_order: "manually",
    },
  ],
};

export const mockFilters: ApiFilter[] = mockApiFilterResponse.filters;
