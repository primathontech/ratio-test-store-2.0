import { handleCacheInvalidation } from "@shopkit/webhooks";
import { NextRequest, NextResponse } from "next/server";

/**
 * Cache-invalidation webhook.
 *
 * Verification, payload validation, and the cache-tag cascade all live in the
 * shared @shopkit/webhooks `handleCacheInvalidation` handler, so every merchant
 * runs one implementation and the tag strings stay in lockstep with the producer
 * (@shopkit/data-layer). See the cache-tag invalidation RFC.
 *
 * Custom backends (OpenStore/GoKwik/CMS) POST `{ type, data }` signed with
 * `x-webhook-signature: sha256=<hex HMAC-SHA256(rawBody, WEBHOOK_SECRET)>`.
 */
export async function POST(request: NextRequest) {
  return handleCacheInvalidation(request, {
    // Warm newly created/updated pages so the first visitor gets a cache HIT.
    warm: { baseUrl: process.env.NEXT_PUBLIC_BASE_URL },
  });
}

/**
 * Health check for uptime probes.
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}
