// utils/metafield.ts

import { normalizeValue } from "../../ProductAdditionalInfoSection/utils/getAdditionalInfoItems";
import { PRODUCT_TAG_LABELS_ARRAY } from "../constant";
import { ProductImage } from "../types";

/** Type for a generic Shopify metafield */
export interface ShopifyMetafield {
  namespace: string;
  key: string;
  type?: string;
  value?: string;
  reference?: any;
  references?: any;
}

export interface RatingValue {
  scale_min: string;
  scale_max: string;
  value: string;
}

const handleize = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-"); // spaces → hyphens
};

/**
 * Safely finds a metafield from an array by `key` and optional `namespace`.
 * Automatically parses JSON values if possible.
 *
 * @param metafields - Array of metafield objects
 * @param key - Metafield key to find
 * @param namespace - (Optional) Metafield namespace
 * @returns Parsed value or undefined if not found or invalid
 */
export function findMetafieldValue<T = string>(
  metafields: ShopifyMetafield[] | undefined,
  key: string,
  namespace?: string
): T | undefined {
  if (!Array.isArray(metafields)) return undefined;

  const field = metafields.find(
    (item) =>
      item?.key === key && (namespace ? item?.namespace === namespace : true)
  );

  if (!field?.value) return undefined;

  try {
    // Attempt to parse JSON values safely
    return JSON.parse(field.value) as T;
  } catch {
    // If parsing fails, return the raw string value
    return field.value as unknown as T;
  }
}

export const PRODUCT_TAG_LABELS_MAP = PRODUCT_TAG_LABELS_ARRAY.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<string, { key: string; label: string; background: string }>
);

export const getProductLabel = (
  productLabelsMeta: string | undefined,
  tags: string[] | undefined
) => {
  // 1. Metafield first priority
  const finalLabelValue = normalizeValue(productLabelsMeta);
  if (finalLabelValue) {
    return {
      key: finalLabelValue.toLowerCase(),
      label: finalLabelValue,
      background: "#82c341",
    };
  }

  // 2. Single loop → normalize + lookup in O(1)
  for (const tag of tags || []) {
    const normalized = handleize(tag);
    const match = PRODUCT_TAG_LABELS_MAP[normalized];
    if (match) {
      return match;
    }
  }

  // 3. No match
  return undefined;
};

export function getPrimaryAndSecondaryImages(images: ProductImage[] = []) {
  if (!images.length) {
    return {
      primaryImage: null,
      secondaryImage: null,
    };
  }

  // find index of main image
  const mainImageIndex = images.findIndex((image) => image.is_main === true);

  // reorder images if main image exists
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
