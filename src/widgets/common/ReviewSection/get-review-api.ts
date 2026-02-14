/**
 * Get Reviews API utility for CustomerStories
 * Based on the reference implementation from reviews-custom
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
interface AverageRatingResponse {
  product_id: string;
  average_rating: number;
  total_ratings: number;
  ratings: {
    "1": {
      count: number;
      percentage: number;
    };
    "2": {
      count: number;
      percentage: number;
    };
    "3": {
      count: number;
      percentage: number;
    };
    "4": {
      count: number;
      percentage: number;
    };
    "5": {
      count: number;
      percentage: number;
    };
  };
}

// Environment variables
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

const REVIEW_API_BASE_URL_V2 =
  process.env.NEXT_PUBLIC_CUSTOM_BACKEND_API_PRODUCT_URL_V2;

const REVIEW_API_BASE_URL_V1 =
  process.env.NEXT_PUBLIC_CUSTOM_BACKEND_API_PRODUCT_URL_V1;

/**
 * Transform custom backend review to Judge.me compatible format
 */

/**
 * Transform custom backend review to ReviewsList format
 * This matches the format expected by the ReviewsList component
 */
const transformCustomReviewToReviewsList = (
  customReview: CustomReviewResponse
) => {
  // Map score values to display format
  const getScoreLabel = (score?: string) => {
    switch (score) {
      case "Father":
        return "Father's Score";
      case "Mother":
        return "Mother's Score";
      case "Brother":
        return "Brother's Score";
      case "Sister":
        return "Sister's Score";
      default:
        return "Mother's Score"; // Default fallback
    }
  };

  return {
    name: customReview.user_name || "customer",
    title: customReview.title,
    description: customReview.review_text,
    rating: customReview.rating,
    date: new Date(customReview.created_at).toLocaleDateString(),
    image: customReview.media_url || null,
    score: getScoreLabel(customReview.score),
  };
};

/**
 * Fetches reviews for a given product ID from custom backend
 * Using the new v2 API endpoint with the provided curl command
 * @param productId - The product ID
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of reviews per page (default: 3)
 * @param sortBy - Sort option: 'rating_asc', 'rating_desc', or 'newest' (default: undefined)
 * @returns The reviews response in Judge.me compatible format or null if error
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
    score: string;
  }[];
  count: number;
  page: number;
  per_page: number;
} | null> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      is_visible: "true",
    });

    // Add sort_by parameter if provided
    if (sortBy) {
      queryParams.append("sort_by", sortBy);
    }

    // Fetch from custom backend API using the new v2 endpoint
    // URL format: {BASE_URL}/reviews/{productId}?page=1&limit=10&sort_by=rating_desc
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

    // Transform custom reviews to ReviewsList format.
    // Only show reviews that have a product_id and are visible.
    const transformedReviews = customData.data
      .filter((review) => review.product_id && true)
      .map((review) => ({
        id: review.id,
        ...transformCustomReviewToReviewsList(review),
      }));

    const result = {
      reviews: transformedReviews,
      count: customData.total,
      page,
      per_page: limit,
    };
    return result;
  } catch (error) {
    console.error("Error fetching product reviews from custom backend:", error);
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
    // Fetch from custom backend API using the v1 average endpoint
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

    const averageData = (await response.json()) as AverageRatingResponse;

    return averageData;
  } catch (error) {
    console.error("Error fetching average rating from custom backend:", error);
    return null;
  }
};

/**
 * Transform API rating breakdown to component format
 * @param ratingData - The average rating response from API
 * @returns Array of rating breakdown in component format
 */
export const transformRatingBreakdown = (ratingData: AverageRatingResponse) => {
  return [
    {
      stars: 5,
      percentage: ratingData.ratings["5"].percentage,
      count:
        typeof ratingData.ratings["5"].count === "string"
          ? parseInt(ratingData.ratings["5"].count)
          : ratingData.ratings["5"].count,
    },
    {
      stars: 4,
      percentage: ratingData.ratings["4"].percentage,
      count:
        typeof ratingData.ratings["4"].count === "string"
          ? parseInt(ratingData.ratings["4"].count)
          : ratingData.ratings["4"].count,
    },
    {
      stars: 3,
      percentage: ratingData.ratings["3"].percentage,
      count:
        typeof ratingData.ratings["3"].count === "string"
          ? parseInt(ratingData.ratings["3"].count)
          : ratingData.ratings["3"].count,
    },
    {
      stars: 2,
      percentage: ratingData.ratings["2"].percentage,
      count:
        typeof ratingData.ratings["2"].count === "string"
          ? parseInt(ratingData.ratings["2"].count)
          : ratingData.ratings["2"].count,
    },
    {
      stars: 1,
      percentage: ratingData.ratings["1"].percentage,
      count:
        typeof ratingData.ratings["1"].count === "string"
          ? parseInt(ratingData.ratings["1"].count)
          : ratingData.ratings["1"].count,
    },
  ];
};
