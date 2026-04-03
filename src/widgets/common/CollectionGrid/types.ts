import { WidgetProps } from "@/widgets/types";
import { ProductCardProduct } from "@/ui/components/ProductCard/types";

/** A filter group with its options */
export interface FilterGroup {
  /** Display label (e.g. "Product Type", "Shop by concern") */
  label: string;
  /** URL query parameter name */
  paramName: string;
  /** Available filter options */
  options: FilterOption[];
}

export interface FilterOption {
  label: string;
  value: string;
}

/** Sort option */
export interface SortOption {
  label: string;
  value: string;
}

/**
 * CollectionGrid widget settings
 */
export interface CollectionGridSettings {
  variant?: string;
  /** Total product count label */
  productCountLabel?: string;
  /** Products array */
  products?: ProductCardProduct[];
  /** Filter groups for the sidebar */
  filterGroups?: FilterGroup[];
  /** Sort options for the toolbar */
  sortOptions?: SortOption[];
  /** Default sort value */
  defaultSort?: string;
}

/**
 * CollectionGrid widget data
 */
export interface CollectionGridData {
  // Static section -- data passed via settings
}

export type CollectionGridProps = WidgetProps<
  CollectionGridData,
  CollectionGridSettings
>;
