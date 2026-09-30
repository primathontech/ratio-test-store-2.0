/**
 * Provider registry — resolves a provider name (from config) to its
 * implementation. Adding a provider (a new model/backend) = add one entry here +
 * its impl file; no caller changes. OpenAI Realtime is the only provider today;
 * unknown names fall back to it.
 */

import type { VoiceProvider } from "./types";
import { openaiRealtimeProvider } from "./openaiRealtimeProvider";

const PROVIDERS: Record<string, VoiceProvider> = {
  openai: openaiRealtimeProvider,
};

export function getVoiceProvider(name: string): VoiceProvider {
  return PROVIDERS[name] ?? openaiRealtimeProvider;
}

export type {
  VoiceProvider,
  VoiceSession,
  VoiceSessionCallbacks,
} from "./types";
