import { NextRequest, NextResponse } from "next/server";
import { getCommerceClient } from "@/config/commerce";
import { voiceGuard } from "@/lib/voiceGuard";

// Order ids are opaque alphanumerics; validate before interpolating into the upstream
// URL so a crafted value can't inject path/query segments.
const SAFE_ID = /^[A-Za-z0-9_-]{1,128}$/;

/**
 * GET /api/v1/orders/[orderId]/cancellable
 *
 * BFF proxy for the cancel-eligibility check. Avoids browser CORS by
 * forwarding the call server-side. The client passes its access token via
 * the `gk-access-token` header (or `x-gk-access-token` fallback); the
 * merchant id is resolved server-side from env.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const blocked = voiceGuard(request, "order-cancellable", 60);
  if (blocked) return blocked;
  try {
    const { orderId } = await params;

    if (!orderId || !SAFE_ID.test(orderId)) {
      return NextResponse.json(
        { error: "A valid orderId is required" },
        { status: 400 }
      );
    }

    const baseURL = process.env.NEXT_PUBLIC_CUSTOM_API_CART_URL || "";
    if (!baseURL) {
      return NextResponse.json(
        { error: "Cart API base URL is not configured" },
        { status: 500 }
      );
    }

    const token =
      request.headers.get("gk-access-token") ||
      request.headers.get("x-gk-access-token") ||
      "";

    if (!token) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 401 }
      );
    }

    const merchantId =
      process.env.NEXT_PUBLIC_MERCHANT_ID || process.env.MERCHANT_ID || "";

    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url: `${baseURL}/api/v1/auth/customers/orders/${orderId}/cancellable`,
      method: "GET",
      headers: {
        accept: "*/*",
        "gk-merchant-id": merchantId,
        "gk-access-token": token,
      },
    });

    return NextResponse.json(response.data ?? null);
  } catch (error) {
    console.error("Cancellable proxy error:", error);
    return NextResponse.json(
      { error: "Failed to check cancellation eligibility" },
      { status: 500 }
    );
  }
}
