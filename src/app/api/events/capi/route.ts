/**
 * Meta CAPI Route — /api/events/capi
 *
 * Receives batched CAPI events from the Meta Pixel SDK (client-side),
 * uses MetaParamsBuilder to hash PII and enrich with server context,
 * and forwards to Facebook's Conversions API.
 *
 * Supports multi-pixel dispatch via FACEBOOK_MULTI_CAPI_ACCESS_TOKENS.
 * Format: "pixelId1:accessToken1,pixelId2:accessToken2"
 *
 * PII hashing uses Facebook's official capi-param-builder-nodejs library
 * via @shopkit/events/meta.
 *
 * Logging format — all lines use `[CAPI:<requestId>]` prefix for easy grep:
 *   grep "CAPI:" to see all CAPI logs
 *   grep "CAPI:.*FAIL" to see only failures
 *   grep "CAPI:.*EMQ" to see EMQ warnings
 */

import { createHmac } from "crypto";
import {
  MetaParamsBuilder,
  GRAPH_API_VERSION,
  validateRawCAPIEvent,
  CAPIBatchPayload,
  FacebookPixelConfig,
  PixelDispatchResult,
  MetaCAPIEvent,
} from "@shopkit/events/meta";

// ─── Logging ────────────────────────────────────────────

const PREFIX = "CAPI";

function log(
  requestId: string,
  level: "info" | "warn" | "error",
  step: string,
  message: string,
  opts?: { events?: string; meta?: Record<string, unknown> }
) {
  const tag = `[${PREFIX}:${requestId}]`;
  const eventsTag = opts?.events ? ` [${opts.events}]` : "";
  const line = `${tag} [${step}]${eventsTag} ${message}`;
  if (opts?.meta) {
    console[level](line, JSON.stringify(opts.meta));
  } else {
    console[level](line);
  }
}

// ─── HMAC Auth ──────────────────────────────────────────

const CAPI_HMAC_SECRET = process.env.NEXT_PUBLIC_CAPI_HMAC_SECRET;
const TIME_WINDOW_MS = 300000; // 5 minutes — must match client SDK

/**
 * Verify the HMAC signature on an incoming CAPI request.
 * Returns null if valid (or auth disabled), or an error string if invalid.
 */
function verifyCapiSignature(
  body: { _ts?: number; _sig?: string },
  requestId: string
): string | null {
  // If no secret configured, skip auth (backward compatible)
  if (!CAPI_HMAC_SECRET) {
    return null;
  }

  const { _ts, _sig } = body;

  if (!_ts || !_sig) {
    log(requestId, "warn", "Step 0:AUTH", "FAIL missing _ts or _sig");
    return "Missing authentication signature";
  }

  // Check time window: accept current and previous window (10-min tolerance)
  const currentWindow = Math.floor(Date.now() / TIME_WINDOW_MS);
  if (_ts !== currentWindow && _ts !== currentWindow - 1) {
    log(
      requestId,
      "warn",
      "Step 0:AUTH",
      `FAIL expired token _ts=${_ts} current=${currentWindow}`
    );
    return "Expired authentication token";
  }

  // Verify HMAC
  const expectedSig = createHmac("sha256", CAPI_HMAC_SECRET)
    .update(String(_ts))
    .digest("hex");

  if (_sig !== expectedSig) {
    log(requestId, "warn", "Step 0:AUTH", "FAIL invalid signature");
    return "Invalid authentication signature";
  }

  log(requestId, "info", "Step 0:AUTH", "OK");
  return null;
}

// ─── Config ─────────────────────────────────────────────

/**
 * Parse multi-pixel CAPI configuration from environment variables.
 * Format: "pixelId1:accessToken1,pixelId2:accessToken2"
 */
