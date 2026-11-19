const REVIEW_API_BASE_URL = process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

export const submitCustomerStoryReview = async (
  formData: {
    name: string;
    email: string;
    title: string;
    comment: string;
    rating: number;
    mediaUrl?: string | null;
  },
  productId?: string,
  accessToken?: string
) => {
  try {
    const reviewData = {
      product_id: productId || "12345",
      title: formData.title,
      user_id:
        localStorage.getItem("kp_user_id") ||
        getCookieValue("kp_user_id") ||
        `user_${Date.now()}`,
      user_name: formData.name,
      user_type: "customer",
      order_id: null,
      rating: formData.rating,
      review_text: formData.comment,
      media_url: formData.mediaUrl || null,
      is_visible: false,
      archived: false,
      email: formData.email,
    };

    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(`${REVIEW_API_BASE_URL}/api/v1/auth/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "gk-merchant-id": MERCHANT_ID || "",
        ...(localStorage.getItem("KWIKUSERTOKEN") || accessToken
          ? {
              "gk-access-token":
                localStorage.getItem("KWIKUSERTOKEN") || accessToken || "",
            }
          : {}),
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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit review",
    };
  }
};

export const uploadReviewMedia = async (
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const body = new FormData();
    body.append("file", file);
    // eslint-disable-next-line no-restricted-syntax
    const res = await fetch("/api/reviews/upload", {
      method: "POST",
      body,
    });
    const json = (await res.json().catch(() => ({}))) as {
      url?: string;
      error?: string;
      code?: string;
    };
    if (!res.ok || !json.url) {
      return {
        success: false,
        error:
          json.code === "UPLOAD_NOT_CONFIGURED"
            ? "Photo upload is currently unavailable."
            : json.error || "Upload failed",
      };
    }
    return { success: true, url: json.url };
  } catch {
    return { success: false, error: "Upload failed" };
  }
};
