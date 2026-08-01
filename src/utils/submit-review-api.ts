/**
 * Submit Review API utility for CustomerReviews
 * Posts new reviews to the GoKwik custom backend
 */

// Submit review endpoint base URL (falls back to V1 if not set)
const REVIEW_API_BASE_URL =
  process.env.NEXT_PUBLIC_REVIEW_SUBMIT_API_URL ||
  process.env.NEXT_PUBLIC_CUSTOM_BACKEND_API_PRODUCT_URL_V1;
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
 * Submit a customer review
 */
export const submitReview = async (
  formData: {
    name: string;
    email: string;
    title: string;
    comment: string;
    rating: number;
  },
  productId?: string,
  accessToken?: string | null
) => {
  try {
    const reviewData = {
      product_id: productId || "",
      title: formData.title,
      user_id:
        (typeof localStorage !== "undefined" &&
          localStorage.getItem("kp_user_id")) ||
        getCookieValue("kp_user_id") ||
        `user_${Date.now()}`,
      user_name: formData.name,
      user_type: "customer",
      order_id: null,
      rating: formData.rating,
      review_text: formData.comment,
      is_visible: false,
      archived: false,
      email: formData.email,
    };

    const response = await fetch(`${REVIEW_API_BASE_URL}/auth/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "gk-merchant-id": MERCHANT_ID,
        ...(accessToken ? { "gk-access-token": accessToken } : {}),
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error(
          "Your session has expired. Please refresh the page and try again."
        );
      }

      const errorMsg =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.message === "string"
            ? errorData.message
            : JSON.stringify(errorData) !== "{}"
              ? JSON.stringify(errorData)
              : `HTTP error! status: ${response.status}`;
      throw new Error(errorMsg);
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: "Review submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit review",
    };
  }
};
