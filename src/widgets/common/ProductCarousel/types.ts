import { WidgetProps } from "@/widgets/types";

/**
 * A single product in the carousel
 */
export interface ProductCarouselProduct {
  /** Product page URL */
  href: string;
  /** Product title */
  title: string;
  /** Short subtitle / description */
  subtitle?: string;
  /** Image alt text */
  alt: string;
  /** Main product image URL */
  mainImage: string;
  /** Hover product image URL (for cross-fade) */
  hoverImage?: string;
  /** Category chip label (e.g. "Hair Mask", "Combos") */
  category?: string;
  /** Top-left badge text (e.g. "+3 Gifts", "Bestseller") */
  badge?: string;
  /** Top-left badge color — "green" | "orange" | default green */
  badgeColor?: "green" | "orange";
  /** Net content / weight label (e.g. "250g", "50ml", "Pack of 2") */
  netContent?: string;
  /** Star rating (e.g. 4.8) */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Current (sale) price as formatted string (e.g. "\u20B9499") */
  price: string;
  /** Original price before discount — shown as strikethrough (e.g. "\u20B9754") */
  originalPrice?: string;
  /** Discount label (e.g. "20% off") */
  discountLabel?: string;
}

/**
 * ProductCarousel widget settings
 */
export interface ProductCarouselSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading — normal weight part (e.g. "For ") */
  headingNormal?: string;
  /** Section heading — bold part (e.g. "Hair Fall Control") */
  headingBold?: string;
  /** Collection handle for View All link (e.g. "hairfall") */
  collectionHandle?: string;
  /** Total product count for "View all N products" link */
  viewAllCount?: number;
  /** Products to display in carousel */
  products?: ProductCarouselProduct[];
}

/**
 * ProductCarousel widget data (static for now)
 */
export interface ProductCarouselData {
  // Static carousel — API integration comes later
}

/**
 * Props for the ProductCarousel component
 */
export type ProductCarouselProps = WidgetProps<
  ProductCarouselData,
  ProductCarouselSettings
>;
