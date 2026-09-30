/**
 * TEXT GENERATION provider abstraction — the same ports-and-adapters shape as the
 * realtime VoiceProvider, but for plain text synthesis (persona generation today;
 * any future non-realtime LLM use tomorrow). Business logic depends ONLY on the
 * TextGenerator interface + this registry, never on a vendor SDK — so adding a
 * provider is one adapter + one registry entry, with zero changes upstream.
 *
 * All adapters return "" on any failure (missing key, quota, network, timeout) so
 * callers degrade gracefully rather than throw.
 */

export interface TextGenOptions {
  maxTokens?: number;
  temperature?: number;
}

export interface TextGenerator {
  readonly name: string;
  generateText(prompt: string, opts?: TextGenOptions): Promise<string>;
}

// OpenAI adapter (Chat Completions — a cheap text model, NOT the realtime voice
// model). ALL OpenAI coupling for text lives here. Adding another text backend =
// a sibling adapter + a registry entry below; callers never change.
const openaiText: TextGenerator = {
  name: "openai",
  async generateText(prompt, opts) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return "";
    const model = process.env.OPENAI_PERSONA_MODEL || "gpt-4o-mini";
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: opts?.temperature ?? 0.4,
          max_tokens: opts?.maxTokens ?? 350,
        }),
      });
      if (!res.ok) {
        console.warn(`[voice][text] openai failed: ${res.status}`);
        return "";
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      return (data?.choices?.[0]?.message?.content ?? "").trim();
    } catch (e) {
      console.warn("[voice][text] openai error:", (e as Error)?.message);
      return "";
    }
  },
};

const TEXT_GENERATORS: Record<string, TextGenerator> = {
  openai: openaiText,
};

/**
 * Resolve the text generator. OpenAI today; the optional VOICE_PERSONA_PROVIDER
 * override selects another once more adapters are registered above. Callers
 * never change.
 */
export function getTextGenerator(name?: string): TextGenerator {
  const key =
    name ||
    process.env.VOICE_PERSONA_PROVIDER ||
    process.env.VOICE_PROVIDER ||
    process.env.NEXT_PUBLIC_VOICE_PROVIDER ||
    "openai";
  return TEXT_GENERATORS[key] ?? TEXT_GENERATORS.openai;
}
