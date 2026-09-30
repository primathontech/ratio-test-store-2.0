/**
 * PERSONA ENGINE — builds the voice agent's persona DYNAMICALLY, at runtime, from
 * the merchant's own storefront, so nobody hand-writes a prompt per store and the
 * SAME code serves any vertical (fashion, baby care, electronics, wellness…). This
 * is the multi-tenant foundation: onboarding a merchant = "point at their catalog."
 *
 * Pipeline (all off the voice hot path, cached once per server):
 *   1. SIGNALS — the store's real collections (its categories) + a sample of
 *      product titles (what it sells) + store name/config. (Production: also crawl
 *      home/about/FAQ/returns for richer brand tone + policy grounding.)
 *   2. SYNTHESIS — a PROVIDER-AGNOSTIC text model (via the TextGenerator port)
 *      infers the store's industry/domain, a fitting tone, and an expert-associate
 *      brand voice. Grounded ONLY in the signals (anti-hallucination enforced).
 *   3. FALLBACK — on any miss (no key, empty catalog, model slow/quota'd, LLM
 *      disabled) we use a deterministic, catalog-grounded persona so voice never
 *      breaks. Both outcomes are cached (long TTL for generated, short for fallback
 *      so it self-heals when the transient cause clears).
 * The resulting MerchantPersona is baked into the session token by the server
 * provider; per-turn context (current page/cart) is injected separately at runtime.
 */

import { getTextGenerator } from "@/ui/voice/providers/text";
import { getCommerceClient } from "@/config";
import { MERCHANT_CONFIG, type PersonaTone } from "@/ui/voice/agentConfig";

export interface MerchantPersona {
  agentName: string;
  storeName: string;
  brandInstructions: string;
  /** Short phrase for what the store specializes in — the disambiguation lens. */
  domain?: string;
  /** Personality tone the engine inferred for this merchant's industry
   *  (baby-care → warm, electronics → professional, boutique → luxury). */
  tone?: PersonaTone;
  languages: string;
  /** Catalog/search language (default "English"); tool queries are formed in it. */
  catalogLanguage?: string;
  /** Real category names, used as grounded search examples in the persona. */
  categories?: string[];
  /** true = auto-derived from the merchant's catalog; false = static fallback. */
  generated: boolean;
}

// Cached per server process (personas change rarely). Call
// clearMerchantPersonaCache() after a catalog change to force a refresh.
// (Production: back this with a shared, TTL'd store keyed by merchant so it
// survives restarts and is consistent across instances.)
//
// BOTH outcomes are cached, with different TTLs. This is the key fix: a
// successful generation is cached long, but a FALLBACK (no key / empty catalog /
// model 503/429) is ALSO cached for a short window — otherwise every single token
// mint would re-run the model-call chain while generation is failing (e.g. under
// quota exhaustion), amplifying cost, latency, and the very errors that caused it.
// The short fallback TTL lets a later request retry generation once the transient
// cause clears, upgrading the cache to the real persona.
const GENERATED_TTL_MS = 6 * 60 * 60 * 1000; // 6h safety refresh
const FALLBACK_TTL_MS = 5 * 60 * 1000; // retry generation in 5 min
let cacheEntry: { persona: MerchantPersona; expires: number } | null = null;
let inflight: Promise<MerchantPersona> | null = null;

function cachePersona(p: MerchantPersona): MerchantPersona {
  const ttl = p.generated ? GENERATED_TTL_MS : FALLBACK_TTL_MS;
  cacheEntry = { persona: p, expires: Date.now() + ttl };
  return p;
}

// Persona synthesis (catalog fetch + LLM) takes several seconds, and it runs on
// the voice CONNECT path (baked into the token mint). So it must NEVER be awaited by
// the caller — doing so either delays connect by ~7s or (with a tight budget) times
// out and bakes a generic "Assistant" persona that then caches for hours. Instead:
//
//   • single-flight background generation warms the cache,
//   • a FRESH cache is served immediately,
//   • a STALE cache is served while a refresh runs (stale-while-revalidate),
//   • a COLD start returns the instant deterministic (catalog-agnostic) persona and
//     lets the background job upgrade it to the real one for the next session.
//
// Net: connect is never blocked on the model, and after the first (sub-second)
// warm-up every session gets the rich, catalog-generated persona.
export function getMerchantPersona(): Promise<MerchantPersona> {
  const fresh = cacheEntry && Date.now() < cacheEntry.expires;
  // Kick off / continue a single background generation whenever the cache isn't fresh.
  if (!fresh && !inflight) {
    inflight = generatePersona()
      .then(cachePersona)
      .finally(() => {
        inflight = null;
      });
  }
  // Serve whatever we have without waiting on the model: fresh or stale cache, else
  // the instant deterministic persona (the background job warms the rich one).
  if (cacheEntry) return Promise.resolve(cacheEntry.persona);
  return Promise.resolve({ ...MERCHANT_CONFIG, generated: false });
}

