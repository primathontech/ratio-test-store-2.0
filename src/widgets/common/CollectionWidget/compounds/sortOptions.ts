/**
 * Sort options for collection widget
 */

export interface SortOption {
  label: string;
  value: string;
}

export const sortOptions: SortOption[] = [
  { label: "Best Selling", value: "BEST_SELLING" },
  { label: "Price: Low to High", value: "PRICE_ASC" },
  { label: "Price: High to Low", value: "PRICE_DESC" },
  { label: "Newest", value: "CREATED_DESC" },
  { label: "Alphabetically: A-Z", value: "TITLE_ASC" },
  { label: "Alphabetically: Z-A", value: "TITLE_DESC" },
];

export default sortOptions;