function getMultiPixelCAPIConfig(requestId: string): {
  pixels: FacebookPixelConfig[];
  error: string | null;
} {
  const baseUrl =
    process.env.FACEBOOK_CAPI_BASE_URL ||
    `https://graph.facebook.com/${GRAPH_API_VERSION}`;

  const multiAccessTokens = process.env.FACEBOOK_MULTI_CAPI_ACCESS_TOKENS;

  if (!multiAccessTokens) {
    return {
      pixels: [],
      error:
        "Missing FACEBOOK_MULTI_CAPI_ACCESS_TOKENS. Format: pixelId1:accessToken1,pixelId2:accessToken2",
    };
  }

  const pixels: FacebookPixelConfig[] = [];

  for (const entry of multiAccessTokens.split(",")) {
    const [pixelId, accessToken] = entry.split(":");
    const trimmedPixelId = pixelId?.trim();
    const trimmedAccessToken = accessToken?.trim();

    if (!trimmedPixelId || !trimmedAccessToken) {
      log(
        requestId,
        "error",
        "Step 2:CONFIG",
        `FAIL invalid token format: "${entry.trim()}". Expected "pixelId:accessToken"`
      );
      continue;
    }

    pixels.push({
      pixelId: trimmedPixelId,
      accessToken: trimmedAccessToken,
      baseUrl,
    });
  }

  if (pixels.length === 0) {
    return {
      pixels: [],
      error:
        "No valid pixel configurations found in FACEBOOK_MULTI_CAPI_ACCESS_TOKENS",
    };
  }

  return { pixels, error: null };
}

// ─── Helpers ────────────────────────────────────────────

function getClientIP(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    undefined
  );
}

/**
 * Send a batch of events to a single Facebook CAPI pixel.
 */
async function sendToPixel(
  config: FacebookPixelConfig,
  events: MetaCAPIEvent[],
  requestId: string,
  eventNames: string
): Promise<PixelDispatchResult> {
  const url = `${config.baseUrl}/${config.pixelId}/events?access_token=${config.accessToken}`;
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: events }),
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      log(
        requestId,
        "error",
        "Step 5:DISPATCH",
        `FAIL pixel=${config.pixelId} status=${response.status} duration=${durationMs}ms`,
        { events: eventNames, meta: errorData as Record<string, unknown> }
      );
      return {
        pixelId: config.pixelId,
        success: false,
        error: `HTTP ${response.status}: ${JSON.stringify(errorData)}`,
        durationMs,
      };
    }

    const result = await response.json().catch(() => ({}));
    log(
      requestId,
      "info",
      "Step 5:DISPATCH",
      `OK pixel=${config.pixelId} events_received=${result.events_received} duration=${durationMs}ms`,
      { events: eventNames }
    );
    return {
      pixelId: config.pixelId,
      success: true,
      events_received: result.events_received,
      messages: result.messages,
      durationMs,
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const message = error instanceof Error ? error.message : String(error);
    log(
      requestId,
      "error",
      "Step 5:DISPATCH",
      `FAIL pixel=${config.pixelId} network_error duration=${durationMs}ms error="${message}"`,
      { events: eventNames }
    );
    return {
      pixelId: config.pixelId,
      success: false,
      error: `Network error: ${message}`,
      durationMs,
    };
  }
}

// ─── Route Handler ──────────────────────────────────────

