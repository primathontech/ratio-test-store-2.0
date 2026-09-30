import { buildPersona, type AgentPersona } from "../../agentConfig";
import { TOOL_SCHEMAS, TOOL_NAMES, type ToolName } from "../../tools/registry";
import { getTurnConfig } from "../../voiceConfig";
import type { ServerVoiceProvider } from "./types";

/**
 * OpenAI Realtime (WebRTC) server provider. ALL OpenAI-specific server coupling
 * lives here: the ephemeral client-secret mint (`POST /v1/realtime/client_secrets`,
 * GA endpoint — NOT the deprecated `/v1/realtime/sessions` beta path) AND the
 * OpenAI-shaped session config (instructions / tools / turn_detection) baked into
 * that mint request. This is also the ADAPTER that turns the neutral tool
 * registry (tools/registry.ts) into OpenAI's flat function-tool array — so the
 * tool layer itself stays provider-agnostic.
 *
 * Reference: VOICE.md ("OpenAI Realtime — technical reference") for the mint
 * endpoint/shape and the baked session config.
 */

// GA top-tier model as of 2026-07-06 (best interruption/barge-in fidelity).
// Overridable so an operator can pin a snapshot or swap to the -mini variant
// without a code change.
const MODEL = process.env.OPENAI_REALTIME_MODEL ?? "gpt-realtime-2.1";
// Ephemeral client-secret TTL. Short-lived by design — minted fresh per session,
// right before the browser starts its WebRTC handshake (see openaiRealtimeProvider.ts).
const TOKEN_TTL_SECONDS = 600; // 10 min
// PER-RESPONSE COST CAP. Bounds the tokens any single model reply can emit — a voice
// answer is short, so this only stops a pathological runaway response from being
// unbounded. Baked into the token (enforced by OpenAI), so it holds regardless of
// client state / infra. Generous fixed value so it never truncates a real reply.
const MAX_OUTPUT_TOKENS = 4096;

// server_vad tuning for the SPEAKERS (no-headphones) case. `threshold` is the key
// knob: the agent's own voice — already attenuated by the mic's echoCancellation —
// stays BELOW it, so it can't self-trigger a barge-in, while the user's direct,
// close-mic voice clears it. Raise threshold if the agent still self-interrupts on
// speakers; lower it if real barge-in feels unresponsive. All env-tunable live.
const VAD_THRESHOLD = Number(process.env.OPENAI_VAD_THRESHOLD) || 0.6;
const VAD_PREFIX_MS = Number(process.env.OPENAI_VAD_PREFIX_MS) || 300;
// semantic_vad eagerness (only used in semantic_vad mode). Caps the max wait
// before the model decides the user is done: low ~8s, medium/auto ~4s, high ~2s.
// PRODUCTION default = "medium": balanced for a shopping assistant — snappy on
// short commands ("add it", "checkout") so they aren't missed, yet still patient
// enough for a thinking pause. ("low" was too patient → commands needed repeating.)
const VAD_EAGERNESS = (
  process.env.OPENAI_VAD_EAGERNESS || "medium"
).toLowerCase();

// OUTPUT VOICE — OpenAI recommends "marin" and "cedar" (newest, most natural). Env-
// overridable and ALLOW-LISTED, so a typo'd value can't 400 the mint (it falls back to
// marin). Merchant-agnostic: a generic default any store can override by env — no
// merchant-specific value is baked in here.
const OPENAI_VOICES = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "sage",
  "shimmer",
  "verse",
  "marin",
  "cedar",
];
const VOICE = (() => {
  const v = process.env.OPENAI_REALTIME_VOICE?.trim().toLowerCase();
  return v && OPENAI_VOICES.includes(v) ? v : "marin";
})();
// SPEAKING SPEED (0.25–1.5, default 1.0). Env-tunable by ear; clamped so a bad value
// can't distort audio. Pacing is ALSO shaped in the persona (## Pacing) per OpenAI's guide.
const VOICE_SPEED = (() => {
  const n = Number(process.env.OPENAI_REALTIME_SPEED);
  return Number.isFinite(n) && n >= 0.25 && n <= 1.5 ? n : 1.0;
})();

/** Build the turn_detection block. Barge-in stays SERVER-AUTHORITATIVE in every
 *  mode (interrupt_response). WHO triggers the response differs:
 *   - semantic_vad (DEFAULT): the model decides turn-ends server-side and the server
 *     auto-creates the response (create_response:true); no client coalescing.
 *   - server_vad + coalesce OFF: the server auto-responds; a LONGER silence window
 *     does the multi-speaker coalescing itself (Option A).
 *   - server_vad + coalesce ON (opt-in): the server does NOT auto-respond
 *     (create_response:false); the CLIENT waits for a stable silence after the last
 *     speaker and triggers ONE response (useVoiceSession). The server reports stops
 *     promptly (shorter silence) so the client's stabilize window is the real wait.
 *  mode + coalesce come from the SHARED getTurnConfig() so client & server agree. */
