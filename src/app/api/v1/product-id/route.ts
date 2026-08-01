import { NextRequest, NextResponse } from "next/server";
import { captureSentryException } from "@/lib/sentry/utils";
import { fetchWithTimeout } from "@/utils/serverFetch";

const PRODUCT_API_URL = process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

export async function POST(req: NextRequest) {
  try {
    const { handle } = await req.json();
    if (!handle || !PRODUCT_API_URL) {
      return NextResponse.json({ error: "Missing handle" }, { status: 400 });
    }

    const res = await fetchWithTimeout(
      `${PRODUCT_API_URL}/api/v1/product/details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          "gk-merchant-id": MERCHANT_ID,
        },
        body: JSON.stringify({ productHandle: handle }),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const data = await res.json();
    const id = data?.product?.id || data?.data?.id || data?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ productId: String(id) });
  } catch (error) {
    captureSentryException(error, {
      tags: { flow: "product", operation: "fetchProductId", errorType: "data" },
    });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
