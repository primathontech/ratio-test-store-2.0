/**
 * Ephemeral-token endpoint for the voice assistant.
 *
 * The browser needs credentials to open the realtime voice session, but it must
 * NEVER see the real provider API key (anyone could read it from devtools and
 * drain the account). Instead this route mints a short-lived, model-locked
 * *ephemeral token* server-side and hands only that to the widget.
 *
 * Ephemeral tokens are built for exactly this client-to-server case: even if
 * extracted, a token expires in minutes and can only open the one model it was
 * minted for — so a leak is near-worthless. This is the production-correct auth
 * pattern for a browser-direct realtime session (the real key stays server-side).
 * The provider-specific mint lives behind the server provider seam
 * (providers/server) so this route stays provider-agnostic.
 */

import { getServerVoiceProvider } from "@/ui/voice/providers/server";
import { getMerchantPersona } from "@/lib/voicePersona";
import { captureSentryException } from "@/lib/sentry/utils";
import {
  voiceGuard,
  voiceDisabled,
  accessCodeGate,
  voiceCircuitBreaker,
} from "@/lib/voiceGuard";

// COST CAP: the token endpoint is the only enforceable spend boundary (a prompt
// guardrail is jailbreakable). Cap mints per IP per window so a script can't
// drain the provider account. Shared guard (origin + rate limit) — see voiceGuard.
const RL_MAX = 30; // max token mints per IP per 10-min window
// GLOBAL circuit breaker: max TOTAL mints per window across ALL IPs on this instance —
// the backstop against IP-rotation abuse the per-IP cap can't stop. Always on with a
// generous, merchant-agnostic default: voice-session starts are a small fraction of
// traffic, so 120/10min per instance sits far above real load yet caps catastrophic
// abuse. It's a per-instance speed bump — the GUARANTEED ceiling is the provider
// account spend cap (set that in the OpenAI dashboard).
const GLOBAL_MAX = 120;

export async function GET(req: Request) {
  // KILL SWITCH first: if voice is disabled server-side, mint nothing (stops direct
  // API hits too, not just the widget).
  if (voiceDisabled())
    return Response.json(
      { error: "Voice assistant is currently disabled." },
      { status: 503 }
    );
  // ACCESS GATE: on a shared/public URL, require the demo access code before minting
  // a paid session. No-op when VOICE_ACCESS_CODE is unset (normal deployments).
  const gated = accessCodeGate(req);
  if (gated) return gated;
  const blocked = voiceGuard(req, "token", RL_MAX);
  if (blocked) return blocked;
  // Global backstop AFTER the per-IP check, so a single spamming IP (already blocked
  // above) doesn't consume the shared budget — this only counts mints that got past
  // the per-IP limit, i.e. genuinely distributed load.
  const overloaded = voiceCircuitBreaker("token", GLOBAL_MAX);
  if (overloaded) return overloaded;

  try {
    // Persona is auto-generated from the merchant's own content (name, real
    // collections, product titles) — not hand-written. Cached; falls back to the
    // static config if generation fails. This is what we bake into the token.
    const persona = await getMerchantPersona();
    // Provider seam: mint through the configured server provider. Prefer the
    // server-only VOICE_PROVIDER override; else fall back to the same
    // NEXT_PUBLIC_VOICE_PROVIDER the client's voiceConfig.ts reads, so a single
    // env var keeps client + server in sync; defaults to OpenAI (see
    // getServerVoiceProvider). Adding a model = a sibling server provider +
    // registry entry; this route doesn't change further.
    const providerName =
      process.env.VOICE_PROVIDER || process.env.NEXT_PUBLIC_VOICE_PROVIDER;
    const provider = getServerVoiceProvider(providerName);
    const { token, model, expiresAt } = await provider.mintToken(persona);
    return Response.json({ token, model, provider: provider.name, expiresAt });
  } catch (error: unknown) {
    captureSentryException(error, {
      tags: { flow: "voice", operation: "mintToken" },
    });
    // Generic error only — never echo the upstream/OpenAI mint response to the client
    // (it can carry provider status/detail). The real detail goes to Sentry above.
    return Response.json(
      { error: "Could not start the voice assistant right now." },
      { status: 500 }
    );
  }
}
