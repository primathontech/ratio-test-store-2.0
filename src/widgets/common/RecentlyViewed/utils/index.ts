import type { ProductCardProduct } from "@/ui/components/ProductCard/types";

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
  average_rating?: string | number;
  rating_count?: string | number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

/**
 * POST /api/v1/product/details — returns product details for the given IDs.
 * Returns an empty array on any error.
 */
export async function fetchProductDetails(
  productIds: string[]
): Promise<ApiRecentProduct[]> {
  if (productIds.length === 0) {
    return [];
  }
  try {
    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(`${API_BASE_URL}/api/v1/product/details`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "gk-merchant-id": MERCHANT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productIds }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data?.products)) {
      return data.products;
    }
    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
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
    badge: readMetadataValue(product.metadata, "product_labels"),
    rating: Number.isFinite(ratingNum) ? ratingNum : 0,
    reviewCount: Number.isFinite(reviewNum) ? reviewNum : 0,
    salePrice,
    originalPrice,
    discount,
    weight: readMetadataValue(product.metadata, "product_net_content"),
    description: readMetadataValue(product.metadata, "product_subtitle"),
  };
}
