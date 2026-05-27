/**
 * Product badge resolution — ported from the bblunt reference
 * (`src/widgets/bblunt/ProductGrid/utils/metafield.ts` +
 * `src/widgets/bblunt/ProductGrid/constant.ts`).
 *
 * Priority:
 *   1. `product_labels` metafield → label uses the metafield string
 *      with a fixed green background (#82c341).
 *   2. Product tags → look up the (handleized) tag in the labels map
 *      and use the mapped label + background.
 *   3. No match → undefined (no badge rendered).
 */

export interface ProductBadge {
  key: string;
  label: string;
  background: string;
}

/** Tag → badge map. 1:1 with the bblunt reference's PRODUCT_TAG_LABELS_ARRAY. */
const PRODUCT_TAG_LABELS_ARRAY: ProductBadge[] = [
  { key: "offer_b1g1", label: "B1G1", background: "#82c341" },
  { key: "best-seller", label: "Bestseller", background: "#ff5b6f" },
  { key: "bestsellers", label: "Bestseller", background: "#ff5b6f" },
  { key: "trending", label: "Trending", background: "#82c341" },
  { key: "new launch", label: "New Launch", background: "#ff5b6f" },
  { key: "new-launch", label: "New Launch", background: "#ff5b6f" },
  { key: "flat-45-off", label: "Flat 45% off", background: "#ff5b6f" },
  { key: "200-units-left", label: "200 units left", background: "#ff5b6f" },
  {
    key: "1m-quantity-sold",
    label: "1M+ quantity sold",
    background: "#ff5b6f",
  },
  { key: "back-in-stock", label: "Back in stock", background: "#ff5b6f" },
  { key: "limited-stock", label: "Limited Stock", background: "#ff5b6f" },
  {
    key: "only-99-quantity-left",
    label: "Only 99 quantity Left",
    background: "#ff5b6f",
  },
  {
    key: "only-199-quantity-left",
    label: "Only 199 quantity Left",
    background: "#ff5b6f",
  },
  {
    key: "only-149-quantity-left",
    label: "Only 149 Quantity left",
    background: "#ff5b6f",
  },
  { key: "flash-deal", label: "Flash deal", background: "#ff5b6f" },
  { key: "limited-deal", label: "Limited Deal", background: "#ff5b6f" },
  { key: "bogo", label: "BOGO", background: "#ff5b6f" },
  { key: "combo50", label: "COMBO50", background: "#ff5b6f" },
];

export const PRODUCT_TAG_LABELS_MAP: Record<string, ProductBadge> =
  PRODUCT_TAG_LABELS_ARRAY.reduce(
    (acc, item) => {
      acc[item.key] = item;
      return acc;
    },
    {} as Record<string, ProductBadge>
  );

/** Lowercase, strip non-alphanumeric, hyphenate spaces. */
function handleize(str: string): string {
  if (!str || typeof str !== "string") {
    return "";
  }
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Normalize an unknown metafield value to a trimmed string (or null).
 * Mirrors the reference `normalizeValue` so behavior matches across both
 * codebases for arrays / strings / numbers.
 */
function normalizeValue(value: unknown): string | null {
  if (!value) {
    return null;
  }
  if (Array.isArray(value)) {
    const joined = value.filter(Boolean).join(", ");
    return joined.trim() || null;
  }
  if (typeof value === "string") {
    return value.trim() || null;
  }
  return String(value).trim() || null;
}

/**
 * Resolve the product badge using metafield-first, tag-fallback logic.
 *
 * @param productLabelsMeta - Raw value of `metadata.product_labels.value`
 *                            (string | string[] | null | undefined).
 * @param tags              - Product tags (will be handleized).
 * @returns Badge {key,label,background} or undefined.
 */
export function getProductLabel(
  productLabelsMeta: unknown,
  tags: string[] | undefined
): ProductBadge | undefined {
  // 1. Metafield first priority
  const finalLabelValue = normalizeValue(productLabelsMeta);
  if (finalLabelValue) {
    return {
      key: finalLabelValue.toLowerCase(),
      label: finalLabelValue,
      background: "#82c341",
    };
  }

  // 2. Tag fallback (single pass, O(1) lookup per tag)
  for (const tag of tags || []) {
    const normalized = handleize(tag);
    const match = PRODUCT_TAG_LABELS_MAP[normalized];
    if (match) {
      return match;
    }
  }

  // 3. No match
  return undefined;
}
