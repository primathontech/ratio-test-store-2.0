import { WidgetProps } from "@/widgets/types";

/**
 * CustomerReviews widget settings
 */
export interface CustomerReviewsSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Section heading (supports t: keys) */
  heading?: string;
  /** Average rating score (supports t: keys) */
  averageRating?: number;
  /** Total review count (supports t: keys) */
  totalReviews?: number;
  /** Histogram data (supports t: keys) */
  histogram?: HistogramEntry[];
  /** Review items (supports t: keys) */
  reviews?: ReviewItem[];
  /** Sort options (supports t: keys) */
  sortOptions?: SortOption[];
}

/**
 * Single review item
 */
export interface ReviewItem {
  /** Reviewer name */
  name: string;
  /** Timestamp text (e.g. "2 days ago") */
  date: string;
  /** Star rating 1-5 */
  rating: number;
  /** Review body text */
  body: string;
  /** Whether reviewer is a verified buyer */
  verified?: boolean;
}

/**
 * Histogram entry for a star rating
 */
export interface HistogramEntry {
  /** Star level (1-5) */
  stars: number;
  /** Number of reviews with this rating */
  count: number;
  /** Percentage of total reviews */
  percentage: number;
}

/**
 * Sort option for the reviews dropdown
 */
export interface SortOption {
  /** Machine-readable value */
  value: string;
  /** Display label */
  label: string;
}

/**
 * Product data from the data source (for extracting productId)
 */
export interface ReviewProductData {
  id?: string | number;
  averageRating?: number;
  totalReviews?: number;
}

/**
 * CustomerReviews widget data
 */
export interface CustomerReviewsData {
  /** Product data from dataSourceKey */
  data?: ReviewProductData;
  /** Direct product ID override */
  productId?: string | number;
  /** Section heading */
  heading?: string;
  /** Average rating (e.g. 4.69) */
  averageRating?: number;
  /** Total number of reviews */
  totalReviews?: number;
  /** Rating distribution histogram */
  histogram?: HistogramEntry[];
  /** Sample review items */
  reviews?: ReviewItem[];
  /** Sort options for the dropdown */
  sortOptions?: SortOption[];
  /** Number of reviews to show per page */
  reviewsPerPage?: number;
}

/**
 * Props for the CustomerReviews component
 */
export type CustomerReviewsProps = WidgetProps<
  CustomerReviewsData,
  CustomerReviewsSettings
>;

/**
 * Design tokens extracted from nintarababy.in CustomerReviews section
 * Source: https://nintarababy.in/products/ergopod-feeding-pillow-lucky-clover
 * Selector: #shopify-section-template--24784210329906__review_rating_judgeme_AUxFeH
 * Rendered height: 824px | topOffset: 5222px
 * Widget: Judge.me v3.0 (static clone)
 */
