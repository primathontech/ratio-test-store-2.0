/**
 * Inspection endpoint — returns the persona the agent auto-generated from the
 * merchant's own content (name + real collections + product titles). Handy for
 * the demo: hit it to SHOW that no one hand-wrote the assistant's personality.
 * `generated: true` = synthesized from catalog; `false` = static fallback.
 */

import { getMerchantPersona } from "@/lib/voicePersona";
import { voiceGuard, voiceDisabled, accessCodeGate } from "@/lib/voiceGuard";

export async function GET(req: Request) {
  // This exposes the generated persona (agent name / brand framing) — an internal
  // artifact, not shopper-facing. Gate it behind the same kill switch + access code as
  // the mint so it can't be scraped from a shared URL; no-op on ungated deployments.
  if (voiceDisabled())
    return Response.json(
      { error: "Voice assistant is currently disabled." },
      { status: 503 }
    );
  const gated = accessCodeGate(req);
  if (gated) return gated;
  const blocked = voiceGuard(req, "read", 150);
  if (blocked) return blocked;
  const persona = await getMerchantPersona();
  return Response.json(persona);
}
