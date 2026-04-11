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
  /** Section heading — normal weight part (e.g. "For ") */
  headingNormal?: string;
  /** Section heading — bold part (e.g. "Hair Fall Control") */
  headingBold?: string;
  /** Collection handle for View All link */
  collectionHandle?: string;
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
