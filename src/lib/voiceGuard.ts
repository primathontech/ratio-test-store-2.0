/**
 * Shared first-party + abuse guard for the voice endpoints.
 *
 * The token route was the only guarded endpoint; the read BFF routes
 * (voice-product, voice-reviews, …) were open GETs anyone could scrape or use to
 * drive load. This centralizes the origin allow-list + per-IP rate limit so every
 * voice route enforces the same policy, with a per-route budget (mints are rarer
 * than reads) via the `scope` + `max` args.
 *
 * NOTE: in-memory / per-instance — correct for a single pod / pilot. For multi-pod
 * production, back the counter with Redis/KV so the limit is global.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 min
// One bucket per `${scope}:${ip}` so a shopper's reads don't eat their mint budget.
const hits = new Map<string, { count: number; reset: number }>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (
    fwd?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// First-party gate: allow same-origin (and any hosts in VOICE_ALLOWED_ORIGINS).
// A missing Origin/Referer isn't blocked — we can't attribute it and legit
// first-party fetches always send one; the rate limit is the backstop for those.
function isAllowedOrigin(req: Request): boolean {
  const src = req.headers.get("origin") || req.headers.get("referer") || "";
  if (!src) return true;
  try {
    const host = new URL(src).host;
    const selfHost =
      req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    if (selfHost && host === selfHost) return true;
    const allowed = (process.env.VOICE_ALLOWED_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return allowed.some((a) => {
      try {
        return new URL(a).host === host;
      } catch {
        return a === host;
      }
    });
  } catch {
    return true;
  }
}

// GLOBAL circuit-breaker counters — one bucket PER SCOPE, counting across ALL IPs.
// The per-IP limiter above can't catch an attacker who rotates IPs; this coarse cap
// bounds the TOTAL number of (paid) sessions a single instance will mint per window,
// no matter how many IPs are used. Same in-memory caveat as the per-IP limiter: it is
// per-process, so on serverless/multi-pod it is per-instance (use a shared store for a
// true global cap). Merchant-agnostic — the cap is an env number, nothing hardcoded.
const globalHits = new Map<string, { count: number; reset: number }>();

function isGloballyLimited(scope: string, max: number): boolean {
  if (!max || max <= 0) return false; // disabled → no global cap (opt-in per deploy)
  const now = Date.now();
  const e = globalHits.get(scope);
  if (!e || now > e.reset) {
    globalHits.set(scope, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  e.count++;
  return e.count > max;
}

function isRateLimited(key: string, max: number): boolean {
  const now = Date.now();
  const e = hits.get(key);
  if (!e || now > e.reset) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    // opportunistic cleanup so the map can't grow unbounded
    if (hits.size > 5000)
      hits.forEach((v, k) => {
        if (now > v.reset) hits.delete(k);
      });
    return false;
  }
  e.count++;
  return e.count > max;
}

/**
 * Returns a 403/429 Response if the request should be rejected, or null if it may
 * proceed. `scope` isolates the rate-limit budget per route class; `max` is the
 * per-IP request cap within the window.
 */
export function voiceGuard(
  req: Request,
  scope: string,
  max: number
): Response | null {
  if (!isAllowedOrigin(req))
    return Response.json({ error: "Forbidden origin" }, { status: 403 });
  if (isRateLimited(`${scope}:${clientIp(req)}`, max))
    return Response.json(
      {
        error: "Too many voice requests from this network. Try again shortly.",
      },
      { status: 429 }
    );
  return null;
}

/**
 * GLOBAL CIRCUIT BREAKER. Bounds the TOTAL mints for a scope across ALL callers in the
 * window — the backstop the per-IP `voiceGuard` can't provide against IP rotation. Put
 * it on the paid endpoints (token mint). Returns a 429 Response when tripped, else null.
 * `max` is a caller-supplied fixed cap (0 disables) — merchant-agnostic, sized to sit
 * far above real per-instance voice load. NOTE: this is a per-instance speed bump — the
 * GUARANTEED cost ceiling is the provider account spend cap (set that too).
 */
