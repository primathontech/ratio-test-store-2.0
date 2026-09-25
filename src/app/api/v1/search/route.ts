import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 10, page = 1, storeId, show_variants = true } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const merchantId =
      storeId ||
      process.env.NEXT_PUBLIC_MERCHANT_ID ||
      process.env.NEXT_PUBLIC_STORE_ID;

    if (!merchantId) {
      return NextResponse.json(
        { error: "Store ID or Merchant ID is required" },
        { status: 400 }
      );
    }

    // Build the search endpoint URL from the product base URL
    // The base may be versioned (.../api/v1) or bare (.../ps) — ensure /api/v1 path
    const baseApiUrl =
      process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL_V1 ||
      process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL;

    const versionedUrl = baseApiUrl?.includes("/api/v")
      ? baseApiUrl
      : `${baseApiUrl}/api/v1`;
    const searchApiUrl = `${versionedUrl}/products/search`;

    const searchPayload = {
      query,
      limit,
      page,
      storeId: merchantId,
      show_variants,
    };

    const response = await fetch(searchApiUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "gk-merchant-id": merchantId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchPayload),
    });

    if (!response.ok) {
      console.error(
        `Search API error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        {
          error: "Failed to fetch search results",
          details: `External API returned ${response.status}`,
        },
        { status: response.status }
      );
    }

    const searchResults = await response.json();
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
