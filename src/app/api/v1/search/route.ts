import { NextRequest, NextResponse } from "next/server";
import { captureSentryException } from "@/lib/sentry/utils";
import { fetchWithTimeout } from "@/utils/serverFetch";
import { voiceGuard, readJsonBody } from "@/lib/voiceGuard";

export async function POST(request: NextRequest) {
  // Rate-limit: open search proxy — cap to prevent scrape / cost amplification.
  const blocked = voiceGuard(request, "search", 120);
  if (blocked) return blocked;
  const parsed = await readJsonBody<Record<string, unknown>>(request);
  if (!parsed.ok) return parsed.response;
  try {
    const body = parsed.data;
    const { query, show_variants = true } = body as {
      query?: string;
      show_variants?: boolean;
    };

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // TENANT is ALWAYS the server's own merchant — never a client-supplied `storeId`.
    // Honoring a client storeId let a caller query OTHER merchants' catalogs through
    // this endpoint (cross-tenant leak).
    const merchantId =
      process.env.NEXT_PUBLIC_MERCHANT_ID || process.env.NEXT_PUBLIC_STORE_ID;
    // Clamp paging so a caller can't request an enormous page (cost amplification).
    const limit = Math.min(50, Math.max(1, Number(body.limit) || 10));
    const page = Math.max(1, Number(body.page) || 1);

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

    const response = await fetchWithTimeout(searchApiUrl, {
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
        { error: "Failed to fetch search results" },
        { status: 502 }
      );
    }

    const searchResults = await response.json();
    return NextResponse.json(searchResults);
  } catch (error) {
    captureSentryException(error, {
      tags: { flow: "search", operation: "search", errorType: "search" },
    });
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
