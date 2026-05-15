import { NextRequest, NextResponse } from "next/server";
import { getCommerceClient } from "@/config/commerce";

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
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
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
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to cancel order",
      },
      { status: 500 }
    );
  }
}