function buildTurnDetection(): Record<string, unknown> {
  const { mode, coalesce } = getTurnConfig();
  if (mode === "semantic_vad") {
    return {
      type: "semantic_vad",
      eagerness: VAD_EAGERNESS,
      create_response: true,
      interrupt_response: true,
    };
  }
  // When coalescing, the server only needs to report the stop promptly (the client
  // stabilize window is the real end-of-turn wait), so keep this short: ~300ms +
  // stabilizeMs(350) ≈ 700ms total (production-snappy). Without coalescing the
  // server's own window does the waiting, so it's longer (800ms).
  const silenceMs =
    Number(process.env.OPENAI_VAD_SILENCE_MS) || (coalesce ? 300 : 800);
  return {
    type: "server_vad",
    threshold: VAD_THRESHOLD,
    prefix_padding_ms: VAD_PREFIX_MS,
    silence_duration_ms: silenceMs,
    create_response: !coalesce, // client owns response timing when coalescing
    interrupt_response: true,
  };
}

/** Adapt the neutral tool registry into OpenAI's `tools` shape: a FLAT array of
 *  `{ type: "function", name, description, parameters }` (same JSON-Schema
 *  `parameters` shape as our neutral registry already uses — no translation
 *  needed there), applying the per-merchant enablement filter (undefined/empty
 *  = all tools). */
function toOpenAiTools(enabled?: string[]) {
  const names: ToolName[] =
    enabled && enabled.length
      ? TOOL_NAMES.filter((n) => enabled.includes(n))
      : TOOL_NAMES;
  return names.map((name) => ({
    type: "function" as const,
    name,
    description: TOOL_SCHEMAS[name].description,
    parameters: TOOL_SCHEMAS[name].parameters,
  }));
}

/** Provider-specific session config, baked into the client-secret mint request
 *  (the GA "constrained at mint time" pattern — everything session.update would
 *  otherwise set can be pre-seeded here). Persona + per-merchant enabled tools +
 *  turn_detection (see buildTurnDetection: semantic_vad by default; server_vad is the
 *  env opt-in, whose threshold is the echo-defense knob). */
function buildSessionConfig(persona: AgentPersona): Record<string, unknown> {
  return {
    type: "realtime",
    model: MODEL,
    instructions: buildPersona(persona),
    audio: {
      input: {
        // Turn detection (server-authoritative barge-in + endpoint-window
        // coalescing for multi-speaker robustness) — see buildTurnDetection.
        turn_detection: buildTurnDetection(),
        // Input transcription with NO fixed `language` → auto-detect. This gives the
        // model a stronger signal of WHICH language the shopper is speaking (helping it
        // reply in-language from turn one) and surfaces the user's transcript for the
        // UI. Pinning a `language` here would defeat auto-detection, so we never set it.
        transcription: { model: "whisper-1" },
      },
      output: {
        // Voice + speaking speed (see VOICE / VOICE_SPEED). The output FORMAT is left
        // to WebRTC's SDP negotiation (Opus) — we deliberately don't pin it here.
        voice: VOICE,
        speed: VOICE_SPEED,
      },
    },
    tools: toOpenAiTools(persona.enabledTools),
    tool_choice: "auto",
    // GA session field is `max_output_tokens` (the beta `/realtime/sessions` endpoint
    // used `max_response_output_tokens`; this GA `/realtime/client_secrets` shape does
    // NOT — using the wrong name would 400 the mint or be silently ignored). Valid
    // range is 1–4096 or "inf"; 4096 is the max finite cap.
    max_output_tokens: MAX_OUTPUT_TOKENS,
  };
}

export const openaiServerProvider: ServerVoiceProvider = {
  name: "openai",
  async mintToken(persona) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not set");

    // GA ephemeral-credential mint. Auth is the REAL server-side API key here —
    // this call never happens in the browser. The response's `value` field (an
    // `ek_...` string) is the ONLY thing handed to the client.
    const res = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expires_after: { anchor: "created_at", seconds: TOKEN_TTL_SECONDS },
          session: buildSessionConfig(persona),
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(
        `OpenAI client_secrets mint failed: ${res.status} ${detail}`
      );
    }

    const data = (await res.json()) as { value?: string };
    if (!data.value)
      throw new Error("OpenAI client_secrets mint returned no value");
    // Report the real expiry so the client re-mints before it lapses (the token
    // is only needed to ESTABLISH the WebRTC call; an active session outlives it).
    return {
      token: data.value,
      model: MODEL,
      expiresAt: Date.now() + TOKEN_TTL_SECONDS * 1000,
    };
  },
};
