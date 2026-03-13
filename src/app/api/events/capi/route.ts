/**
 * Meta CAPI Route — /api/events/capi
 *
 * Receives batched CAPI events from the Meta Pixel SDK (client-side),
 * hashes PII with SHA-256 (Facebook requirement),
 * enriches with server-side context (IP, User-Agent),
 * and forwards to Facebook's Conversions API.
 *
 * Supports multi-pixel dispatch via FACEBOOK_MULTI_CAPI_ACCESS_TOKENS.
 * Format: "pixelId1:accessToken1,pixelId2:accessToken2"
 *
 * Raw PII arrives from the client SDK — this route normalizes and hashes it
 * before sending to Facebook (email, phone, name, city, state, etc.).
 */

import { createHash } from "crypto";

const GRAPH_API_VERSION = "v21.0";

// ─── Types ──────────────────────────────────────────────

interface CAPIEvent {
  event_name: string;
  event_id: string;
  event_time: number;
  event_source_url?: string;
  action_source: string;
  user_data: Record<string, string | undefined>;
  custom_data: Record<string, unknown>;
}

interface IngestPayload {
  events: CAPIEvent[];
}

interface FacebookCAPIConfig {
  pixelId: string;
  accessToken: string;
  baseUrl: string;
}

interface PixelResult {
  pixelId: string;
  success: boolean;
  error?: string;
  events_received?: number;
  messages?: unknown;
  durationMs?: number;
}

// ─── Config ─────────────────────────────────────────────

/**
 * Parse multi-pixel CAPI configuration from environment variables.
 * Format: "pixelId1:accessToken1,pixelId2:accessToken2"
 */
