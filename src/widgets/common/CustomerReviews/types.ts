import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

/**
 * Rating counts breakdown for reviews
 */
export interface RatingCounts {
  fiveStarCount?: number;
  fourStarCount?: number;
  threeStarCount?: number;
  twoStarCount?: number;
  oneStarCount?: number;
}

/**
 * CustomerReviews widget settings — strongly typed based on widget registry
 */
export interface CustomerReviewsSettings {
  /** Widget variant */
  variant?: string;
  /** Section title */
  title?: string;
  /** Show review form */
  showReviewForm?: boolean;
  /** Show rating distribution */
  showRatingDistribution?: boolean;
  /** Show overall rating summary */
  showRatingSummary?: boolean;
  /** Show review list */
  showReviewList?: boolean;
  /** Number of reviews to display initially */
  initialReviewCount?: number;
  /** Enable pagination for reviews */
  enablePagination?: boolean;
  /** Reviews per page (if pagination enabled) */
  reviewsPerPage?: number;
  /** Allow users to write reviews */
  allowWriteReview?: boolean;
  /** Require login to write review */
  requireLoginToReview?: boolean;
  /** Custom button text for writing a review */
  writeReviewButtonText?: string;
  /** Custom button text for cancel a review */
  cancelReviewButtonText?: string;
  /** Custom empty state message */
  emptyStateMessage?: string;
  /** Background color for the section */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Border color */
  borderColor?: string;
}

/**
 * CustomerReviews widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT
 * (product data used to derive product ID and any optional review fallbacks)
 */
export interface CustomerReviewsData {
  success?: boolean;
  data?: ApiProduct | null;
  /** Direct product ID — overrides id derived from data.data */
  productId?: string | number;
  /** External product ID (numeric) */
  externalId?: number;
  /** Average rating (0-5) — pre-injected fallback */
  averageRating?: number | null;
  /** Total number of reviews — pre-injected fallback */
  totalReviews?: number | null;
  /** Rating counts breakdown — pre-injected fallback */
  ratingCounts?: RatingCounts;
  /** Callback called when a review is submitted */
  onReviewSubmitted?: () => void | Promise<void>;
}

/**
 * Props for the CustomerReviews component
 */
export type CustomerReviewsProps = WidgetProps<
  CustomerReviewsData,
  CustomerReviewsSettings
>;
