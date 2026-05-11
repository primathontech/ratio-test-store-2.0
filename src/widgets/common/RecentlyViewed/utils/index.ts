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
