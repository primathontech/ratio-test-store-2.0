import { NextRequest, NextResponse } from "next/server";

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

    const mid = process.env.MERCHANT_ID || process.env.NEXT_PUBLIC_MERCHANT_ID;
    const baseURL = process.env.CUSTOM_API_ORDER_TRACKING_URL;

    if (!baseURL || !mid) {
      return NextResponse.json(
        {
          error:
            "Server configuration error: missing tracking URL or merchant ID",
        },
        { status: 500 }
      );
    }

    const apiUrl = `${baseURL}/api/v1/order-tracking/${orderId}?getHistory=${getHistory}`;

    const headers: Record<string, string> = {
      accept: "application/json",
      "gk-merchant-id": mid,
    };

    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Order tracking API route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order tracking information" },
      { status: 500 }
    );
  }
}
