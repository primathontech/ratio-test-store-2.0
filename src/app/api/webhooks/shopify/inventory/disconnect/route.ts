import { revalidateTag } from "next/cache";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * Shopify webhook endpoint for inventory item disconnection
 * Handles inventory_items/disconnect webhook from Shopify
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const rawBody = await request.text();
    const inventoryItem = JSON.parse(rawBody);

    // Verify Shopify webhook signature
    const signature = request.headers.get("x-shopify-hmac-sha256");
    if (!verifyShopifyWebhook(rawBody, signature)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inventoryItemId = inventoryItem.id?.toString();

    if (inventoryItemId) {
      revalidateTag(`inventory-${inventoryItemId}`);
      revalidateTag("inventory");
      revalidateTag("products");
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      inventoryItemId: inventoryItem.id,
      sku: inventoryItem.sku,
      duration,
      timestamp: new Date().toISOString(),
    });
  } catch {
    const duration = Date.now() - startTime;

    return NextResponse.json(
      {
        error: "Internal server error",
        duration,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Verify Shopify webhook signature using HMAC-SHA256
 */
function verifyShopifyWebhook(body: string, signature: string | null): boolean {
  if (!signature || !process.env.SHOPIFY_WEBHOOK_SECRET) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET)
      .update(body, "utf8")
      .digest("base64");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "base64"),
      Buffer.from(signature, "base64")
    );
  } catch {
    return false;
  }
}
