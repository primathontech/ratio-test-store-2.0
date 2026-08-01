import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

    const response = await fetch(
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
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch customer profile" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in customer API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
