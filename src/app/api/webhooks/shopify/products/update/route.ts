import { handleShopifyWebhook } from "@shopkit/webhooks";
import { NextRequest } from "next/server";

/**
 * Shopify webhook endpoint for product updates
 * Uses the generic webhook handler
 */
export async function POST(request: NextRequest) {
  return handleShopifyWebhook(request, {
    webhookType: "product.updated",
    entityType: "product",
    logMessage: "product update",
  });
}
