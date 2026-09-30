import type { AgentPersona } from "../../agentConfig";

/**
 * Server-side half of the provider abstraction. Owns credential minting and the
 * provider-specific SESSION CONFIG shape (persona + tools + VAD baked in). Keeping
 * this behind an interface means adding a model is a sibling implementation +
 * registry entry, not a rewrite of the token route.
 */
export interface ServerVoiceProvider {
  readonly name: string;
  /** Mint a short-lived client credential with the persona + tools baked in
   *  (provider-specific), returning the client token, the model to connect to,
   *  and (when known) the token's absolute expiry in epoch-ms so the client can
   *  re-mint before it dies rather than reuse a stale credential. */
  mintToken(
    persona: AgentPersona
  ): Promise<{ token: string; model: string; expiresAt?: number }>;
}
