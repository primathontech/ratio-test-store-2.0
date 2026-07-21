/**
 * The single, admin-ready config seam for the voice widget.
 *
 * EVERYTHING that can vary per merchant OR needs tuning flows through here. Today
 * it merges DEFAULTS + env overrides; when the Admin Panel ships, ONLY this
 * function changes — it will read the merchant's config from the admin API and
 * the rest of the code stays exactly the same. This mirrors the platform's
 * existing admin-config facade pattern (getSEOConfig / getPageMetadata).
 *
 * (Persona/name/brand/domain/languages have their own facade — getMerchantPersona
 * in src/lib/voicePersona.ts — because they're generated server-side from the
 * catalog and baked into the ephemeral token, not sent from the client. This file
 * owns the CLIENT-side config: provider, limits, audio/barge-in tuning, session
 * timing, and appearance — so no behavior-tuning constant is hardcoded in the
 * hooks/component.)
 */

// Realtime voice backend. OpenAI today; add a model = a new provider adapter +
// registry entry (see providers/index.ts) and widen this union.
export type VoiceProviderName = "openai";
export type WidgetPosition = "bottom-right" | "bottom-left";

export interface VoiceLimits {
  /** Hard ceiling on a session's wall-clock lifetime (backstop cost guard). */
  maxSessionMs: number;
  /** Auto-close after this long with NO user speech — the real forgotten-mic guard.
   *  Resets on every user utterance / agent reply, so it never cuts off an active chat. */
  idleTimeoutMs: number;
  /** Auto-close after this many model turns (runaway/loop guard). */
  maxTurns: number;
  /** Cap any voice-set cart quantity (per line). */
  maxQty: number;
  /** How many results to hold as the working set for filter/sort/compare. */
  workingSetSize: number;
  /** Hard per-session ceiling on EXECUTED tool calls (loop/bulk circuit breaker). */
  maxToolCalls: number;
  /** Sliding-window rate: max executed tool calls within toolRateWindowMs. */
  toolRateMax: number;
  toolRateWindowMs: number;
  /** Whole-cart aggregate caps for voice-driven adds (bulk guard). */
  maxCartUnits: number;
  maxCartLines: number;
  /** Quantity at/above which add/update requires spoken confirmation. */
  largeQty: number;
  /** How long an armed high-impact confirmation stays valid (ms). */
  confirmTtlMs: number;
}

export interface VoiceSessionTiming {
  /** Reuse a minted token for this long before re-minting (server TTL is longer). */
  tokenFreshMs: number;
  /** Auto-reconnect attempts after an UNEXPECTED session close (0 = disabled). */
  maxReconnects: number;
  /** Base backoff (ms) between reconnect attempts; doubles each attempt. */
  reconnectBaseMs: number;
  /** Per-tool-call timeout (ms) so a hung handler can't freeze the agent. */
  toolTimeoutMs: number;
}

export interface VoiceAppearance {
  position: WidgetPosition;
  idleColor: string;
  liveColor: string;
  size: number;
}

/**
 * Turn-taking / multi-speaker config. `mode` + `coalesce` are derived from
 * NEXT_PUBLIC vars so the CLIENT (this file) and the SERVER (openaiServer.ts, which
 * imports this) agree on ONE source of truth — critical because they must not both
 * try to trigger a response. See useVoiceSession's coalescing state machine and
 * openaiServer.buildTurnDetection.
 */
export interface VoiceTurnConfig {
  /** VAD/endpointing mode baked into the token. */
  mode: "server_vad" | "semantic_vad";
  /** CLIENT-managed turn coalescing: the server does NOT auto-respond
   *  (create_response:false); the client waits for a stable silence after the LAST
   *  speaker, then triggers ONE response to the settled, final request. Only valid
   *  with server_vad (semantic_vad manages turns itself). */
  coalesce: boolean;
  /** Quiet window (ms) after the last speaker stops before the agent responds. The
   *  window RESETS on every new speech start, so rapid multi-speaker interruptions
   *  are absorbed into one turn. */
  stabilizeMs: number;
  /** Watchdog (ms): if the server never reports a speech-stop (e.g. continuous
   *  noise), force a response after this long so the agent can NEVER go silent. */
  maxUtteranceMs: number;
}

/** The merchant's money settings. `code` is the ISO currency (e.g. "INR", "USD")
 *  and `symbol` the display glyph (e.g. "₹", "$"). Config-driven so a non-INR
 *  merchant is one env change — never inferred by the model (which defaults to $
 *  and caused the "USD on an INR store" bug). */
export interface VoiceCurrency {
  code: string;
  symbol: string;
}

/** Proactive OPENING GREETING: the agent speaks first on a FRESH session so the
 *  shopper immediately knows it's connected and listening (like ChatGPT Voice /
 *  Gemini Live). `instruction` is a ONE-SHOT response directive the model renders
 *  in the merchant's already-baked persona/tone — it is NOT a hardcoded line, so it
 *  stays merchant-agnostic and multilingual-ready. Fires exactly once per new
 *  session (never on reconnect, resume, or rapid re-open). */
