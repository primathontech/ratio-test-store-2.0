/**
 * Deterministic money formatting for the voice agent.
 *
 * WHY THIS EXISTS: the model must never be handed a bare price NUMBER and left to
 * attach a currency itself — its dominant prior for "a price" is US dollars, so it
 * will occasionally say "$499" on an INR store no matter how firmly the persona
 * rule says otherwise (a rule is advisory; this is not). The deterministic fix is
 * to give the model a ready-to-speak STRING with the correct symbol already in it
 * (e.g. "₹499"), built from the merchant's REAL price data. The model reads that
 * string verbatim — there is no inference step left to get wrong.
 *
 * Pure and dependency-free so it runs identically on the SERVER (the API routes
 * that assemble tool payloads) and the CLIENT (runTool). The default symbol comes
 * from the SAME env the persona/config read, so the spoken currency and the payload
 * currency can never disagree.
 */

/**
 * Convert a MINOR-unit integer (paise / cents — 1/100 of the major unit) to the
 * major unit (rupees / dollars). Owned HERE inside the voice module — deliberately
 * NOT imported from a host util — so the voice code carries no dependency on the
 * merchant project for currency math and can be lifted into its own repo/SDK as-is.
 * The /100 ratio holds for every ISO currency with 100 minor units (INR, USD, EUR…).
 */
export function minorToMajor(minor: unknown): number {
  const n = Number(minor);
  return Number.isNaN(n) ? 0 : n / 100;
}

const DEFAULT_SYMBOL = process.env.NEXT_PUBLIC_VOICE_CURRENCY_SYMBOL || "₹";
// The currency as a spoken WORD (e.g. "rupees"). CRITICAL: a real-time voice model
// reads the digits out of a symbol-only string like "₹499" and, in English, attaches
// its dominant "dollars" prior — so it says "499 dollars" (in Hindi it defaults to
// rupees). The only deterministic fix is to give it the currency as an explicit WORD
// it cannot misread. Config-driven (default "rupees" for INR).
const CURRENCY_WORD = process.env.NEXT_PUBLIC_VOICE_CURRENCY_NAME || "rupees";
// Digit-grouping locale (cosmetic only — Indian grouping by default; every current
// merchant is INR).
const GROUPING_LOCALE = "en-IN";

/**
 * Format an amount (already in MAJOR units — rupees, not paise) as a ready-to-speak
 * price string that spells the currency as a WORD, e.g. "₹1,299 rupees". Both the
 * symbol (for the reader/UI) AND the word (so the model can NEVER say "dollars") are
 * included. Returns null when the amount is missing/invalid so callers can OMIT the
 * field rather than emit a bogus "₹0 rupees"/"NaN".
 */
export function formatMoney(
  amount: number | null | undefined,
  symbol: string = DEFAULT_SYMBOL
): string | null {
  const n = Number(amount);
  if (amount == null || !Number.isFinite(n)) {
    return null;
  }
  return `${symbol}${n.toLocaleString(GROUPING_LOCALE, {
    maximumFractionDigits: 2,
  })} ${CURRENCY_WORD}`;
}
