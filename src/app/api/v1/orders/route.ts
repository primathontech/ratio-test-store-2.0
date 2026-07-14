import { NextRequest, NextResponse } from "next/server";
import { captureSentryException } from "@/lib/sentry/utils";
import { fetchWithTimeout } from "@/utils/serverFetch";
import { voiceGuard } from "@/lib/voiceGuard";

export async function GET(request: NextRequest) {
  // Rate-limit: order history is a private, per-customer endpoint — cap requests so it
  // can't be used to enumerate/scrape.
  const blocked = voiceGuard(request, "orders", 60);
  if (blocked) return blocked;

  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const requestId = searchParams.get("requestId");
  const customerId = searchParams.get("customerId");
  // Credentials + phone come from HEADERS ONLY — never the query string (a token/phone
  // in a URL leaks via access logs / Referer / history). The voice client already
  // sends both as headers.
  const phone = request.headers.get("gk-phone");
  const gkAccessToken = request.headers.get("gk-access-token");
  const mid = process.env.MERCHANT_ID;
  const baseURL = process.env.NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL;

  // AUTHN: order history is customer-private. REQUIRE the access token — previously it
  // defaulted to "" when absent, which let an anonymous caller enumerate ANY customer's
  // orders just by supplying a phone number. The token is what authorizes the lookup
  // upstream; without it we refuse before making the call.
  if (!gkAccessToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  if (!phone) {
    return NextResponse.json(
      { error: "Missing phone parameter" },
      { status: 400 }
    );
  }

  if (!baseURL || !mid) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const apiUrl = `${baseURL}/api/v1/auth/customers/orders?page=${encodeURIComponent(
    page
  )}&limit=${encodeURIComponent(limit)}&tracking=true`;

  const headers: Record<string, string> = {
    accept: "application/json",
    "Gk-Merchant-Id": mid,
    "Gk-Request-Id": requestId || "",
    "Gk-Customer-Id": customerId || "",
    "Gk-Phone": phone,
    "gk-access-token": gkAccessToken,
  };

  try {
    const response = await fetchWithTimeout(apiUrl, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    captureSentryException(error, {
      tags: { flow: "order", operation: "fetchOrders", errorType: "data" },
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