export function voiceCircuitBreaker(
  scope: string,
  max: number
): Response | null {
  if (isGloballyLimited(scope, max))
    return Response.json(
      {
        error:
          "The assistant is busy right now. Please try again in a few minutes.",
      },
      { status: 429 }
    );
  return null;
}

/**
 * KILL SWITCH. A server-side flag that instantly stops NEW voice sessions from
 * being minted — no client redeploy needed. Flip `VOICE_KILL_SWITCH=true` (or the
 * existing `NEXT_PUBLIC_VOICE_ENABLED=false`, which also hides the widget) to shut
 * voice off mid-incident. Checked in the token route, so it stops even direct API
 * hits, not just the UI.
 */
export function voiceDisabled(): boolean {
  return (
    process.env.VOICE_KILL_SWITCH === "true" ||
    process.env.NEXT_PUBLIC_VOICE_ENABLED === "false"
  );
}

/**
 * ACCESS GATE for a SHARED/PUBLIC demo URL. When `VOICE_ACCESS_CODE` is set, the
 * caller must present the SAME code (header `x-voice-access-code`, or `?vc=` on the
 * shared link, which the widget forwards) before a paid voice session is minted.
 * This is the primary anti-misuse control when the URL is shared with an external
 * team: only people given the code can start a session, and — because it is checked
 * SERVER-SIDE in the mint route — scripting `/api/voice-token` directly can't bypass
 * it. The code is never embedded in the JS bundle. When the env is UNSET the gate is
 * OFF (production default), so a normal merchant deployment is unaffected.
 */
export function accessCodeGate(req: Request): Response | null {
  const expected = (process.env.VOICE_ACCESS_CODE || "").trim();
  if (!expected) return null; // gate disabled — normal deployment
  let provided = (req.headers.get("x-voice-access-code") || "").trim();
  if (!provided) {
    try {
      provided = (new URL(req.url).searchParams.get("vc") || "").trim();
    } catch {
      /* unparseable URL → treated as no code */
    }
  }
  if (provided && provided === expected) return null;
  return Response.json(
    { error: "A voice access code is required to use the assistant here." },
    { status: 401 }
  );
}

/**
 * Read + JSON-parse a POST body with a HARD size cap. The voice/BFF POST routes all
 * take small JSON payloads, so an oversized body is only ever abuse — capping it
 * blunts a memory/parse DoS. Checks the declared Content-Length first (cheap reject),
 * then measures the actual body so a missing/lying header can't slip past. Returns the
 * parsed data, or a ready-to-return 413/400 Response. Never throws.
 */
export async function readJsonBody<T = unknown>(
  req: Request,
  maxBytes = 16 * 1024
): Promise<{ ok: true; data: T } | { ok: false; response: Response }> {
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared && declared > maxBytes)
    return {
      ok: false,
      response: Response.json({ error: "Payload too large" }, { status: 413 }),
    };
  let text: string;
  try {
    text = await req.text();
  } catch {
    return {
      ok: false,
      response: Response.json(
        { error: "Invalid request body" },
        { status: 400 }
      ),
    };
  }
  if (text.length > maxBytes)
    return {
      ok: false,
      response: Response.json({ error: "Payload too large" }, { status: 413 }),
    };
  try {
    const parsed = text ? JSON.parse(text) : {};
    // Coerce a non-object body (JSON `null`, a bare number/string/bool) to {} so callers
    // that destructure fields get a clean validation path, not a TypeError → 500.
    const data =
      parsed && typeof parsed === "object" ? parsed : ({} as unknown);
    return { ok: true, data: data as T };
  } catch {
    return {
      ok: false,
      response: Response.json({ error: "Invalid JSON" }, { status: 400 }),
    };
  }
}