export interface VoiceGreeting {
  enabled: boolean;
  /** Language the OPENING greeting line is spoken in. Config-driven (default
   *  "English"). This is ONLY the cold-open said BEFORE the shopper speaks — it
   *  does NOT lock the conversation language: the persona matches the shopper's
   *  own language from their first reply on (see agentConfig's Language section).
   *  India-first deployments set NEXT_PUBLIC_VOICE_GREETING_LANGUAGE to e.g.
   *  "Hindi or natural Hinglish". */
  language: string;
  instruction: string;
}

export interface VoiceConfig {
  enabled: boolean;
  provider: VoiceProviderName;
  /** Opening greeting behaviour (proactive first turn). */
  greeting: VoiceGreeting;
  limits: VoiceLimits;
  session: VoiceSessionTiming;
  appearance: VoiceAppearance;
  turn: VoiceTurnConfig;
  /** The store's currency — sourced here, threaded into the persona rule AND every
   *  price-bearing tool payload, so the agent always states amounts in it. */
  currency: VoiceCurrency;
  /** Route the search-results page lives at for THIS merchant. Storefronts differ
   *  (Shopify default `/search`, but some use `/pages/searchtap-search`, etc.), so
   *  the agent must navigate to the real one — a wrong path = a broken results page
   *  that can tear down the session. Merchant-configurable; default Shopify `/search`. */
  searchPath: string;
}

const num = (v: string | undefined, d: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : d;
};

export function getVoiceConfig(): VoiceConfig {
  // The opening-greeting language (cold-open spoken BEFORE the shopper speaks).
  // Defaults to the store's PRIMARY language (NEXT_PUBLIC_VOICE_LANGUAGE), which ALSO
  // drives the persona's default reply language (agentConfig reads the same env) — so
  // ONE knob keeps the cold-open and the conversation coherent. Can be overridden alone
  // via NEXT_PUBLIC_VOICE_GREETING_LANGUAGE. Falls back to "Hindi or Hinglish" — the
  // platform's all-India default (a platform constant, mirroring agentConfig's default
  // reply language and the INR currency default); a non-Hindi store overrides it.
  const greetingLanguage =
    process.env.NEXT_PUBLIC_VOICE_GREETING_LANGUAGE?.trim() ||
    process.env.NEXT_PUBLIC_VOICE_LANGUAGE?.trim() ||
    "Hindi or Hinglish";
  // Store IDENTITY for the greeting — merchant-agnostic, config-driven (NOTHING merchant-
  // specific is hardcoded here). Name reuses the platform's existing merchant env; the
  // specialty is a short phrase for what the store is known for (e.g. "skincare",
  // "sportswear") and is OPTIONAL — if a merchant doesn't set it, the greeting drops to a
  // store-name-only welcome. A merchant's actual specialty lives in ITS env, never here.
  const storeName =
    process.env.NEXT_PUBLIC_VOICE_STORE_NAME?.trim() ||
    process.env.NEXT_PUBLIC_MERCHANT_NAME ||
    process.env.NEXT_PUBLIC_SITE_NAME ||
    "our store";
  const storeSpecialty = process.env.NEXT_PUBLIC_VOICE_STORE_SPECIALTY?.trim();
  return {
    enabled: process.env.NEXT_PUBLIC_VOICE_ENABLED !== "false",
    searchPath: process.env.NEXT_PUBLIC_VOICE_SEARCH_PATH || "/search",
    // Proactive greeting — ON by default. Set NEXT_PUBLIC_VOICE_GREETING_ENABLED=false
    // to keep the old "silent until the shopper speaks" behaviour.
    // NEXT_PUBLIC_VOICE_GREETING overrides the whole directive (keep it ONE sentence);
    // NEXT_PUBLIC_VOICE_GREETING_LANGUAGE sets just the LANGUAGE of the opening line
    // (default English). The opening line's language does NOT lock the conversation —
    // the persona mirrors the shopper from their first reply (see agentConfig Language),
    // so this stays merchant-agnostic and multilingual. Defaults are generic for ANY store.
    greeting: {
      enabled: process.env.NEXT_PUBLIC_VOICE_GREETING_ENABLED !== "false",
      language: greetingLanguage,
      instruction:
        process.env.NEXT_PUBLIC_VOICE_GREETING?.trim() ||
        `The voice session just connected and the shopper hasn't spoken yet. Greet them now warmly and naturally in ${greetingLanguage}: ONE short, welcoming sentence — welcome them to ${storeName}${storeSpecialty ? `, known for ${storeSpecialty}` : ""}, and invite them to shop (for example, ask what they're looking for today). Exactly one sentence — no lists, no reciting what you can do, no product names. Do NOT use any tools, navigate, open pages, or take any action — only speak this one sentence.`,
    },
    // Currency: env-driven, default INR/₹. Same env vars the persona reads
    // (agentConfig), so the spoken currency and the payload currency always agree.
    currency: {
      code: process.env.NEXT_PUBLIC_VOICE_CURRENCY || "INR",
      symbol: process.env.NEXT_PUBLIC_VOICE_CURRENCY_SYMBOL || "₹",
    },
    provider:
      (process.env.NEXT_PUBLIC_VOICE_PROVIDER as VoiceProviderName) || "openai",
    limits: {
      maxSessionMs: num(
        process.env.NEXT_PUBLIC_VOICE_MAX_SESSION_MS,
        20 * 60 * 1000 // hard ceiling; the idle timeout below is the primary guard
      ),
      idleTimeoutMs: num(
        process.env.NEXT_PUBLIC_VOICE_IDLE_TIMEOUT_MS,
        90 * 1000
      ),
      maxTurns: num(process.env.NEXT_PUBLIC_VOICE_MAX_TURNS, 60),
      maxQty: num(process.env.NEXT_PUBLIC_VOICE_MAX_QTY, 99),
      workingSetSize: num(process.env.NEXT_PUBLIC_VOICE_WORKING_SET, 24),
      // Abuse guards — sized so a rich REAL session never trips them; they exist to
      // stop loops/bulk ("keep adding forever", "add every product"), not to limit
      // genuine shopping. All env-tunable (admin API later).
      maxToolCalls: num(process.env.NEXT_PUBLIC_VOICE_MAX_TOOL_CALLS, 60),
      toolRateMax: num(process.env.NEXT_PUBLIC_VOICE_TOOL_RATE_MAX, 12),
      toolRateWindowMs: num(
        process.env.NEXT_PUBLIC_VOICE_TOOL_RATE_WINDOW_MS,
        8000
      ),
      maxCartUnits: num(process.env.NEXT_PUBLIC_VOICE_MAX_CART_UNITS, 100),
      maxCartLines: num(process.env.NEXT_PUBLIC_VOICE_MAX_CART_LINES, 40),
      largeQty: num(process.env.NEXT_PUBLIC_VOICE_LARGE_QTY, 10),
      confirmTtlMs: num(process.env.NEXT_PUBLIC_VOICE_CONFIRM_TTL_MS, 60000),
    },
    session: {
      tokenFreshMs: num(
        process.env.NEXT_PUBLIC_VOICE_TOKEN_FRESH_MS,
        25 * 60 * 1000
      ),
      maxReconnects: num(process.env.NEXT_PUBLIC_VOICE_MAX_RECONNECTS, 3),
      reconnectBaseMs: num(
        process.env.NEXT_PUBLIC_VOICE_RECONNECT_BASE_MS,
        800
      ),
      toolTimeoutMs: num(process.env.NEXT_PUBLIC_VOICE_TOOL_TIMEOUT_MS, 12000),
    },
    appearance: {
      position:
        (process.env.NEXT_PUBLIC_VOICE_POSITION as WidgetPosition) ||
        "bottom-right",
      idleColor: process.env.NEXT_PUBLIC_VOICE_IDLE_COLOR || "#1d1d1d",
      liveColor: process.env.NEXT_PUBLIC_VOICE_LIVE_COLOR || "#e53935",
      size: num(process.env.NEXT_PUBLIC_VOICE_SIZE, 60),
    },
    turn: getTurnConfig(),
  };
}

