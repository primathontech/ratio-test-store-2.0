import { WidgetProps } from "@/widgets/types";

/**
 * A single product in the carousel
 */
export interface HairCareBFFsProduct {
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
  /** Category chip label (e.g. "Shampoo", "Hair Styling") */
  category?: string;
  /** Badge text (e.g. "+3 Gifts") */
  badge?: string;
  /** Star rating (e.g. 4.8) */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Current price as string (e.g. "₹599") */
  price: string;
  /** Weight / size label (e.g. "300ml", "250g") */
  netContent?: string;
}

/**
 * A tab representing a product category
 */
export interface HairCareBFFsTab {
  /** Tab label displayed to users */
  name: string;
  /** Collection handle for URL */
  collectionHandle: string;
  /** Products in this tab */
  products: HairCareBFFsProduct[];
  /** Total products count for "View all N products" link */
  viewAllCount?: number;
}

/**
 * HairCareBFFs widget settings
 */
export interface HairCareBFFsSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading — normal weight part */
  headingNormal?: string;
  /** Section heading — bold part */
  headingBold?: string;
  /** Background image path */
  backgroundImage?: string;
  /** Array of tab categories with products */
  tabs?: HairCareBFFsTab[];
}

/**
 * HairCareBFFs widget data (static — no API data needed yet)
 */
export interface HairCareBFFsData {
  // Static carousel — API integration comes later
}

/**
 * Props for the HairCareBFFs component
 */
export type HairCareBFFsProps = WidgetProps<
  HairCareBFFsData,
  HairCareBFFsSettings
>;
