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
