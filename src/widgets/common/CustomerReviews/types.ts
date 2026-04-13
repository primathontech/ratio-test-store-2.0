import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

/**
 * A single customer review
 */
export interface ReviewItem {
  /** Unique identifier */
  id: string;
  /** Star rating (1-5) */
  rating: number;
  /** Review title */
  title: string;
  /** Review body text */
  body: string;
  /** Reviewer display name */
  author: string;
  /** Whether the reviewer is a verified buyer */
  verifiedBuyer: boolean;
  /** Date string (e.g. "03/26/2026") */
  date: string;
}

/**
 * CustomerReviews widget settings
 */
export interface CustomerReviewsSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading text */
  title?: string;
  /** Average rating (e.g. 5.00) */
  averageRating?: number;
  /** Total number of reviews */
  totalReviews?: number;
  /** Reviews per page */
  perPage?: number;
  /** Review items (static fallback) */
  reviews?: ReviewItem[];
  /** Sort options */
  sortOptions?: { label: string; value: string }[];
  /** Default sort value */
  defaultSort?: string;
}

/* ------------------------------------------------------------------ */
/*  Reviews API Response Types                                         */
/* ------------------------------------------------------------------ */

/** Single review from the API */
export interface ApiReview {
  id: string;
  product_id: string;
  title: string;
  rating: number;
  review_text: string;
  user_name: string;
  user_type: string;
  is_visible: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

/** Review average API response */
export interface ApiReviewAverage {
  average_rating: number;
  total_reviews: number;
}

/** Reviews list API response */
export interface ApiReviewsListResponse {
  success: boolean;
  data: {
    reviews: ApiReview[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

/**
 * CustomerReviews widget data — IResponse from DATA_SOURCE_TYPES.PRODUCT
 * (product data used to get the product ID for review API calls)
 */
export interface CustomerReviewsData {
  success?: boolean;
  data?: ApiProduct | null;
}

/**
 * Props for the CustomerReviews component
 */
export type CustomerReviewsProps = WidgetProps<
  CustomerReviewsData,
  CustomerReviewsSettings
>;
