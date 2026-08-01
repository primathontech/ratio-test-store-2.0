/**
 * Cart image cache — the backend cart API often doesn't return images.
 * Call cacheCartImage() before addItem() so the cart drawer can show product images.
 */

const cache = new Map<string, string>();

export function cacheCartImage(
  variantId: string,
  imageUrl: string,
  productId?: string
): void {
  if (!imageUrl) {
    return;
  }
  if (variantId) {
    cache.set(String(variantId), imageUrl);
  }
  if (productId) {
    cache.set(String(productId), imageUrl);
  }
}

export function getCartImage(item: Record<string, any>): string {
  const direct =
    item.image ||
    item.image_url ||
    item.featured_image ||
    item.images?.[0]?.url;
  if (direct) {
    return direct;
  }

  for (const key of [
    item.variantId || item.variant_id,
    item.productId || item.product_id,
    item.id,
  ]) {
    if (key) {
      const cached = cache.get(String(key));
      if (cached) {
        return cached;
      }
    }
  }
  return "";
}
