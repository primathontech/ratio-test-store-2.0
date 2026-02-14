import { handleShopifyWebhook } from "@shopkit/webhooks";
import { NextRequest } from "next/server";

/**
 * Shopify webhook endpoint for collection deletion
 * Uses the generic webhook handler
 */
export async function POST(request: NextRequest) {
  return handleShopifyWebhook(request, {
    webhookType: "collection.deleted",
    entityType: "collection",
    logMessage: "collection deletion",
  });
}
