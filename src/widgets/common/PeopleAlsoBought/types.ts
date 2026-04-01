import { WidgetProps } from "@/widgets/types";

/**
 * A single product card in the People Also Bought carousel
 */
export interface PeopleAlsoBoughtProduct {
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
  /** Category chip label (e.g. "Hair Colour", "Combos") */
  category: string;
  /** Badge text (e.g. "Get3@₹799", "New Launch") */
  badge?: string;
  /** Badge style variant: "trending" = green, "new" = red */
  badgeVariant?: "trending" | "new";
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
  /** Weight label (e.g. "130g") */
  weight?: string;
  /** Short description text */
  description?: string;
}

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
