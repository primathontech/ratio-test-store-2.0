import { NextRequest, NextResponse } from "next/server";
import { getCommerceClient } from "@/config/commerce";
import { voiceGuard } from "@/lib/voiceGuard";

// Order ids are opaque alphanumerics; validate before interpolating into the upstream
// URL so a crafted value can't inject path/query segments.
const SAFE_ID = /^[A-Za-z0-9_-]{1,128}$/;

/**
 * POST /api/v1/orders/[orderId]/cancel
 *
 * BFF proxy for the order cancellation call. Avoids browser CORS by
 * forwarding the call server-side. The client passes its access token via
 * the `gk-access-token` header (or `x-gk-access-token` fallback).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  // Rate-limit: state-changing, per-customer op.
  const blocked = voiceGuard(request, "order-cancel", 30);
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

    const body = await request.json().catch(() => ({}));

    const merchantId =
      process.env.NEXT_PUBLIC_MERCHANT_ID || process.env.MERCHANT_ID || "";

    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url: `${baseURL}/api/v1/auth/customers/orders/${orderId}/cancel`,
      method: "POST",
      headers: {
        accept: "*/*",
        "gk-merchant-id": merchantId,
        "gk-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(response.data ?? null);
  } catch (error) {
    console.error("Cancel order proxy error:", error);
    // Generic error only — never echo the upstream/exception message to the client.
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