function titlesOf(res: unknown): string[] {
  const data = (res as { data?: unknown })?.data;
  const list = Array.isArray(data)
    ? (data as Array<Record<string, unknown>>)
    : [];
  return list
    .map((x) =>
      typeof x.title === "string"
        ? x.title
        : typeof x.name === "string"
          ? (x.name as string)
          : ""
    )
    .filter(Boolean);
}

/** Distinct product TYPES (Shopify product_type) — a strong, compact signal of
 *  what the store actually sells, sharpening the inferred domain (e.g. "Cream",
 *  "Serum", "Shampoo" → skincare/baby-care). Merchant-agnostic; empty if absent. */
function typesOf(res: unknown): string[] {
  const data = (res as { data?: unknown })?.data;
  const list = Array.isArray(data)
    ? (data as Array<Record<string, unknown>>)
    : [];
  const types = list
    .map((x) =>
      typeof x.productType === "string"
        ? x.productType
        : typeof x.product_type === "string"
          ? (x.product_type as string)
          : typeof x.type === "string"
            ? (x.type as string)
            : ""
    )
    .filter(Boolean)
    .map((t) => t.trim());
  return Array.from(new Set(types));
}

// Hard ceiling on total LLM persona time. Generation runs in the BACKGROUND (see
// getMerchantPersona — it never blocks the connect/token-mint path), so this budget
// is generous enough for the model to actually finish: the previous 3s ceiling
// consistently timed out (a cold gpt-4o-mini persona call takes ~7s), which baked a
// generic fallback persona and cached it for hours. On timeout we still fall through
// to the deterministic, catalog-grounded persona so voice always works.
const PERSONA_LLM_BUDGET_MS =
  Number(process.env.VOICE_PERSONA_BUDGET_MS) || 12000;

// Persona synthesis via the shared TextGenerator port (OpenAI today; one adapter
// per model, chosen by config; no vendor SDK here). A hard time budget ensures a
// slow or quota-exhausted model can NEVER block the token mint; on timeout we fall
// through to the deterministic persona.
async function runPersonaLLM(prompt: string): Promise<string> {
  const attempt = getTextGenerator().generateText(prompt, {
    maxTokens: 350,
    temperature: 0.4,
  });
  const deadline = new Promise<string>((resolve) =>
    setTimeout(() => resolve(""), PERSONA_LLM_BUDGET_MS)
  );
  return Promise.race([attempt, deadline]);
}

