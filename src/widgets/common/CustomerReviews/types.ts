import { WidgetProps } from "@/widgets/types";

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
  /** Review items */
  reviews?: ReviewItem[];
  /** Sort options */
  sortOptions?: { label: string; value: string }[];
  /** Default sort value */
  defaultSort?: string;
}

/**
 * CustomerReviews widget data (static section, no API data needed)
 */
export interface CustomerReviewsData {
  // Static content section -- no dynamic data
}

/**
 * Props for the CustomerReviews component
 */
export type CustomerReviewsProps = WidgetProps<
  CustomerReviewsData,
  CustomerReviewsSettings
>;
