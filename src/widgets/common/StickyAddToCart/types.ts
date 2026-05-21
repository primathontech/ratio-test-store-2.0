import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

/**
 * StickyAddToCart widget settings
 */
export interface StickyAddToCartSettings {
  /** Widget variant */
  variant?: string;
  /** MRP label (e.g. "M.R.P.") */
  mrpLabel?: string;
  /** Tax note (e.g. "Incl. of all taxes") */
  inclusiveOfAllTaxesText?: string;
  /** Add to cart button text */
  buttonText?: string;
  /** Sold out button text */
  soldOutText?: string;
}

/**
 * StickyAddToCart widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT
 */
export interface StickyAddToCartData {
  success?: boolean;
  data?: ApiProduct | null;
}

/**
 * Props for the StickyAddToCart component
 */
export type StickyAddToCartProps = WidgetProps<
  StickyAddToCartData,
  StickyAddToCartSettings
>;
