import { WidgetProps } from "@/widgets/types";

/**
 * StickyAddToCart widget settings
 */
export interface StickyAddToCartSettings {
  /** Widget variant */
  variant?: string;
  /** Product title */
  productTitle?: string;
  /** Product thumbnail image URL */
  productImage?: string;
  /** Product image alt text */
  productImageAlt?: string;
  /** MRP label (e.g. "M.R.P.") */
  mrpLabel?: string;
  /** Price string (e.g. "₹399") */
  price?: string;
  /** Tax note (e.g. "Incl. of all taxes") */
  taxNote?: string;
  /** Add to cart button text */
  buttonText?: string;
  /** Cart link URL */
  cartHref?: string;
}

/**
 * StickyAddToCart widget data (static section, no API data needed)
 */
export interface StickyAddToCartData {
  // Static content section -- no dynamic data
}

/**
 * Props for the StickyAddToCart component
 */
export type StickyAddToCartProps = WidgetProps<
  StickyAddToCartData,
  StickyAddToCartSettings
>;
