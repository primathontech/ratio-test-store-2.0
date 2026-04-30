/**
 * Pure helpers for the right-column product info — price/discount math,
 * net-content parsing, and metadata-shape normalisation.
 */

/**
 * Compute the per-unit price string given a price in rupees and a net-content
 * string like "300ml" / "130g". Returns null when the net content can't be
 * parsed as a leading-numeric value.
 */
export const getUnitPrice = (
  price: number,
  netContent: unknown
): string | null => {
  const value = String(netContent || "").trim();
  if (!/^\d/.test(value)) {
    return null;
  }

  const match = value.match(/(\d+(\.\d+)?)/);
  if (!match) {
    return null;
  }

  const contentValue = parseFloat(match[0]);
  if (isNaN(contentValue) || contentValue === 0) {
    return null;
  }

  return (price / contentValue).toFixed(2);
};

/**
 * Pull the unit suffix off a net-content string — "300ml" → "ml", "130g" → "g".
 */
export const getUnitValue = (netContent: unknown): string | null => {
  const value = String(netContent || "").trim();
  if (!/^\d/.test(value)) {
    return null;
  }
  return value.replace(/\d+/g, "").trim();
};

/**
 * `compare_at_price` vs `current` → integer discount percentage.
 * Returns 0 when there's no real discount.
 */
export const calculateDiscountPercentage = (
  compareAtPrice: number,
  currentPrice: number
): number => {
  if (!compareAtPrice || compareAtPrice <= currentPrice) {
    return 0;
  }
  return Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100);
};

/**
 * Normalise an API metafield value that's documented as `string[]` but has
 * been observed at runtime to also arrive as a single string (or undefined).
 * Indexing a bare string with `[0]` silently returns its first character —
 * this helper avoids that footgun.
 */
export const pickFirstString = (value: unknown): string => {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : "";
  }
  return typeof value === "string" ? value : "";
};

/**
 * Coerce a value into a string array — used for tag/chip metadata that may
 * arrive as `string`, `string[]`, or `undefined`.
 */
export const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === undefined || value === null) {
    return [];
  }
  return [value];
};
