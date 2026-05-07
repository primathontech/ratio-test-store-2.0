import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/FeaturedCollectionGrid/types";

/**
 * Re-export API types used in the transform layer.
 */
export type { ApiProduct };

/**
 * FeaturedCollectionCarousel widget settings
 */
export interface FeaturedCollectionCarouselSettings {
  /** Widget variant */
  variant?: string;
  /**
   * Rich-text section heading. Inline HTML is allowed for emphasis —
   * e.g. `For <strong>Hair Fall Control</strong>`. Set by the template;
   * rendered via `dangerouslySetInnerHTML`.
   */
  heading?: string;
  /**
   * Optional override for the "View all" link target (and its thumbnails).
   * The server-fetched handle comes from the data source — when this setting
   * is omitted (or matches the server handle), the View All button reuses
   * server data with no extra fetch. When different, the button lazy-fetches
   * this collection on intersection.
   */
  viewAllCollectionHandle?: string;
  /** Add-to-cart button text. Defaults to "Add to cart". */
  actionButtonText?: string;
  /** Sold-out fallback text. Defaults to "Sold Out". */
  soldOutText?: string;
}

/**
 * FeaturedCollectionCarousel widget data — response from DATA_SOURCE_TYPES.COLLECTION
 *
 * Shape: { success, data: { products: [...], productPagination: { total } } }
 */
export interface FeaturedCollectionCarouselData {
  success?: boolean;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  meta?: Record<string, unknown>;
}

/**
 * Props for the FeaturedCollectionCarousel component
 */
export type FeaturedCollectionCarouselProps = WidgetProps<
  FeaturedCollectionCarouselData,
  FeaturedCollectionCarouselSettings
>;
