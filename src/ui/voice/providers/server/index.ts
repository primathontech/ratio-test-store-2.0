import type { ServerVoiceProvider } from "./types";
import { openaiServerProvider } from "./openaiServer";

// Server-side mint registry (mirrors the client provider registry). Adding a
// model/backend = one adapter + one entry here. OpenAI is the only provider
// today; unknown/absent names fall back to it.
const SERVER_PROVIDERS: Record<string, ServerVoiceProvider> = {
  openai: openaiServerProvider,
};

export function getServerVoiceProvider(name?: string): ServerVoiceProvider {
  return (name && SERVER_PROVIDERS[name]) || openaiServerProvider;
}

export type { ServerVoiceProvider } from "./types";
