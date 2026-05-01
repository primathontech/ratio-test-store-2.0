/**
 * Get Reviews API utility for CustomerReviews
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
    "1": { count: number; percentage: number };
    "2": { count: number; percentage: number };
    "3": { count: number; percentage: number };
    "4": { count: number; percentage: number };
    "5": { count: number; percentage: number };
  };
}

// Environment variables
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

const REVIEW_API_BASE_URL = process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL;

/**
 * Transform custom backend review to ReviewsList format
 */
const transformCustomReviewToReviewsList = (
  customReview: CustomReviewResponse
) => {
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
        return "Mother's Score";
    }
  };

  return {
    name: customReview.user_name || "customer",
    title: customReview.title,
    description: customReview.review_text,
    rating: customReview.rating,
    date: customReview.created_at,
    image: customReview.media_url || null,
    score: getScoreLabel(customReview.score),
  };
};

/**
 * Fetches reviews for a given product ID from custom backend
 */
export const getProductReviews = async (
  productId: number | string,
  page = 1,
  limit = 3,
  sortKey?: string
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
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      is_visible: "true",
    });

    if (sortKey) {
      queryParams.append("sort_by", sortKey);
    }

    const url = `${REVIEW_API_BASE_URL}/api/v2/reviews/${productId}?${queryParams.toString()}`;
    // eslint-disable-next-line no-restricted-syntax
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
      .filter((review) => review.product_id && true)
      .map((review) => ({
        id: review.id,
        ...transformCustomReviewToReviewsList(review),
      }));

    return {
      reviews: transformedReviews,
      count: customData.total,
      page,
      per_page: limit,
    };
  } catch (error) {
    console.error("Error fetching product reviews from custom backend:", error);
    return null;
  }
};

/**
 * Fetches average rating and rating breakdown for a given product ID
 */
export const getProductAverageRating = async (
  productId: number | string
): Promise<AverageRatingResponse | null> => {
  try {
    const url = `${REVIEW_API_BASE_URL}/api/v1/review/${productId}/average`;
    // eslint-disable-next-line no-restricted-syntax
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
 */
export const transformRatingBreakdown = (ratingData: AverageRatingResponse) => {
  const toCount = (raw: number | string) =>
    typeof raw === "string" ? parseInt(raw) : raw;

  return [
    {
      stars: 5,
      percentage: ratingData.ratings["5"].percentage,
      count: toCount(ratingData.ratings["5"].count),
    },
    {
      stars: 4,
      percentage: ratingData.ratings["4"].percentage,
      count: toCount(ratingData.ratings["4"].count),
    },
    {
      stars: 3,
      percentage: ratingData.ratings["3"].percentage,
      count: toCount(ratingData.ratings["3"].count),
    },
    {
      stars: 2,
      percentage: ratingData.ratings["2"].percentage,
      count: toCount(ratingData.ratings["2"].count),
    },
    {
      stars: 1,
      percentage: ratingData.ratings["1"].percentage,
      count: toCount(ratingData.ratings["1"].count),
    },
  ];
};
