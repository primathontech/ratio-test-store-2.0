import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { getProductLabel } from "@/ui/components/ProductCard/badgeUtils";
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
  const availableForSale =
    typeof product.availableForSale === "boolean"
      ? product.availableForSale
      : (variantFromList?.availableForSale ??
        product.variant?.availableForSale);

  /* ---------- Rating ---------- */
  const ratingNum =
    product.average_rating != null ? Number(product.average_rating) : 0;
  const reviewNum =
    product.rating_count != null ? Number(product.rating_count) : 0;

  /* ---------- Badge — metafield first, tag fallback ---------- */
  const productLabelsRaw = (
    product.metadata as Record<string, { value?: unknown } | undefined> | null
  )?.product_labels?.value;
  const tagStrings = normalizeTags(product.tags);
  const resolvedBadge = getProductLabel(productLabelsRaw, tagStrings);

  return {
    id: product.id,
    productId: product.id,
    variantId,
    availableForSale,
    href: `/products/${product.handle}`,
    title: product.title,
    alt,
    mainImage: mainImg,
    hoverImage: hoverImg,
    category: product.productType || product.product_type || "",
    badge: resolvedBadge?.label,
    badgeBackground: resolvedBadge?.background,
    rating: Number.isFinite(ratingNum) ? ratingNum : 0,
    reviewCount: Number.isFinite(reviewNum) ? reviewNum : 0,
    salePrice,
    originalPrice,
    discount,
    weight: readMetadataValue(product.metadata, "product_net_content"),
    description: readMetadataValue(product.metadata, "product_subtitle"),
  };
}