function getMultiPixelCAPIConfig(): {
  pixels: FacebookCAPIConfig[];
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

  const pixels: FacebookCAPIConfig[] = [];

  for (const entry of multiAccessTokens.split(",")) {
    const [pixelId, accessToken] = entry.split(":");
    const trimmedPixelId = pixelId?.trim();
    const trimmedAccessToken = accessToken?.trim();

    if (!trimmedPixelId || !trimmedAccessToken) {
      console.error(
        `[CAPI] Invalid token format for entry: "${entry.trim()}". Expected: "pixelId:accessToken"`
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

// ─── PII Hashing ────────────────────────────────────────

/**
 * SHA-256 hash a string (synchronous, Node.js crypto).
 */
function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * Normalize and hash a PII value for Facebook CAPI.
 * - Trims whitespace, lowercases
 * - Phone: strips all non-digits
 */
function hashPII(value: string | undefined, field: string): string | undefined {
  if (!value) {
    return undefined;
  }
  let normalized = value.trim().toLowerCase();
  if (field === "phone") {
    normalized = normalized.replace(/\D/g, "");
  }
  if (!normalized) {
    return undefined;
  }
  return sha256(normalized);
}

/**
 * Transform raw user_data into Facebook CAPI format with hashed PII.
 *
 * Facebook field mapping:
 * - em (email), ph (phone), fn (first_name), ln (last_name)
 * - ct (city), st (state), zp (zip_code), country, db (date_of_birth)
 * - ge (gender), external_id
 * - fbp, fbc (not hashed — Meta identifiers)
 * - client_ip_address, client_user_agent (not hashed — server context)
 */
function hashUserData(
  raw: Record<string, string | undefined>
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};

  // PII fields — normalized + SHA-256 hashed
  if (raw.email) {
    result.em = hashPII(raw.email, "email");
  }
  if (raw.phone) {
    result.ph = hashPII(raw.phone, "phone");
  }
  if (raw.first_name) {
    result.fn = hashPII(raw.first_name, "first_name");
  }
  if (raw.last_name) {
    result.ln = hashPII(raw.last_name, "last_name");
  }
  if (raw.city) {
    result.ct = hashPII(raw.city, "city");
  }
  if (raw.state) {
    result.st = hashPII(raw.state, "state");
  }
  if (raw.zip_code) {
    result.zp = hashPII(raw.zip_code, "zip_code");
  }
  if (raw.country) {
    result.country = hashPII(raw.country, "country");
  }
  if (raw.date_of_birth) {
    result.db = hashPII(raw.date_of_birth, "date_of_birth");
  }
  if (raw.gender) {
    result.ge = hashPII(raw.gender, "gender");
  }
  if (raw.external_id) {
    result.external_id = hashPII(raw.external_id, "external_id");
  }

  // Meta tracking identifiers — NOT hashed
  if (raw.fbp) {
    result.fbp = raw.fbp;
  }
  if (raw.fbc) {
    result.fbc = raw.fbc;
  }

  // Server-side context — NOT hashed (added later in enrichment)
  if (raw.client_ip_address) {
    result.client_ip_address = raw.client_ip_address;
  }
  if (raw.client_user_agent) {
    result.client_user_agent = raw.client_user_agent;
  }

  return result;
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
  config: FacebookCAPIConfig,
  events: CAPIEvent[],
  requestId: string
): Promise<PixelResult> {
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
      console.error(
        `[${requestId}] CAPI FAILED: Pixel ${config.pixelId} — status ${response.status} — ${durationMs}ms`,
        JSON.stringify(errorData)
      );
      return {
        pixelId: config.pixelId,
        success: false,
        error: `HTTP ${response.status}: ${JSON.stringify(errorData)}`,
        durationMs,
      };
    }

    const result = await response.json().catch(() => ({}));
    console.info(
      `[${requestId}] CAPI SUCCESS: Pixel ${config.pixelId} — events_received: ${result.events_received} — ${durationMs}ms`
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
    console.error(
      `[${requestId}] CAPI FAILED: Pixel ${config.pixelId} — network error — ${durationMs}ms — ${message}`
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
  const requestId = `capi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    // Step 1: Parse batch payload
    const body = (await request.json()) as IngestPayload;
    const eventCount = body.events?.length ?? 0;
    const eventNames = Array.from(
      new Set((body.events ?? []).map((e) => e.event_name))
    ).join(", ");

    console.info(
      `[${requestId}] Step 1: Received ${eventCount} events [${eventNames}]`
    );

    if (!body.events || eventCount === 0) {
      console.warn(`[${requestId}] Step 1 FAILED: No events in payload`);
      return Response.json({ error: "No events in payload" }, { status: 400 });
    }

    // Step 2: Validate multi-pixel config
    const { pixels, error: configError } = getMultiPixelCAPIConfig();
    if (pixels.length === 0) {
      console.error(`[${requestId}] Step 2 FAILED: ${configError}`);
      return Response.json(
        { error: "CAPI configuration error", details: configError },
        { status: 500 }
      );
    }
    console.info(`[${requestId}] Step 2: ${pixels.length} pixel(s) configured`);

    // Step 3: Hash PII + enrich with server-side context (IP, User-Agent)
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get("user-agent") ?? undefined;

    const enrichedEvents = body.events.map((event) => ({
      ...event,
      user_data: {
        ...hashUserData(event.user_data),
        client_ip_address: clientIP,
        client_user_agent: userAgent,
      },
    }));

    console.info(
      `[${requestId}] Step 3: Hashed PII + enriched with IP=${clientIP ?? "unknown"}, UA added`
    );

    // Step 4: Dispatch to all pixels in parallel
    const results = await Promise.allSettled(
      pixels.map((pixelConfig) =>
        sendToPixel(pixelConfig, enrichedEvents, requestId)
      )
    );

    // Step 5: Aggregate results
    const pixelResults: PixelResult[] = results.map((result, i) => {
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

    if (successCount === 0) {
      console.error(
        `[${requestId}] Step 5 FAILED: All ${pixels.length} pixel(s) failed`
      );
      return Response.json(
        {
          error: "All CAPI dispatches failed",
          pixelResults,
        },
        { status: 500 }
      );
    }

    console.info(
      `[${requestId}] Step 5 DONE: ${successCount}/${pixels.length} pixel(s) succeeded${failCount > 0 ? `, ${failCount} failed` : ""}`
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
    console.error(`[${requestId}] CRITICAL ERROR: ${message}`);
    return Response.json(
      { error: "Failed to process events", requestId },
      { status: 500 }
    );
  }
}
