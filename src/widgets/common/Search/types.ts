import { WidgetProps } from "@/widgets/types";

/* ------------------------------------------------------------------ */
/*  Widget-level types                                                 */
/* ------------------------------------------------------------------ */

export interface SearchData {
  [key: string]: unknown;
}

export interface SearchSettings {
  variant?: string;
  filterByText?: string;
  clearAllText?: string;
  filterText?: string;
  sortText?: string;
  closeText?: string;
  applyText?: string;
  noOptionsAvailableText?: string;
  noResultsMessage?: string;
  suggestionMessage?: string;
  bestsellingProductsTitle?: string;
  showingText?: string;
  resultsText?: string;
  forText?: string;
  errorLoadingResultsText?: string;
  prevText?: string;
  nextText?: string;
  actionButtonText?: string;
  actionButtonTextMobile?: string;
  soldOutText?: string;
  soldOutTextMobile?: string;
  [key: string]: unknown;
}

export type SearchProps = WidgetProps<SearchData, SearchSettings>;

export interface SortOption {
  value: string;
  label: string;
}

/* ------------------------------------------------------------------ */
/*  Filter model (local — was @/widgets/common/CollectionWidget types) */
/* ------------------------------------------------------------------ */

export interface IFilterOption {
  id: string;
  label: string;
  input: string;
  count: number;
  apiValue?: string;
}

export interface IFilter {
  id: string;
  label: string;
  type: "LIST";
  values: IFilterOption[];
}

/* ------------------------------------------------------------------ */
/*  Internal product shape (local — was @/widgets/bblunt/ProductGrid)  */
/* ------------------------------------------------------------------ */

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price: number;
  availableForSale: boolean;
  availableQuantity: number;
  sku?: string;
}

export interface ProductImage {
  url: string;
  is_main: boolean;
  alt: string;
}

export interface ProductResponse {
  id: string;
  title: string;
  handle: string;
  status: string;
  tags: string[];
  productType: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  images: ProductImage[];
  product_availability: boolean;
  availableForSale: boolean;
  variant: ProductVariant;
  average_rating: string;
  rating_count: string;
  metadata: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  API error                                                          */
/* ------------------------------------------------------------------ */

export interface TrendingSearchApiError {
  message: string;
  status?: number;
}
