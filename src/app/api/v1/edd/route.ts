import { NextRequest, NextResponse } from "next/server";
import { getCommerceClient } from "@/config/commerce";

interface EDDRequest {
  orderNumber: string;
  deliveryPincode: string;
}

/**
 * POST /api/v1/edd
 *
 * Fired right after a successful checkout to seed the order-tracking record
 * (Estimated Delivery Date) for the order. Proxies to the GoKwik
 * order-tracking service.
 */
export async function POST(request: NextRequest) {
  try {
    const body: EDDRequest = await request.json();
    const { orderNumber, deliveryPincode } = body;

    if (!orderNumber || !deliveryPincode) {
      return NextResponse.json(
        { error: "orderNumber and deliveryPincode are required" },
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

    const apiUrl = `${baseURL}/api/v1/order-tracking`;

    const headers: Record<string, string> = {
      accept: "application/json",
      "gk-merchant-id": mid,
      "Content-Type": "application/json",
    };

    try {
      const commerceClient = getCommerceClient();
      const response = await commerceClient.fetchRequest({
        url: apiUrl,
        method: "POST",
        headers,
        body: JSON.stringify({ orderNumber, deliveryPincode }),
      });

      return NextResponse.json(response.data);
    } catch (error) {
      console.error("EDD API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch delivery estimate" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("EDD API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
