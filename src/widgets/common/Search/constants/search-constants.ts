import type { IFilter, SortOption } from "../types";

/** Filter IDs used in search page filters */
export const FILTER_ID = {
  COLLECTIONS: "collections",
  PRODUCT_TYPE: "product-type",
  AVAILABILITY: "availability",
  PRICE: "price",
  DISCOUNT: "discount",
} as const;

/** Availability filter option IDs */
export const AVAILABILITY_OPTION_ID = {
  INCLUDE_OUT_OF_STOCK: "include-out-of-stock",
  EXCLUDE_OUT_OF_STOCK: "exclude-out-of-stock",
} as const;

/** URL search param names */
export const FILTER_URL_PARAM = {
  COLLECTION: "collection",
  PRODUCT_TYPE: "productType",
  IN_STOCK: "inStock",
  MIN_PRICE: "minPrice",
  MAX_PRICE: "maxPrice",
  MIN_DISCOUNT: "minDiscount",
  MAX_DISCOUNT: "maxDiscount",
  ON_SALE: "onSale",
  PAGE: "page",
} as const;

export const SORT_OPTIONS: SortOption[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price_low_high", label: "Price: Low to High" },
  { value: "price_high_low", label: "Price: High to Low" },
  { value: "name_a_z", label: "Name: A to Z" },
  { value: "name_z_a", label: "Name: Z to A" },
  { value: "product_published_at_desc", label: "Date: New to Old" },
  { value: "product_published_at_asc", label: "Date: Old to New" },
  { value: "discountPercentage", label: "Discount: High to Low" },
];

export const SORT_API_PARAMS: Record<
  string,
  { sortBy?: string; sortOrder?: string }
> = {
  relevance: { sortBy: "relevance" },
  price_low_high: { sortBy: "price", sortOrder: "asc" },
  price_high_low: { sortBy: "price", sortOrder: "desc" },
  name_a_z: { sortBy: "title", sortOrder: "asc" },
  name_z_a: { sortBy: "title", sortOrder: "desc" },
  product_published_at_desc: { sortBy: "createdAt", sortOrder: "desc" },
  product_published_at_asc: { sortBy: "createdAt", sortOrder: "asc" },
  discountPercentage: { sortBy: "discount", sortOrder: "desc" },
};

export function getSortIdFromParams(
  sortBy: string | null,
  sortOrder: string | null
): string {
  if (!sortBy || !sortOrder) {
    return "relevance";
  }
  const entry = Object.entries(SORT_API_PARAMS).find(
    ([, p]) => p.sortBy === sortBy && p.sortOrder === sortOrder
  );
  return entry ? entry[0] : "relevance";
}

/** Static availability filter appended at the end of the filter list */
export const AVAILABILITY_FILTER: IFilter = {
  id: FILTER_ID.AVAILABILITY,
  label: "Availability",
  type: "LIST",
  values: [
    {
      id: AVAILABILITY_OPTION_ID.INCLUDE_OUT_OF_STOCK,
      label: "Include Out of Stock",
      input: "",
      count: 0,
    },
  ],
};

/** Popular collections shown in the pre-search dropdown */
export const POPULAR_PRODUCTS = [
  { label: "Tarini Exclusive", collectionHandle: "tarini-range" },
  { label: "Shampoo", collectionHandle: "shampoo" },
  { label: "Conditioner", collectionHandle: "conditioner" },
  { label: "Hair Mask", collectionHandle: "hair-mask" },
  { label: "Serum", collectionHandle: "serum" },
  { label: "New Launches", collectionHandle: "new-launches" },
];
