import { WidgetProps } from "@/widgets/types";

/**
 * A product image in the gallery
 */
export interface ProductImage {
  src: string;
  alt: string;
  isVideo?: boolean;
  videoThumbnail?: string;
}

/**
 * A product variant/shade option
 */
export interface ProductVariant {
  name: string;
  price: string;
  unitPrice?: string;
  href: string;
  swatchImage: string;
  isActive?: boolean;
}

/**
 * A product benefit badge
 */
export interface ProductBenefit {
  text: string;
}

/**
 * ProductDetail widget settings
 */
export interface ProductDetailSettings {
  /** Widget variant */
  variant?: string;

  /** Product title */
  title?: string;

  /** Star rating value (e.g., "5.0") */
  rating?: string;

  /** Number of reviews */
  reviewCount?: string;

  /** Product benefits displayed as badges with checkmarks */
  benefits?: ProductBenefit[];

  /** Net content string (e.g., "130g (USP: ...3.07/g)") */
  netContent?: string;

  /** Net content label */
  netContentLabel?: string;

  /** Price label (e.g., "M.R.P.") */
  priceLabel?: string;

  /** Price value (e.g., "...399") */
  price?: string;

  /** Tax info text (e.g., "Incl. of all taxes") */
  taxInfo?: string;

  /** Variant selector label (e.g., "Select variant") */
  variantLabel?: string;

  /** Product variants/shades */
  variants?: ProductVariant[];

  /** Add to cart button text */
  addToCartText?: string;

  /** Product images for the gallery */
  images?: ProductImage[];

  /** Badge text on top of image (e.g., "Get3@...799") */
  badgeText?: string;
}

/**
 * ProductDetail widget data
 */
export interface ProductDetailData {
  // Data could come from commerce API in a real integration
}

/**
 * Props for the ProductDetail component
 */
export type ProductDetailProps = WidgetProps<
  ProductDetailData,
  ProductDetailSettings
>;
