/**
 * Get Reviews API utility for CustomerReviews
 * Fetches reviews and average ratings from the GoKwik custom backend
 */

// Custom Backend API Response Types
interface CustomReviewResponse {
  id: string;
  product_id: string;
  title: string;
  user_id: string;
  user_type: string;
  order_id: string | null;
  rating: number;
  review_text: string;
  media_url: string | null;
  storeId: string;
  is_visible: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  user_name?: string;
  age?: number;
  email?: string;
  phone_no?: string;
  score?: string;
}

interface CustomReviewsApiResponse {
  data: CustomReviewResponse[];
  total: number;
}

// Average Rating API Response Types
export interface AverageRatingResponse {
  product_id: string;
  average_rating: number;
  total_ratings: number;
  ratings: {
    "1": { count: number; percentage: number };
    "2": { count: number; percentage: number };
    "3": { count: number; percentage: number };
    "4": { count: number; percentage: number };
    "5": { count: number; percentage: number };
  };
}

// Environment variables
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";
const REVIEW_API_BASE_URL_V2 =
  process.env.NEXT_PUBLIC_CUSTOM_BACKEND_API_PRODUCT_URL_V2;
const REVIEW_API_BASE_URL_V1 =
  process.env.NEXT_PUBLIC_CUSTOM_BACKEND_API_PRODUCT_URL_V1;

/**
 * Transform custom backend review to display format
 */
const transformCustomReview = (customReview: CustomReviewResponse) => {
  return {
    name: customReview.user_name || "Customer",
    title: customReview.title,
    description: customReview.review_text,
    rating: customReview.rating,
    date: customReview.created_at,
    image: customReview.media_url || null,
  };
};

/**
 * Fetches reviews for a given product ID from custom backend
 * @param productId - The product ID
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of reviews per page (default: 3)
 * @param sortBy - Sort option: 'rating_asc', 'rating_desc', or 'newest'
 * @returns The reviews response or null if error
 */
export const getProductReviews = async (
  productId: number | string,
  page = 1,
  limit = 3,
  sortBy?: "rating_asc" | "rating_desc" | "newest"
): Promise<{
  reviews: {
    id: string;
    name: string;
    title: string;
    description: string;
    rating: number;
    date: string;
    image: string | null;
  }[];
  count: number;
  page: number;
  per_page: number;
} | null> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      is_visible: "true",
    });

    if (sortBy) {
      queryParams.append("sort_by", sortBy);
    } else {
      queryParams.append("sort_by", "newest");
    }

    const url = `${REVIEW_API_BASE_URL_V2}/reviews/${productId}?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "gk-merchant-id": MERCHANT_ID,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    const customData = (await response.json()) as CustomReviewsApiResponse;

    const transformedReviews = customData.data
      .filter((review) => review.product_id)
      .map((review) => ({
        id: review.id,
        ...transformCustomReview(review),
      }));

    return {
      reviews: transformedReviews,
      count: customData.total,
      page,
      per_page: limit,
    };
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return null;
  }
};

/**
 * Fetches average rating and rating breakdown for a given product ID
 * @param productId - The product ID
 * @returns The average rating response or null if error
 */
export const getProductAverageRating = async (
  productId: number | string
): Promise<AverageRatingResponse | null> => {
  try {
    const url = `${REVIEW_API_BASE_URL_V1}/review/${productId}/average`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "gk-merchant-id": MERCHANT_ID,
        "merchant-mid": MERCHANT_ID,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch average rating: ${response.statusText}`);
    }

    return (await response.json()) as AverageRatingResponse;
  } catch (error) {
    console.error("Error fetching average rating:", error);
    return null;
  }
};

/**
 * Resolves a product handle (URL slug) to a product ID via the BFF route
 * @param handle - The product URL handle/slug
 * @returns The product ID or null if not found
 */
export const resolveProductIdFromHandle = async (
  handle: string
): Promise<string | null> => {
  try {
    const response = await fetch("/api/v1/product-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle }),
    });
    const result = await response.json();
    return result?.productId ?? null;
  } catch {
    return null;
  }
};

/**
 * Transform API rating breakdown to histogram format
 */
export const transformRatingBreakdown = (ratingData: AverageRatingResponse) => {
  return [5, 4, 3, 2, 1].map((stars) => {
    const key = String(stars) as keyof typeof ratingData.ratings;
    const entry = ratingData.ratings[key];
    return {
      stars,
      percentage: entry.percentage,
      count:
        typeof entry.count === "string" ? parseInt(entry.count) : entry.count,
    };
  });
};
