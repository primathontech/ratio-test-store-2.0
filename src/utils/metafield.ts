import { PRODUCT_TAG_LABELS_ARRAY } from "./productMetafield.constants";

/**
 * Shopify-style metafield envelope (used for `findMetafieldValue` lookups
 * on products that expose a flat `metafields[]` array instead of the
 * structured `metadata` object).
 */
export interface ShopifyMetafield {
  namespace: string;
  key: string;
  type?: string;
  value?: string;
  reference?: unknown;
  references?: unknown;
}

export interface RatingValue {
  scale_min: string;
  scale_max: string;
  value: string;
}

export interface ProductLabel {
  key: string;
  label: string;
  background: string;
}

/**
 * Lowercase, strip non-alphanumerics, collapse whitespace into hyphens —
 * the same shape Shopify uses for its handle URLs. Drives the tag → label
 * lookup so "New Launch", "new-launch", and "New  Launch  " all resolve
 * to the same entry.
 */
const handleize = (str: string): string => {
  if (!str || typeof str !== "string") {
    return "";
  }
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

/**
 * Normalise a metafield value that the API may return as `string`,
 * `string[]`, or `undefined`. Inlined here because the reference's
 * `normalizeValue` import (`ProductAdditionalInfoSection/utils/...`)
 * doesn't exist in this project.
 */
const normalizeValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : "";
  }
  return typeof value === "string" ? value : "";
};

/**
 * Find a metafield by `key` (and optional `namespace`) in a flat array.
 * Returns the JSON-parsed value when possible, falling back to the raw
 * string otherwise. Used by code paths that consume Shopify's
 * `metafields[]` shape.
 */
export function findMetafieldValue<T = string>(
  metafields: ShopifyMetafield[] | undefined,
  key: string,
  namespace?: string
): T | undefined {
  if (!Array.isArray(metafields)) {
    return undefined;
  }

  const field = metafields.find(
    (item) =>
      item?.key === key && (namespace ? item?.namespace === namespace : true)
  );

  if (!field?.value) {
    return undefined;
  }

  try {
    return JSON.parse(field.value) as T;
  } catch {
    return field.value as unknown as T;
  }
}

/**
 * Pre-built map for O(1) tag lookup, keyed by `handleize`d tag name.
 */
export const PRODUCT_TAG_LABELS_MAP = PRODUCT_TAG_LABELS_ARRAY.reduce(
  (acc, item) => {
    acc[item.key] = { ...item };
    return acc;
  },
  {} as Record<string, ProductLabel>
);

/**
 * Resolve a product's `{ key, label, background }` ribbon using the
 * two-source priority from the bblunt reference:
 *
 *   1. **Metafield** (`custom.product_labels`) — wins outright. Uses the
 *      literal value as the label text and a fixed green background
 *      (`#82c341`) to match the bblunt "Get2@₹599" pill.
 *   2. **Tag fallback** — scans `tags` against `PRODUCT_TAG_LABELS_MAP`
 *      and returns the first match (e.g. tag `new-launch` → pink
 *      "New Launch" pill).
 *
 * Returns `undefined` when neither source yields a match.
 */
export const getProductLabel = (
  productLabelsMeta: unknown,
  tags: string[] | undefined
): ProductLabel | undefined => {
  // 1. Metafield wins.
  const finalLabelValue = normalizeValue(productLabelsMeta);
  if (finalLabelValue) {
    return {
      key: finalLabelValue.toLowerCase(),
      label: finalLabelValue,
      background: "#82c341",
    };
  }

  // 2. Tag lookup, single pass.
  for (const tag of tags || []) {
    const normalized = handleize(tag);
    const match = PRODUCT_TAG_LABELS_MAP[normalized];
    if (match) {
      return match;
    }
  }

  return undefined;
};

/**
 * Pick the first two images for a product card, putting the entry flagged
 * `is_main` first. Returns `{ primaryImage, secondaryImage }` (either may
 * be null if the product has no images).
 */
export function getPrimaryAndSecondaryImages<
  T extends { is_main?: boolean | null },
>(images: T[] = []): { primaryImage: T | null; secondaryImage: T | null } {
  if (!images.length) {
    return { primaryImage: null, secondaryImage: null };
  }

  const mainImageIndex = images.findIndex((image) => image.is_main === true);
  const orderedImages =
    mainImageIndex !== -1
      ? [
          images[mainImageIndex],
          ...images.filter((_, index) => index !== mainImageIndex),
        ]
      : images;

  return {
    primaryImage: orderedImages[0] ?? null,
    secondaryImage: orderedImages[1] ?? null,
  };
}
