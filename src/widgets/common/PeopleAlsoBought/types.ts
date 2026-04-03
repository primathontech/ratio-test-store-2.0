import { WidgetProps } from "@/widgets/types";
import { ProductCardProduct } from "@/ui/components/ProductCard/types";

/**
 * Re-export the shared product type for backwards compatibility.
 * New code should import ProductCardProduct from the shared location.
 */
export type PeopleAlsoBoughtProduct = ProductCardProduct;

/**
 * PeopleAlsoBought widget settings
 */
export interface PeopleAlsoBoughtSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading text */
  heading?: string;
  /** Product cards data */
  products?: PeopleAlsoBoughtProduct[];
}

/**
 * PeopleAlsoBought widget data (static section, no API data needed)
 */
export interface PeopleAlsoBoughtData {
  // Static content section -- no dynamic data
}

/**
 * Props for the PeopleAlsoBought component
 */
export type PeopleAlsoBoughtProps = WidgetProps<
  PeopleAlsoBoughtData,
  PeopleAlsoBoughtSettings
>;
