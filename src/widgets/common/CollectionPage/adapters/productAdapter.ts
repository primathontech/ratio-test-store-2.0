import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { getProductLabel } from "@/ui/components/ProductCard/badgeUtils";
import { resolveAvailableForSale } from "@/ui/components/ProductCard/availability";
import type { TransformedProduct } from "../api/types";

/**
 * Convert TransformedProduct (v2 collection API shape) into the
 * ProductCardProduct shape that the shared `@/ui/components/ProductCard`
 * expects. Handles paise→rupee conversion, discount derivation,
 * main/hover image extraction, and badge/category mapping.
 */
export function transformProductForCard(
  product: TransformedProduct
): ProductCardProduct {
  const validImages = (product.images || []).filter(
    (img) => typeof img?.url === "string" && img.url.trim() !== ""
  );
  const mainImg =
    validImages.find((img) => img.is_main)?.url || validImages[0]?.url || "";
  const hoverImg =
    validImages.find((img) => !img.is_main)?.url || mainImg || "";
  const alt =
    validImages.find((img) => img.is_main)?.alt ||
    product.title ||
    "Product image";

  const salePrice = product.price ? product.price / 100 : 0;
  const originalPrice = product.compareAtPrice
    ? product.compareAtPrice / 100
    : undefined;

  let discount: string | undefined;
  if (originalPrice && originalPrice > salePrice && salePrice > 0) {
    const pct = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    discount = `${pct}% off`;
  }

  // Badge — metafield first, tag fallback (mirrors toCardProduct used on homepage)
  const resolvedBadge = getProductLabel(product.labels?.[0], product.tags);

  return {
    id: product.id,
    productId: product.id,
    variantId: product.variant?.id,
    sku: product.variant?.sku,
    // Collection API reports quantity on the singular `variant`. When
    // availableForSale is false, fall back to that stock count.
    availableForSale: resolveAvailableForSale(
      product.availableForSale,
      product.availableQuantity
    ),
    href: `/products/${product.handle}`,
    title: product.title,
    alt,
    mainImage: mainImg,
    hoverImage: hoverImg,
    category: product.productType || "",
    badge: resolvedBadge?.label,
    badgeBackground: resolvedBadge?.background,
    rating: Number(product.average_rating) || 0,
    reviewCount: Number(product.rating_count) || 0,
    salePrice,
    originalPrice,
    discount,
    weight: product.netContent || undefined,
    description: product.subtitle || undefined,
  };
}
