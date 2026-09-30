/**
 * Voice query normalization — server-side safety net for multilingual search.
 *
 * The catalog search (GoKwik) is ENGLISH-KEYWORD only. The voice model is
 * instructed to translate the shopper's intent to English before calling the
 * search tool, but that is model behavior — not guaranteed. This route is the
 * deterministic backstop: given a non-English (or noisy) query it returns
 * concise English product keywords the catalog can actually match.
 *
 * Design notes (why it looks like this):
 *  - Key stays server-side. The browser widget never sees the text-model key;
 *    it only posts { text } and gets back { query }. (The live audio key is a
 *    separate, demo-only exposure via /api/voice-token.)
 *  - Called ONLY on the slow path. The client skips this entirely for plain
 *    ASCII queries, so the happy path adds zero latency/cost. Here we still
 *    guard input and cache so repeated phrases cost one model call, not N.
 *  - Never fails the caller. Any error returns the original text with 200 so
 *    the search tool degrades to "search what we heard" rather than breaking.
 *
 * Production evolution: swap the in-memory cache for Redis/edge KV, and point
 * the text generator at the shared query-planner service once one exists.
 */

import { getTextGenerator } from "@/ui/voice/providers/text";
import {
  voiceGuard,
  voiceDisabled,
  accessCodeGate,
  readJsonBody,
} from "@/lib/voiceGuard";

// Target language of the catalog/search backend (per-merchant; default English).
const CATALOG_LANG = process.env.VOICE_CATALOG_LANGUAGE ?? "English";

// The TextGenerator port takes a single prompt (no separate system field), so the
// instruction is prepended to the input.
const INSTRUCTION =
  `You convert a shopper's product query into concise ${CATALOG_LANG} product keywords ` +
  `for a catalog search. Translate or transliterate from any language ` +
  `into ${CATALOG_LANG}. Drop filler words like 'best', ` +
  "'show me', 'please', 'chahiye'. Reply with ONLY the keywords — no quotes, " +
  `no punctuation, no explanation. If the input is already in ${CATALOG_LANG}, return it ` +
  "unchanged. Examples: 'लाल जूते' -> red shoes; " +
  "'mere liye ek achhi ghadi chahiye' -> watch; 'face wash' -> face wash.";

const MAX_INPUT_LEN = 200;

// Bounded in-memory cache. Cleared wholesale at the cap — good enough for a
// single-process demo; production would use a shared, TTL'd store.
const CACHE_MAX = 500;
const cache = new Map<string, string>();

export async function POST(req: Request) {
  // This is a paid LLM endpoint → treat it like the token mint: kill switch + access
  // gate (so it can't be hammered on a shared URL by anyone without the code), then a
  // tighter per-IP rate cap than the read routes.
  if (voiceDisabled())
    return Response.json(
      { error: "Voice assistant is currently disabled." },
      { status: 503 }
    );
  const gated = accessCodeGate(req);
  if (gated) return gated;
  const blocked = voiceGuard(req, "normalize", 100);
  if (blocked) return blocked;
  // Small JSON body — cap it (4KB is ample for a short query).
  const parsed = await readJsonBody<{ text?: string }>(req, 4 * 1024);
  if (!parsed.ok) return parsed.response;
  let text =
    typeof parsed.data?.text === "string" ? parsed.data.text.trim() : "";
  if (!text) {
    return Response.json({ error: "text is required" }, { status: 400 });
  }
  if (text.length > MAX_INPUT_LEN) {
    text = text.slice(0, MAX_INPUT_LEN);
  }

  const cacheKey = text.toLowerCase();
  const hit = cache.get(cacheKey);
  if (hit !== undefined) {
    return Response.json({ query: hit, cached: true });
  }

  try {
    const raw = await getTextGenerator().generateText(
      `${INSTRUCTION}\n\nQuery: ${text}`,
      { temperature: 0, maxTokens: 32 }
    );

    // Strip stray wrapping quotes/whitespace; fall back to the raw text if the
    // model returned nothing usable.
    const cleaned = (raw ?? "")
      .trim()
      .replace(/^["'`]+|["'`]+$/g, "")
      .trim();
    const query = cleaned || text;

    if (cache.size >= CACHE_MAX) {
      cache.clear();
    }
    cache.set(cacheKey, query);

    return Response.json({ query });
  } catch {
    // Graceful degradation: give the caller the original text so it can still search
    // (better a possibly-empty result than a broken flow). No error message echoed.
    return Response.json({ query: text });
  }
}
