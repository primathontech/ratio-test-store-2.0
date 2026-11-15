import { NextRequest, NextResponse } from "next/server";
import { captureSentryException } from "@/lib/sentry/utils";
import { fetchWithTimeout } from "@/utils/serverFetch";
import { voiceGuard } from "@/lib/voiceGuard";

export async function GET(request: NextRequest) {
  // Rate-limit: private customer endpoint — cap requests to blunt token brute/abuse.
  const blocked = voiceGuard(request, "customer", 60);
  if (blocked) return blocked;
  try {
    const gkAccessToken = request.headers.get("gk-access-token");
    const gkMerchantId = request.headers.get("gk-merchant-id");

    if (!gkAccessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    if (!gkMerchantId) {
      return NextResponse.json(
        { error: "Merchant ID is required" },
        { status: 400 }
      );
    }

    const customerApiUrl = process.env.CUSTOMER_API_URL;
    if (!customerApiUrl) {
      return NextResponse.json(
        { error: "CUSTOMER_API_URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetchWithTimeout(
      `${customerApiUrl}/storefront/customers/profile`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
          "gk-merchant-id": gkMerchantId,
          "gk-access-token": gkAccessToken,
        },
      }
    );

    if (!response.ok) {
      // Generic error only — never echo the upstream message/body to the client.
      return NextResponse.json(
        { error: "Failed to fetch customer profile" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    captureSentryException(error, {
      tags: {
        flow: "customer",
        operation: "fetchCustomer",
        errorType: "customer",
      },
    });
    console.error("Error in customer API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
