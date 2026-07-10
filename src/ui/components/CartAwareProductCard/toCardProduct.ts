import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { getProductLabel } from "@/ui/components/ProductCard/badgeUtils";
import { resolveAvailableForSale } from "@/ui/components/ProductCard/availability";
import type { MappableApiProduct, MappableApiTag } from "./types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function readMetadataValue(
  metadata: MappableApiProduct["metadata"],
  key: string
): string | undefined {
  if (!metadata || typeof metadata !== "object") {
    return undefined;
  }
  const entry = (metadata as Record<string, unknown>)[key];
  if (entry && typeof entry === "object" && "value" in entry) {
    const value = (entry as { value: unknown }).value;
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
  }
  return undefined;
}

function normalizeTags(tags: MappableApiTag[] | undefined): string[] {
  if (!tags) {
    return [];
  }
  return tags
    .map((t) => (typeof t === "string" ? t : (t?.name ?? "")))
    .filter((s): s is string => !!s);
}

/* ------------------------------------------------------------------ */
/*  Single source-of-truth API → ProductCardProduct mapper             */
/* ------------------------------------------------------------------ */

/**
 * Convert any API product (collection, recently-viewed, search…) into the
 * shape `<ProductCard>` expects. Replaces 8 hand-rolled `transformApiProduct`
 * copies that previously lived in each widget.
 *
 * Falls through several known shape variants (image_url / images[] /
 * image.url, variants[] / variant, tag-string / tag-object, etc.) so all
 * surfaces map cleanly without additional adapters.
 */
export function toCardProduct(product: MappableApiProduct): ProductCardProduct {
  /* ---------- Images ---------- */
  const mainImg =
    product.images?.find((img) => img.is_main)?.url ||
    product.image_url ||
    product.image?.url ||
    "";
  const hoverImg = product.images?.find((img) => !img.is_main)?.url || mainImg;
  const altCandidate =
    product.images?.find((img) => img.is_main)?.alt ||
    product.images?.find((img) => img.is_main)?.alt_text ||
    product.image?.alt_text ||
    product.title;
  const alt = altCandidate || "Product image";

  /* ---------- Prices (paisa → ₹) ---------- */
  const salePrice = product.price ? product.price / 100 : 0;
  const originalPrice =
    typeof product.compare_at_price === "number" && product.compare_at_price > 0
      ? product.compare_at_price / 100
      : undefined;

  let discount: string | undefined;
  if (originalPrice && originalPrice > salePrice && salePrice > 0) {
    const pct = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    discount = `${pct}% off`;
  }

  /* ---------- Variant / availability ---------- */
  const variantFromList = product.variants?.[0];
  const variantId = variantFromList?.id || product.variant?.id;
  const sku = variantFromList?.sku || product.variant?.sku;
  const rawAvailableForSale =
    typeof product.availableForSale === "boolean"
      ? product.availableForSale
      : (variantFromList?.availableForSale ??
        product.variant?.availableForSale);
  // When availableForSale is false, fall back to stock quantity (variant
  // first, then product-level) before declaring the card sold out.
  const availableQuantity =
    variantFromList?.availableQuantity ??
    product.variant?.availableQuantity ??
    product.availableQuantity;
  const availableForSale = resolveAvailableForSale(
    rawAvailableForSale,
    availableQuantity
  );

  /* ---------- Rating ---------- */
  const ratingNum =
    product.average_rating != null ? Number(product.average_rating) : 0;
  const reviewNum =
    product.rating_count != null ? Number(product.rating_count) : 0;

  /* ---------- Badge — resolve each source in isolation, derive the
   * combined badge from them.
   *
   * `tagOnlyBadge`  = result from product tags only.
   * `metaOnlyBadge` = result from `metadata.product_labels.value` only.
   * `resolvedBadge` = metafield-first / tag-fallback, semantically the
   *                   same as `getProductLabel(meta, tags)`. Single-badge
   *                   consumers read this; dual-badge consumers read the
   *                   two source-specific fields. */
  const productLabelsRaw = (
    product.metadata as Record<string, { value?: unknown } | undefined> | null
  )?.product_labels?.value;
  const tagStrings = normalizeTags(product.tags);
  const rawTagBadge = getProductLabel(undefined, tagStrings);
  const metaOnlyBadge = getProductLabel(productLabelsRaw, undefined);
  // Drop the tag-derived badge when it labels the same thing as the
  // metafield-derived one (e.g. metafield "Bestseller" + tag "Best Seller"
  // both resolve to label "Bestseller"). Without this dedup the dual-badge
  // render shows two identical pills stacked on top of each other —
  // exactly the bug from the search NoResult screenshot. Comparison is
  // case-insensitive so "Bestseller" vs "BESTSELLER" still dedupes.
  const sameLabel =
    !!rawTagBadge &&
    !!metaOnlyBadge &&
    rawTagBadge.label.trim().toLowerCase() ===
      metaOnlyBadge.label.trim().toLowerCase();
  const tagOnlyBadge = sameLabel ? undefined : rawTagBadge;
  const resolvedBadge = metaOnlyBadge ?? tagOnlyBadge;

  return {
    id: product.id,
    productId: product.id,
    variantId,
    sku,
    availableForSale,
    href: `/products/${product.handle}`,
    title: product.title,
    alt,
    mainImage: mainImg,
    hoverImage: hoverImg,
    category: product.productType || product.product_type || "",
    badge: resolvedBadge?.label,
    badgeBackground: resolvedBadge?.background,
    tagBadge: tagOnlyBadge
      ? { label: tagOnlyBadge.label, background: tagOnlyBadge.background }
      : undefined,
    metaBadge: metaOnlyBadge
      ? { label: metaOnlyBadge.label, background: metaOnlyBadge.background }
      : undefined,
    rating: Number.isFinite(ratingNum) ? ratingNum : 0,
    reviewCount: Number.isFinite(reviewNum) ? reviewNum : 0,
    salePrice,
    originalPrice,
    discount,
    weight: readMetadataValue(product.metadata, "product_net_content"),
    description: readMetadataValue(product.metadata, "product_subtitle"),
  };
}
