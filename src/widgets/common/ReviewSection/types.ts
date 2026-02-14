import { WidgetProps } from "../../types";

/**
 * Rating counts breakdown for reviews
 */
export interface RatingCounts {
  /**
   * Number of 5-star reviews
   * @default 0
   */
  fiveStarCount?: number;

  /**
   * Number of 4-star reviews
   * @default 0
   */
  fourStarCount?: number;

  /**
   * Number of 3-star reviews
   * @default 0
   */
  threeStarCount?: number;

  /**
   * Number of 2-star reviews
   * @default 0
   */
  twoStarCount?: number;

  /**
   * Number of 1-star reviews
   * @default 0
   */
  oneStarCount?: number;
}

/**
 * Product data structure for review section
 */
export interface ReviewProductData {
  /**
   * Product ID (can be GID format or numeric)
   */
  id?: string | number;

  /**
   * Product title
   */
  title?: string;

  /**
   * Average rating (0-5)
   */
  averageRating?: number;

  /**
   * Total number of reviews
   */
  totalReviews?: number;

  /**
   * Product images
   */
  images?: Array<{
    url?: string;
    alt?: string;
  }>;

  /**
   * Additional product metadata
   */
  metadata?: Record<string, any>;
}

/**
 * ReviewSection widget settings - strongly typed based on widget registry
 */
export interface ReviewSectionSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  /**
   * Section title
   * @default 'Customer Reviews'
   */
  title?: string;

  /**
   * Show review form
   * @default true
   */
  showReviewForm?: boolean;

  /**
   * Show rating distribution
   * @default true
   */
  showRatingDistribution?: boolean;

  /**
   * Show overall rating summary
   * @default true
   */
  showRatingSummary?: boolean;

  /**
   * Show review list
   * @default false
   */
  showReviewList?: boolean;

  /**
   * Number of reviews to display initially
   * @default 10
   */
  initialReviewCount?: number;

  /**
   * Enable pagination for reviews
   * @default false
   */
  enablePagination?: boolean;

  /**
   * Reviews per page (if pagination enabled)
   * @default 10
   */
  reviewsPerPage?: number;

  /**
   * Allow users to write reviews
   * @default true
   */
  allowWriteReview?: boolean;

  /**
   * Require login to write review
   * @default true
   */
  requireLoginToReview?: boolean;

  /**
   * Custom button text for writing a review
   * @default 'Write a review'
   */
  writeReviewButtonText?: string;

  /**
   * Custom empty state message
   * @default 'Be the first to write a review'
   */
  emptyStateMessage?: string;

  /**
   * Background color for the section
   */
  backgroundColor?: string;

  /**
   * Text color
   */
  textColor?: string;

  /**
   * Border color
   */
  borderColor?: string;
}

/**
 * ReviewSection widget data structure
 */
export interface ReviewSectionData {
  /**
   * Product data (nested structure for widget system)
   */
  data?: ReviewProductData;

  /**
   * Product ID (alternative to nested data.id)
   * Can be GID format (gid://shopify/Product/123456) or numeric ID
   */
  productId?: string | number;

  /**
   * External product ID (numeric)
   */
  externalId?: number;

  /**
   * Average rating (0-5)
   * If not provided, will be calculated from ratingCounts
   */
  averageRating?: number | null;

  /**
   * Total number of reviews
   * If not provided, will be calculated from ratingCounts
   */
  totalReviews?: number | null;

  /**
   * Rating counts breakdown
   * If not provided, will be fetched from review service
   */
  ratingCounts?: RatingCounts;

  /**
   * Callback function called when a review is submitted
   */
  onReviewSubmitted?: () => void | Promise<void>;
}

/**
 * ReviewSection widget props
 */
export type ReviewSectionProps = WidgetProps<
  ReviewSectionData,
  ReviewSectionSettings
>;