async function generatePersona(): Promise<MerchantPersona> {
  const storeName = MERCHANT_CONFIG.storeName; // config/registry, not inferred
  const fallback: MerchantPersona = { ...MERCHANT_CONFIG, generated: false };

  try {
    const client = getCommerceClient();
    const [colRes, prodRes] = await Promise.allSettled([
      client.getCollections({ first: 100 }),
      client.getProducts({ first: 40 }),
    ]);
    const collections =
      colRes.status === "fulfilled" ? titlesOf(colRes.value) : [];
    const products =
      prodRes.status === "fulfilled" ? titlesOf(prodRes.value) : [];
    const productTypes =
      prodRes.status === "fulfilled" ? typesOf(prodRes.value) : [];
    if (!collections.length && !products.length) return fallback;

    const categories = collections.slice(0, 8);
    // Deterministic, 100%-grounded description straight from real category names —
    // no LLM, so ZERO hallucination risk. Used when the model call fails, and it's
    // fully merchant-agnostic (works for any catalog, any vertical).
    const deterministicBrand = categories.length
      ? `${storeName} offers products across categories including: ${categories.join(", ")}.`
      : MERCHANT_CONFIG.brandInstructions;

    const profile = [
      `Store name: ${storeName}`,
      collections.length
        ? `Collections / categories: ${collections.slice(0, 20).join(", ")}`
        : "",
      productTypes.length
        ? `Product types: ${productTypes.slice(0, 15).join(", ")}`
        : "",
      products.length
        ? `Example products: ${products.slice(0, 25).join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Skip the LLM persona rewrite entirely when VOICE_PERSONA_LLM=false — the
    // deterministic, catalog-grounded persona below is used instead (instant,
    // zero-hallucination, merchant-agnostic). Otherwise synthesize via the
    // provider-agnostic TextGenerator port.
    const useLlm = process.env.VOICE_PERSONA_LLM !== "false";
    const text = useLlm
      ? await runPersonaLLM(
          `You are configuring a VOICE shopping assistant that must behave like an EXPERT in-store consultant for ONE specific online store, using ONLY the store's real data below. Infer the store's industry from the data and craft a fitting persona. Do NOT invent product types the data doesn't imply.

${profile}

ANTI-HALLUCINATION RULES (critical): describe ONLY what the categories/product names imply. Do NOT mention or promise prices, discounts, promotions, shipping, returns, stock/availability, guarantees, awards, or ANY specific claim not directly stated above. No superlatives. Keep it factual.

Return ONLY a JSON object (no markdown, no prose) with exactly:
- "agentName": a warm, human first name that fits the brand.
- "domain": a short 2-4 word phrase for what this store SPECIALIZES in (e.g. "baby and mother care", "women's fashion", "health & wellness supplements", "consumer electronics"), grounded ONLY in the data — infer it from the FULL catalog, not one stray product. This is the lens for interpreting ambiguous requests — so a fashion store reads "boots" as fashion footwear, an electronics store reads "case" as a device case.
- "tone": the single best-fit personality, EXACTLY one of: "warm", "professional", "playful", "luxury", "minimal" (e.g. baby-care → warm, electronics → professional, boutique fashion → luxury).
- "brandInstructions": 2-3 short sentences on what the store sells and how an expert associate there would help shoppers, grounded ONLY in the data.`
        )
      : "";

    // Prefer the model's copy, but fall back to the deterministic (zero-hallucination)
    // catalog-derived description if the model failed or returned nothing usable.
    let agentName = MERCHANT_CONFIG.agentName;
    let brandInstructions = deterministicBrand;
    // Domain = the interpretive lens (e.g. "men's grooming"). Undefined if the
    // model doesn't return one → buildPersona falls back to the real categories.
    let domain: string | undefined;
    let tone: PersonaTone | undefined;
    const s = text.indexOf("{");
    const e = text.lastIndexOf("}");
    if (s !== -1 && e !== -1) {
      try {
        const parsed = JSON.parse(text.slice(s, e + 1)) as Record<
          string,
          unknown
        >;
        if (typeof parsed.agentName === "string" && parsed.agentName.trim())
          agentName = parsed.agentName.trim();
        if (
          typeof parsed.brandInstructions === "string" &&
          parsed.brandInstructions.trim()
        )
          brandInstructions = parsed.brandInstructions.trim();
        if (typeof parsed.domain === "string" && parsed.domain.trim())
          domain = parsed.domain.trim();
        const VALID_TONES = [
          "warm",
          "professional",
          "playful",
          "luxury",
          "minimal",
        ];
        if (
          typeof parsed.tone === "string" &&
          VALID_TONES.includes(parsed.tone.trim())
        )
          tone = parsed.tone.trim() as PersonaTone;
      } catch {
        /* keep deterministic fallback */
      }
    }

    console.log(
      `[voice][persona] generated for "${storeName}" via ${getTextGenerator().name} — ` +
        `domain="${domain ?? "(catalog-derived)"}", tone="${tone ?? "default"}", ` +
        `agent="${agentName}", ${categories.length} categories, ${productTypes.length} product types`
    );
    return {
      agentName,
      storeName,
      brandInstructions,
      domain,
      tone,
      languages: MERCHANT_CONFIG.languages,
      catalogLanguage: MERCHANT_CONFIG.catalogLanguage,
      categories,
      generated: true,
    };
  } catch (e) {
    console.warn(
      `[voice][persona] generation failed for "${storeName}" — using deterministic fallback:`,
      (e as Error)?.message
    );
    return fallback;
  }
}

export function clearMerchantPersonaCache() {
  cacheEntry = null;
}
