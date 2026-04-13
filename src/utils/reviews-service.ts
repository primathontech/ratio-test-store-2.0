import {
  ReviewSortBy,
  ReviewUserType,
} from "@/widgets/common/ProductDetail/types";
import type {
  ApiReviewAverage,
  ApiReviewsListResponse,
  ReviewItem,
  ApiReview,
} from "@/widgets/common/CustomerReviews/types";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const REVIEWS_API_BASE =
  process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL ||
  "https://api-gw-v4.dev.gokwik.io/sandbox/pi/ps";

const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

export const REVIEWS_PER_PAGE = 6;

/* ------------------------------------------------------------------ */
/*  API Fetch Functions                                                */
/* ------------------------------------------------------------------ */

/**
 * Fetch the average rating for a product.
 * Calls GET /api/v1/review/{productId}/average
 */
export async function fetchReviewAverage(
  productId: string
): Promise<ApiReviewAverage | null> {
  try {
    const res = await fetch(
      `${REVIEWS_API_BASE}/api/v1/review/${productId}/average`,
      {
        headers: {
          accept: "application/json",
          "gk-merchant-id": MERCHANT_ID,
          "merchant-mid": MERCHANT_ID,
        },
      }
    );
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json?.data ?? json ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch a paginated list of reviews for a product.
 * Calls GET /api/v2/reviews/{productId}?page=&limit=&is_visible=true&sort_by=
 */
export async function fetchReviewsList(
  productId: string,
  page: number,
  limit: number,
  sortBy: ReviewSortBy | string
): Promise<ApiReviewsListResponse | null> {
  try {
    const res = await fetch(
      `${REVIEWS_API_BASE}/api/v2/reviews/${productId}?page=${page}&limit=${limit}&is_visible=true&sort_by=${sortBy}`,
      {
        headers: {
          accept: "application/json",
          "gk-merchant-id": MERCHANT_ID,
        },
      }
    );
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Transform Helpers                                                  */
/* ------------------------------------------------------------------ */

/**
 * Transform a raw API review object into the widget's ReviewItem shape.
 */
export function transformApiReview(review: ApiReview): ReviewItem {
  const date = new Date(review.created_at);
  const formatted = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;

  return {
    id: review.id,
    rating: review.rating,
    title: review.title || "",
    body: review.review_text || "",
    author: review.user_name || "Anonymous",
    verifiedBuyer: review.user_type === ReviewUserType.CUSTOMER,
    date: formatted,
  };
}
