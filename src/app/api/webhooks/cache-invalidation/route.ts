import { handleCacheInvalidation } from "@shopkit/webhooks";
import { NextRequest, NextResponse } from "next/server";

/**
 * Cache-invalidation webhook.
 *
 * Signature verification, payload validation, and the cache-tag cascade all live in
 * the shared @shopkit/webhooks `handleCacheInvalidation` handler, so every merchant
 * runs one implementation and the tag strings stay in lockstep with the producer
 * (@shopkit/data-layer). See the cache-tag invalidation RFC.
 *
 * Contract — ONE endpoint, ONE shared secret, TWO signing schemes, because two
 * producers post here and they sign differently. The verifier dispatches on which
 * headers are present.
 *
 *   GoKwik delivery worker (commerce events) — preferred:
 *     x-gokwik-signature: <hex HMAC-SHA256("<timestamp>.<rawBody>", WEBHOOK_SECRET)>
 *     x-gokwik-timestamp: <unix seconds or ms>   signed, so replays expire (±5 min)
 *     x-gokwik-event-id:  <delivery id>          used as the correlation id
 *
 *   Admin / dashboard (mega menu, SEO config) — DEPRECATED, no replay protection:
 *     x-webhook-signature: sha256=<hex HMAC-SHA256(rawBody, WEBHOOK_SECRET)>
 *
 *   POST /api/webhooks/cache-invalidation
 *   body: { "type": "product.updated", "data": { "handle": "..." } }
 *      or the native { "event_type": "products/update", "product": { ... } }
 *
 * Responses: 200 with `purged: { tags, paths }`, 400 malformed, 401 bad signature,
 * 413 too large, 500 internal. Every response carries a `requestId` — quote it when
 * reporting a failed delivery.
 *
 * Required env: WEBHOOK_SECRET. Without it the handler refuses every delivery
 * (fail-closed) unless WEBHOOK_ALLOW_UNSIGNED=1 is set, which is for local
 * development only.
 */
export async function POST(request: NextRequest) {
  return handleCacheInvalidation(request, {
    // Pre-render created/updated pages so the first real visitor gets a cache HIT
    // instead of paying for a cold render. Omitted when unset — the handler logs that
    // warming is disabled rather than skipping silently.
    warmBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  });
}

/**
 * Health check for uptime probes. Deliberately reveals nothing about configuration.
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}
