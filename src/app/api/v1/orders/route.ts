import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const requestId = searchParams.get("requestId");
  const customerId = searchParams.get("customerId");
  const phone = searchParams.get("phone");
  const gkAccessToken = searchParams.get("gkAccessToken");
  const mid = process.env.MERCHANT_ID;
  const baseURL = process.env.NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL;

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

  const apiUrl = `${baseURL}/api/v1/auth/customers/orders?page=${page}&limit=${limit}&tracking=true`;

  const headers: Record<string, string> = {
    accept: "application/json",
    "Gk-Merchant-Id": mid,
    "Gk-Request-Id": requestId || "",
    "Gk-Customer-Id": customerId || "",
    "Gk-Phone": phone,
    "gk-access-token": gkAccessToken || "",
  };

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
