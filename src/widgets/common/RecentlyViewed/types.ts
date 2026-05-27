import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

/**
 * RecentlyViewed widget settings
 */
export interface RecentlyViewedSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading text (rich text supported) */
  heading?: string;
  /** Maximum number of products to display */
  maxProducts?: number;
  /** Show action button on cards */
  showActionButton?: boolean;
  /** Action button text (desktop) */
  actionButtonText?: string;
  /** Action button text (mobile) */
  actionButtonTextMobile?: string;
  /** Action button text color */
  actionButtonTextColor?: string;
  /** Sold out text (desktop) */
  soldOutText?: string;
  /** Sold out text (mobile) */
  soldOutTextMobile?: string;
  /** Show product card badge */
  showBadge?: boolean;
  /** Show rating */
  showRating?: boolean;
  /** Product card background color */
  productCardBackgroundColor?: string;
  /** Section background color */
  sectionBackgroundColor?: string;
  /** Section text color */
  sectionTextColor?: string;
}

/**
 * RecentlyViewed widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT.
 * Only used to read the current product id (so it can be excluded from the carousel).
 * The actual list comes from the user's localStorage history.
 */
export interface RecentlyViewedData {
  success?: boolean;
  data?: ApiProduct | null;
}

/**
 * Props for the RecentlyViewed component
 */
export type RecentlyViewedProps = WidgetProps<
  RecentlyViewedData,
  RecentlyViewedSettings
>;
