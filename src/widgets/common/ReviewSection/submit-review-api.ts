/**
 * Submit Review API utility for CustomerStories ReviewForm
 * Based on the reference implementation from reviews-custom
 */

// Environment variables
const REVIEW_API_BASE_URL = process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL_V1;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

/**
 * Get cookie value by name
 */
const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

/**
 * Submit review using the same pattern as ReviewFormCustom
 * This calls the existing API route at /api/v1/reviews
 */
export const submitCustomerStoryReview = async (
  formData: {
    name: string;
    email: string;
    title: string;
    comment: string;
    rating: number;
    // age?: string;
    // phone?: string;
    // score?: string;
  },
  productId?: string,
  accessToken?: string
) => {
  try {
    // Prepare review data in the same format as ReviewFormCustom
    const reviewData = {
      product_id: productId || "12345", // Use provided productId or default
      title: formData.title,
      user_id:
        localStorage.getItem("kp_user_id") ||
        getCookieValue("kp_user_id") ||
        `user_${Date.now()}`,
      user_name: formData.name,
      user_type: "customer",
      order_id: null, // Optional field - can be null for now
      rating: formData.rating,
      review_text: formData.comment,
      is_visible: false, // Set to false initially for moderation
      archived: false,
      // Additional fields from the curl request
      //   age: formData.age ? parseInt(formData.age) : 0,
      email: formData.email,
      //   phone_no: formData.phone || null,
      //   score: formData.score || null,
    };

    // Submit review to custom backend via API route (same as ReviewFormCustom)

    const response = await fetch(`${REVIEW_API_BASE_URL}/auth/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "gk-merchant-id": MERCHANT_ID || "",
        ...(accessToken ? { "gk-access-token": accessToken } : {}),
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle 401 specifically - token might be expired
      if (response.status === 401) {
        console.error("Authentication failed - token might be expired");
        throw new Error(
          "Your session has expired. Please refresh the page and try again."
        );
      }

      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    return {
      success: true,
      data: result,
      message: "Review submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting customer story review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit review",
    };
  }
};