export async function POST(request: Request) {
  const requestId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  let ev = ""; // event names tag — set after parsing

  try {
    // Step 0: Parse body and verify HMAC signature
    const body = (await request.json()) as CAPIBatchPayload & {
      _ts?: number;
      _sig?: string;
    };

    const authError = verifyCapiSignature(body, requestId);
    if (authError) {
      return Response.json({ error: authError }, { status: 401 });
    }

    // Step 1: Parse batch payload
    const eventCount = body.events?.length ?? 0;
    const eventNames = Array.from(
      new Set((body.events ?? []).map((e) => e.event_name))
    ).join(",");

    ev = eventNames;

    log(requestId, "info", "Step 1:RECEIVE", `events=${eventCount}`, {
      events: ev,
      meta: { payload: body.events },
    });

    if (!body.events || eventCount === 0) {
      log(
        requestId,
        "warn",
        "Step 1:RECEIVE",
        "FAIL empty payload — no events",
        ev ? { events: ev } : undefined
      );
      return Response.json({ error: "No events in payload" }, { status: 400 });
    }

    // Step 2: Validate multi-pixel config
    const { pixels, error: configError } = getMultiPixelCAPIConfig(requestId);
    if (pixels.length === 0) {
      log(requestId, "error", "Step 2:CONFIG", `FAIL ${configError}`, {
        events: ev,
      });
      return Response.json(
        { error: "CAPI configuration error", details: configError },
        { status: 500 }
      );
    }

    const pixelIds = pixels.map((p) => p.pixelId).join(",");
    log(
      requestId,
      "info",
      "Step 2:CONFIG",
      `pixels=${pixels.length} ids=[${pixelIds}]`,
      { events: ev }
    );

    // Step 3: Validate events and log EMQ warnings (dev only)
    if (process.env.NODE_ENV === "development") {
      for (const event of body.events) {
        const result = validateRawCAPIEvent(event);
        if (!result.valid) {
          log(
            requestId,
            "warn",
            "Step 3:VALIDATE",
            `FAIL event_id=${event.event_id} errors: ${result.errors.join("; ")}`,
            { events: event.event_name }
          );
        }
        if (result.warnings.length > 0) {
          log(
            requestId,
            "warn",
            "Step 3:EMQ",
            `warnings: ${result.warnings.join("; ")}`,
            { events: event.event_name }
          );
        }
      }
    }

    // Step 4: Hash PII + enrich with server-side context
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get("user-agent") ?? undefined;

    const enrichedEvents = MetaParamsBuilder.buildBatch(body.events, {
      clientIp: clientIP,
      userAgent,
    });

    log(
      requestId,
      "info",
      "Step 4:ENRICH",
      `hashed_pii=true ip=${clientIP ?? "unknown"} ua=${userAgent ? "present" : "missing"}`,
      {
        events: ev,
        meta: {
          payload: enrichedEvents as unknown as Record<string, unknown>[],
        },
      }
    );

    // Step 5: Dispatch to all pixels in parallel
    const results = await Promise.allSettled(
      pixels.map((pixelConfig) =>
        sendToPixel(pixelConfig, enrichedEvents, requestId, ev)
      )
    );

    // Step 6: Aggregate results
    const pixelResults: PixelDispatchResult[] = results.map((result, i) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      return {
        pixelId: pixels[i].pixelId,
        success: false,
        error: String(result.reason),
      };
    });

    const successCount = pixelResults.filter((r) => r.success).length;
    const failCount = pixelResults.length - successCount;
    const totalReceived = pixelResults.reduce(
      (sum, r) => sum + (r.events_received ?? 0),
      0
    );

    if (successCount === 0) {
      const failReasons = pixelResults
        .filter((r) => !r.success)
        .map((r) => `${r.pixelId}:${r.error}`)
        .join(" | ");
      log(
        requestId,
        "error",
        "Step 6:RESULT",
        `FAIL all_pixels_failed total=${pixels.length} reasons=[${failReasons}]`,
        { events: ev }
      );
      return Response.json(
        {
          error: "All CAPI dispatches failed",
          pixelResults,
        },
        { status: 500 }
      );
    }

    log(
      requestId,
      failCount > 0 ? "warn" : "info",
      "Step 6:RESULT",
      `OK events_sent=${eventCount} events_received=${totalReceived} pixels_ok=${successCount}/${pixels.length}${failCount > 0 ? ` pixels_failed=${failCount}` : ""}`,
      { events: ev }
    );

    return Response.json({
      success: true,
      received: eventCount,
      dispatched: {
        successful: successCount,
        failed: failCount,
        total: pixels.length,
      },
      pixelResults,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(
      requestId,
      "error",
      "Step 0:FATAL",
      `FAIL unhandled error="${message}"`,
      ev ? { events: ev } : undefined
    );
    return Response.json(
      { error: "Failed to process events", requestId },
      { status: 500 }
    );
  }
}
