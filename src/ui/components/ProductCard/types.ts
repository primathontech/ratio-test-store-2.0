/**
 * Shared Product Card types — used by PeopleAlsoBought, CollectionGrid, and
 * any future widget that renders product cards in the BBlunt design language.
 */

/** A single product for the shared ProductCard component */
export interface ProductCardProduct {
  /** Product page URL */
  href: string;
  /** Product title */
  title: string;
  /** Image alt text */
  alt: string;
  /** Main product image URL */
  mainImage: string;
  /** Hover product image URL (for cross-fade) */
  hoverImage: string;
  /** Category chip label (e.g. "Shampoo", "Combos") */
  category: string;
  /** Badge text (e.g. "Get3@₹799", "Bestseller") */
  badge?: string;
  /** Badge style variant: "trending" = green, "new"/"bestseller" = red, "deal" = magenta */
  badgeVariant?: "trending" | "new" | "bestseller" | "deal";
  /** Star rating (e.g. 4.85) */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Current sale price (number) */
  salePrice: number;
  /** Original price before discount (number, optional) */
  originalPrice?: number;
  /** Discount percentage text (e.g. "20% off") */
  discount?: string;
  /** Weight / size label (e.g. "300ml", "Pack of 2") */
  weight?: string;
  /** Short description text */
  description?: string;
}

/** Card color theme */
export enum ProductCardTheme {
  LIGHT = "light",
  DARK = "dark",
}

/** Optional className overrides + visibility toggles for the ProductCard */
export interface ProductCardSettings {
  /** Show the promo badge — defaults to true */
  showBadge?: boolean;
  /** Show the star rating row — defaults to true */
  showRating?: boolean;
  /** Show the Add to cart button — defaults to true */
  showActionButton?: boolean;
  /** Override card background color (overrides theme) */
  backgroundColor?: string;
  /** Override primary text color (overrides theme) */
  color?: string;
  /** Layout flag for "recommended product" usage; accepted for parity */
  isRecommendedProduct?: boolean;
  /** Classes appended to the wrapping product Link */
  linkClassName?: string;
  /** Classes appended to the image area Link */
  imageClassName?: string;
  /** Classes appended to the info/details container */
  detailsClassName?: string;
  /** Classes appended to the title Link */
  titleClassName?: string;
  /** Classes appended to the rating wrapper */
  ratingClassName?: string;
  /** Classes appended to the price row */
  priceSectionClassName?: string;
  /** Classes appended to the original (compare-at) price */
  compareAtPriceClassName?: string;
  /** Classes appended to the discount label */
  discountClassName?: string;
  /** Classes appended to the Add to cart button */
  actionButtonClassName?: string;
}

/** Props for the ProductCard component */
export interface ProductCardProps {
  product: ProductCardProduct;
  /** Card color theme — defaults to LIGHT */
  theme?: ProductCardTheme;
  /** Classes appended to the root card container */
  className?: string;
  /** Per-element className overrides */
  settings?: ProductCardSettings;
  /** Show the category / product-type chip — defaults to true */
  showProductType?: boolean;
  /** Show the net content / weight badge on the image — defaults to true */
  showNetContent?: boolean;
  /** Show the subtitle / description line — defaults to true */
  showSubtitle?: boolean;
}