/** Turn-taking config, shared by client + server (single source of truth). */
export function getTurnConfig(): VoiceTurnConfig {
  // PRODUCTION default = semantic_vad (validated): model-based endpointing, best
  // for a conversational shopping assistant. Baked in so no env is needed; the
  // only override is the explicit escape hatch back to server_vad if ever required.
  const mode: VoiceTurnConfig["mode"] =
    process.env.NEXT_PUBLIC_VOICE_TURN_MODE === "server_vad"
      ? "server_vad"
      : "semantic_vad";
  // Turn-taking is SERVER-AUTHORITATIVE by default: the server owns the response
  // lifecycle (create + cancel), so it must own response CREATION too. Client-managed
  // coalescing is an explicit opt-in escape hatch only — it re-implements the server's
  // response state machine across the network and races its async cancellation
  // (conversation_already_has_active_response). Production endpointing/coalescing
  // should come from semantic_vad (server-side), not client timers.
  const coalesce =
    mode === "server_vad" &&
    process.env.NEXT_PUBLIC_VOICE_COALESCE_TURNS === "true";
  return {
    mode,
    coalesce,
    // PRODUCTION default 350ms: production is ~99% single-shopper, so this favors
    // low latency (server silence ~300ms + this ≈ 700ms total end-of-turn wait, the
    // natural conversational range) while still absorbing a shopper's own
    // mid-sentence self-correction. For a chaotic multi-speaker DEMO, raise to ~700
    // (NEXT_PUBLIC_VOICE_STABILIZE_MS=700). Tune from real false-endpoint vs latency metrics.
    stabilizeMs: num(process.env.NEXT_PUBLIC_VOICE_STABILIZE_MS, 350),
    maxUtteranceMs: num(process.env.NEXT_PUBLIC_VOICE_MAX_UTTERANCE_MS, 20000),
  };
}
