import { handleShopifyWebhook } from "@shopkit/webhooks";
import { NextRequest } from "next/server";

/**
 * Shopify webhook endpoint for product creation
 * Uses the generic webhook handler
 */
export async function POST(request: NextRequest) {
  return handleShopifyWebhook(request, {
    webhookType: "product.created",
    entityType: "product",
    logMessage: "product creation",
  });
}
