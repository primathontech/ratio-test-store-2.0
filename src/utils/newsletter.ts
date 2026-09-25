interface SubscribeResponse {
  success: boolean;
  message: string;
}

export async function subscribeNewsletter(
  email: string
): Promise<SubscribeResponse> {
  if (!email) {
    return { success: false, message: "Email is required" };
  }

  try {
    const response = await fetch("/api/v1/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to subscribe",
      };
    }

    return { success: true, message: "Subscription successful" };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to subscribe",
    };
  }
}
