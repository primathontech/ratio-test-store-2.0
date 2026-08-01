import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const gkAccessToken = request.headers.get("gk-access-token");
  const gkMerchantId = request.headers.get("gk-merchant-id");

  const baseURL = process.env.NEXT_PUBLIC_CUSTOM_API_CART_URL;

  if (!orderId) {
    return NextResponse.json(
      { error: "Missing orderId parameter" },
      { status: 400 }
    );
  }

  if (!gkAccessToken) {
    return NextResponse.json(
      { error: "Missing gk-access-token header" },
      { status: 401 }
    );
  }

  if (!gkMerchantId) {
    return NextResponse.json(
      { error: "Missing gk-merchant-id header" },
      { status: 400 }
    );
  }

  if (!baseURL) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { reason, cancelReasonText } = body;

    if (!reason) {
      return NextResponse.json(
        { error: "Missing reason in request body" },
        { status: 400 }
      );
    }

    const apiUrl = `${baseURL}/auth/customers/orders/${orderId}/cancel`;

    const headers: Record<string, string> = {
      accept: "*/*",
      "gk-merchant-id": gkMerchantId,
      "gk-access-token": gkAccessToken,
      "Content-Type": "application/json",
    };

    const requestBody: any = {
      status: "cancelled",
      reason: reason,
    };

    if (reason === "Other" && cancelReasonText) {
      requestBody.cancelReasonText = cancelReasonText;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
