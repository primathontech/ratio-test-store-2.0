import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { getProductLabel } from "@/ui/components/ProductCard/badgeUtils";
import { getCommerceClient } from "@/config/commerce";

/* ------------------------------------------------------------------ */
/*  localStorage — viewed products history                             */
/* ------------------------------------------------------------------ */

const VIEWED_PRODUCTS_KEY = "viewed_products";
const MAX_STORED_ENTRIES = 50;

export interface ViewedEntry {
  product_id: string;
  variant_id: number | null;
  time: number;
}

function getStored(): ViewedEntry[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(VIEWED_PRODUCTS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStored(entries: ViewedEntry[]) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(entries));
  } catch {
    /* ignore quota / disabled storage */
  }
}

/** Add a product visit. Removes previous entry for the same product, prepends new entry, caps at 50. */
export function addViewedProduct(
  productId: string,
  variantId?: string | number | null
): void {
  const id = String(productId);
  const variant = variantId != null ? Number(variantId) : null;
  let entries = getStored();
  entries = entries.filter((e) => e.product_id !== id);
  entries.unshift({ product_id: id, variant_id: variant, time: Date.now() });
  setStored(entries.slice(0, MAX_STORED_ENTRIES));
}

/** Get unique product IDs, most recent first, up to limit. */
export function getViewedProductIds(limit: number): string[] {
  const entries = getStored();
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const e of entries) {
    if (ids.length >= limit) {
      break;
    }
    if (!e.product_id || seen.has(e.product_id)) {
      continue;
    }
    seen.add(e.product_id);
    ids.push(String(e.product_id));
  }
  return ids;
}

/* ------------------------------------------------------------------ */
/*  API — POST /api/v1/product/details                                 */
/* ------------------------------------------------------------------ */

interface ApiImage {
  url: string;
  is_main?: boolean;
  alt?: string | null;
  alt_text?: string | null;
}

interface ApiVariantLite {
  id: string;
  sku?: string;
  availableForSale?: boolean;
}

export interface ApiRecentProduct {
  id: string;
  title: string;
  handle: string;
  product_type?: string;
  productType?: string;
  price: number;
  compare_at_price?: number | null;
  image_url?: string;
  image?: { url?: string; alt_text?: string | null };
  images?: ApiImage[];
  availableForSale?: boolean;
  variants?: ApiVariantLite[];
  variant?: ApiVariantLite;
  metadata?: Record<string, { value: unknown } | unknown> | null;
  /**
   * Tags — used as fallback for badge resolution. The GoKwik backend ships
   * tags as `{ id, name }` objects on this endpoint; older / Shopify shapes
   * are plain strings. Both are accepted; `normalizeTags` flattens them.
   */
  tags?: Array<string | { id?: string; name?: string }>;
  average_rating?: string | number;
  rating_count?: string | number;
}

/**
 * Unwrap getProduct's response — typically `{ success, data: {...product} }`,
 * sometimes the product fields are at the top level. Tolerates both shapes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapProduct(payload: any): ApiRecentProduct | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  // Standard shape: { success, data: {...product} }
  if (payload.data && typeof payload.data === "object" && payload.data.id) {
    return payload.data as ApiRecentProduct;
  }
  // Already the product
  if (payload.id) {
    return payload as ApiRecentProduct;
  }
  return null;
}

/**
 * Fetch product details for the given IDs via `commerceClient.getProduct`.
 * Calls run in parallel (`Promise.all`); failures for individual IDs are
 * swallowed so a single bad ID doesn't break the rail. Same input/output
 * contract as the previous raw-fetch implementation — V1 keeps working.
 */
export async function fetchProductDetails(
  productIds: string[]
): Promise<ApiRecentProduct[]> {
  if (productIds.length === 0) {
    return [];
  }
  try {
    const commerceClient = getCommerceClient();
    const results = await Promise.all(
      productIds.map(async (id) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result: any = await commerceClient.getProduct({
            id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
          return unwrapProduct(result);
        } catch {
          return null;
        }
      })
    );
    return results.filter((p): p is ApiRecentProduct => p !== null);
  } catch (error) {
    console.error("RecentlyViewed: fetchProductDetails failed", error);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Transform — ApiRecentProduct → ProductCardProduct                  */
/* ------------------------------------------------------------------ */

function readMetadataValue(
  metadata: ApiRecentProduct["metadata"],
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

export function transformApiProductToCardProduct(
  product: ApiRecentProduct
): ProductCardProduct {
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

  // Prices stored in paisa (e.g. 59900 = ₹599)
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

  const variantFromList = product.variants?.[0];
  const variantId = variantFromList?.id || product.variant?.id;
  const availableForSale =
    typeof product.availableForSale === "boolean"
      ? product.availableForSale
      : (variantFromList?.availableForSale ??
        product.variant?.availableForSale);

  const ratingNum =
    product.average_rating != null ? Number(product.average_rating) : 0;
  const reviewNum =
    product.rating_count != null ? Number(product.rating_count) : 0;

  // Resolve badge: metafield first, tag fallback (matches HairCareBFFs /
  // FeaturedCollectionCarousel logic). Returns both label AND background color.
  const productLabelsRaw = (
    product.metadata as Record<string, { value?: unknown } | undefined> | null
  )?.product_labels?.value;
  // Normalize tags to plain strings — GoKwik returns `{id, name}` objects on
  // this endpoint while other surfaces ship strings. `getProductLabel`
  // expects strings, so flatten here.
  const tagStrings = (product.tags || [])
    .map((t) => (typeof t === "string" ? t : (t?.name ?? "")))
    .filter((s): s is string => !!s);
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
