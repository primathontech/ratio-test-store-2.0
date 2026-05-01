import { NextRequest, NextResponse } from "next/server";
import { getCommerceClient } from "@/config/commerce";

interface OrderTrackingParams {
  params: {
    orderId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: OrderTrackingParams
) {
  try {
    const { orderId } = params;
    const { searchParams } = new URL(request.url);
    const getHistory = searchParams.get("getHistory") || "true";

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const mid =
      process.env.NEXT_PUBLIC_MERCHANT_ID || process.env.MERCHANT_ID || "";
    const baseURL = process.env.CUSTOM_API_ORDER_TRACKING_URL || "";

    if (!baseURL) {
      return NextResponse.json(
        { error: "Order tracking API URL is not configured" },
        { status: 500 }
      );
    }

    const apiUrl = `${baseURL}/api/v1/order-tracking/${orderId}?getHistory=${getHistory}`;

    const headers: Record<string, string> = {
      accept: "application/json",
      "gk-merchant-id": mid,
    };

    try {
      const commerceClient = getCommerceClient();
      const response = await commerceClient.fetchRequest({
        url: apiUrl,
        method: "GET",
        headers,
      });

      return NextResponse.json(response.data);
    } catch (error) {
      console.error("Order tracking API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch order tracking information" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Order tracking API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
