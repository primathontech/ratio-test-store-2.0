import { NextRequest, NextResponse } from "next/server";
import { captureSentryException } from "@/lib/sentry/utils";
import { fetchWithTimeout } from "@/utils/serverFetch";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const newsletterApiUrl = process.env.NEWSLETTER_API_URL;
    const baseUrl = process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL ?? "";
    const storeId = process.env.NEXT_PUBLIC_STORE_ID ?? "";
    const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID ?? "";

    const apiUrl = newsletterApiUrl
      ? `${newsletterApiUrl}/api/v1/newsletter/subscribe`
      : `${baseUrl}/api/v1/newsletter/subscribe`;

    const response = await fetchWithTimeout(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "gk-merchant-id": merchantId,
      },
      body: JSON.stringify({
        subscriber_email: email,
        store_id: storeId,
        merchant_id: merchantId,
        opt_out: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        `Newsletter subscription failed: ${data.message || "Unknown error"}`
      );
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to subscribe",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription successful",
      data,
    });
  } catch (error) {
    captureSentryException(error, {
      tags: { flow: "newsletter", operation: "subscribe", errorType: "data" },
    });
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
