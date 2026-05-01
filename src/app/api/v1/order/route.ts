import { NextRequest, NextResponse } from "next/server";
import { getCommerceClient } from "@/config/commerce";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const requestId = searchParams.get("requestId");
  const customerId = searchParams.get("customerId");
  const phone = searchParams.get("phone");
  const gkAccessToken = request.headers.get("gk-access-token");
  const mid =
    process.env.NEXT_PUBLIC_MERCHANT_ID || process.env.MERCHANT_ID || "";
  const baseURL =
    process.env.CUSTOM_BACKEND_API_ORDER_HISTORY_URL ||
    process.env.NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL ||
    "";

  if (!orderId) {
    return NextResponse.json(
      { error: "Missing orderId parameter" },
      { status: 400 }
    );
  }

  if (!baseURL) {
    return NextResponse.json(
      { error: "Order history API URL is not configured" },
      { status: 500 }
    );
  }

  const apiUrl = `${baseURL}/auth/customers/orders/${orderId}`;

  const headers: Record<string, string> = {
    accept: "application/json",
    "Gk-Request-Id": requestId || "",
    "Gk-Customer-Id": customerId || "",
    "Gk-Phone": phone || "",
    "gk-merchant-id": mid,
    "merchant-mid": mid,
    ...(gkAccessToken && { "gk-access-token": gkAccessToken }),
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
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
