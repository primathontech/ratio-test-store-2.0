import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

  const apiUrl = `${baseURL}/auth/customers/orders/${orderId}/cancellable`;

  const headers: Record<string, string> = {
    accept: "*/*",
    "gk-merchant-id": gkMerchantId,
    "gk-access-token": gkAccessToken,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking order cancellation eligibility:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