export const DESIGN_TOKENS = {
  colors: {
    background: "#ffffff",
    titleColor: "#092a33",
    scoreColor: "#092a33",
    starColor: "#e5c645",
    starOff: "#e0e0e0",
    reviewCountColor: "#878787",
    histogramLabel: "#092a33",
    histogramCount: "#878787",
    histogramBarTrack: "#f0f0f0",
    histogramBarFill: "#e5c645",
    reviewerName: "#092a33",
    reviewerNameHighlight: "#e5c645",
    reviewTimestamp: "#676986",
    reviewBody: "#092a33",
    verifiedBadgeBg: "#e5c645",
    verifiedBadgeText: "#ffffff",
    avatarBg: "#e9e9e9",
    avatarText: "#333333",
    writeReviewBg: "#01464f",
    writeReviewText: "#ffffff",
    writeReviewBorder: "#108474",
    sortBorder: "#01464f",
    loadMoreBorder: "#01464f",
    loadMoreText: "#01464f",
    reviewBorder: "#e0e0e0",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    title: {
      fontSize: "24px",
      fontSizeMobile: "20px",
      fontWeight: "600",
      textAlign: "center" as const,
    },
    score: {
      fontSize: "48px",
      fontWeight: "700",
      lineHeight: "1",
    },
    reviewCount: {
      fontSize: "14px",
    },
    histogramLabel: {
      fontSize: "14px",
    },
    histogramCount: {
      fontSize: "12px",
    },
    reviewerName: {
      fontSize: "14px",
      fontWeight: "500",
      lineHeight: "18px",
    },
    reviewTimestamp: {
      fontSize: "12px",
      fontSizeMobile: "11px",
    },
    reviewBody: {
      fontSize: "14px",
      fontWeight: "300",
      lineHeight: "20px",
    },
    buttons: {
      fontSize: "14px",
      fontWeight: "500",
    },
  },
  spacing: {
    sectionPaddingTopDesktop: "40px",
    sectionPaddingBottomDesktop: "60px",
    sectionPaddingTopMobile: "24px",
    sectionPaddingBottomMobile: "40px",
    containerMaxWidth: "1420px",
    summaryGap: "24px",
    summaryGapMobile: "16px",
    histogramRowGap: "8px",
    histogramBarHeight: "8px",
    reviewCardPadding: "16px",
    titleMarginBottom: "20px",
    sortDropdownHeight: "36px",
  },
  borders: {
    histogramBarRadius: "5px",
    writeReviewBtnRadius: "25px",
    loadMoreBtnRadius: "25px",
    sortDropdownRadius: "4px",
    reviewCardRadius: "10px",
    avatarRadius: "50%",
  },
  transitions: {
    histogramBarFill: "width 0.3s ease",
    buttonHover: "opacity 0.2s ease",
    loadMoreHover: "background-color 0.2s ease, color 0.2s ease",
  },
} as const;

/**
 * Default heading
 */
export const DEFAULT_HEADING = "Customer Reviews";

/**
 * Default sort options matching Judge.me
 */
export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: "most-recent", label: "Most Recent" },
  { value: "highest-rating", label: "Highest Rating" },
  { value: "lowest-rating", label: "Lowest Rating" },
];

/**
 * Default histogram data matching source (58 reviews)
 */
export const DEFAULT_HISTOGRAM: HistogramEntry[] = [
  { stars: 5, count: 45, percentage: 78 },
  { stars: 4, count: 8, percentage: 14 },
  { stars: 3, count: 5, percentage: 9 },
  { stars: 2, count: 0, percentage: 0 },
  { stars: 1, count: 0, percentage: 0 },
];

/**
 * Default reviews matching source site initial display (3 visible)
 */
export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    name: "Sneha",
    date: "2 days ago",
    rating: 5,
    body: "Really helpful product for nursing. The ergonomic design takes pressure off my back and keeps baby well-positioned during feeds. The cover washes well too.",
    verified: true,
  },
  {
    name: "Meenal",
    date: "1 week ago",
    rating: 5,
    body: "Love the Lucky Clover design. Quality is excellent and the waterproof layer is a great feature. Highly recommend to new moms.",
    verified: true,
  },
  {
    name: "Kavita",
    date: "2 weeks ago",
    rating: 4,
    body: "Good product overall. The lumbar support is really helpful for long feeding sessions. Delivery was fast and packaging was nice.",
    verified: true,
  },
];

/**
 * Extra reviews loaded on "Load More" click
 */
export const EXTRA_REVIEWS: ReviewItem[] = [
  {
    name: "Priya",
    date: "3 weeks ago",
    rating: 5,
    body: "Best feeding pillow I have used. The adjustable strap fits perfectly around my waist. Baby latches so much better with this pillow.",
    verified: true,
  },
  {
    name: "Ananya",
    date: "1 month ago",
    rating: 5,
    body: "Absolutely worth every penny. The waterproof layer saved me multiple times. The cotton cover is soft and washes beautifully.",
    verified: true,
  },
];
