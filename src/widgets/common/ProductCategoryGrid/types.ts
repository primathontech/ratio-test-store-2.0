import { WidgetProps } from "@/widgets/types";
import { ProductCardProduct } from "@/ui/components/ProductCard/types";

/**
 * Re-export the shared product type for convenience.
 */
export type ProductCategoryGridProduct = ProductCardProduct;

/**
 * ProductCategoryGrid widget settings
 */
export interface ProductCategoryGridSettings {
  /** Widget variant */
  variant?: string;
  /** Category heading text (e.g. "Most Loved", "For Hair Fall Control") */
  categoryTitle?: string;
  /** Product cards data */
  products?: ProductCategoryGridProduct[];
}

/**
 * ProductCategoryGrid widget data (static section, no API data needed)
 */
export interface ProductCategoryGridData {
  // Static content section -- no dynamic data
}

/**
 * Props for the ProductCategoryGrid component
 */
export type ProductCategoryGridProps = WidgetProps<
  ProductCategoryGridData,
  ProductCategoryGridSettings
>;
