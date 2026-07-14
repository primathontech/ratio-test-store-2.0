import { paiseToRupees } from "@/utils/apiTransforms";

export interface SearchProduct {
  id: string;
  handle: string;
  title: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  image_url?: string;
  images?: Array<{
    url: string;
    is_main: boolean;
    alt?: string;
  }>;
  product_availability?: boolean;
  availableForSale?: boolean;
  // Optional structured attributes — surfaced when the search backend returns them
  // (Shopify-shaped). Read defensively across the common field-name variants so the
  // pipeline is attribute-ready per merchant without any per-merchant code.
  product_type?: string;
  productType?: string;
  vendor?: string;
  brand?: string;
  tags?: Array<string | { name?: string }> | string;
  variants?: Array<{
    id: string;
    title: string;
    sku: string;
    quantityAvailable: number;
    availableForSale: boolean;
    price: { amount: number; currencyCode: string };
    compareAtPrice?: { amount: number; currencyCode: string };
    image?: { url: string | null; altText: string | null };
    option_values?: string[];
    options?: string[];
    selectedOptions?: Array<{ name?: string; value?: string }>;
  }>;
  average_rating?: number;
  rating_count?: number;
}

export interface TransformedProduct {
  id: string;
  handle: string;
  title: string;
  imageUrl: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  rating: number;
  reviewCount: number;
  variantId: string;
  // Optional structured attributes (present only when the backend supplies them).
  productType?: string;
  brand?: string;
  tags?: string[];
  /** Distinct variant option values (e.g. colours / sizes), for reasoning + filtering. */
  options?: string[];
  /** Short plain-text description snippet — carried for attribute matching (e.g.
   *  "sulfate-free", "vegan", ingredients), NOT sent to the model (keeps payload/
   *  token cost flat). Present only when the search backend returns a description. */
  description?: string;
}

/** Strip HTML tags + decode the common entities so description text matches cleanly
 *  (search returns rich HTML; raw tags/entities like "&amp;" break word matching). */
function stripHtml(html?: string): string {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalize a tags field that may arrive as string[], {name}[], or a CSV string. */
function normalizeTags(t: SearchProduct["tags"]): string[] {
  if (Array.isArray(t))
    return t
      .map((x) => (typeof x === "string" ? x : x?.name))
      .filter(Boolean)
      .map((s) => String(s).trim());
  if (typeof t === "string")
    return t
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

/** Collect distinct, meaningful variant option values (colours/sizes/etc.). */
function collectOptions(variants: SearchProduct["variants"]): string[] {
  if (!Array.isArray(variants)) return [];
  const out = new Set<string>();
  for (const v of variants) {
    const vals: unknown[] = Array.isArray(v.option_values)
      ? v.option_values
      : Array.isArray(v.options)
        ? v.options
        : Array.isArray(v.selectedOptions)
          ? v.selectedOptions.map((o) => o?.value)
          : [];
    for (const val of vals) {
      const s = (val == null ? "" : String(val)).trim();
      if (s && s.toLowerCase() !== "default title") out.add(s);
    }
  }
  return Array.from(out).slice(0, 12);
}

interface SearchApiResponse {
  products: SearchProduct[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    has_more: boolean;
  };
}

function transformApiProduct(apiProduct: SearchProduct): TransformedProduct {
  const firstVariant = apiProduct.variants?.[0];

  const price = firstVariant?.price?.amount
    ? paiseToRupees(firstVariant.price.amount)
    : paiseToRupees(apiProduct.price);

  const compareAtPrice = firstVariant?.compareAtPrice?.amount
    ? paiseToRupees(firstVariant.compareAtPrice.amount)
    : apiProduct.compare_at_price
      ? paiseToRupees(apiProduct.compare_at_price)
      : undefined;

  return {
    id: apiProduct.id,
    handle: apiProduct.handle,
    title: apiProduct.title,
    imageUrl:
      apiProduct.image_url ||
      apiProduct.images?.find((img) => img.is_main)?.url ||
      apiProduct.images?.[0]?.url ||
      "",
    price,
    compareAtPrice,
    available:
      firstVariant?.availableForSale ??
      apiProduct.availableForSale ??
      apiProduct.product_availability ??
      true,
    rating: apiProduct.average_rating ?? 4.5,
    reviewCount: apiProduct.rating_count ?? 0,
    variantId: firstVariant?.id || `${apiProduct.id}-variant`,
    // Structured attributes — undefined when the backend doesn't provide them, so
    // consumers simply see nothing extra (no behaviour change on a thin backend).
    brand: (apiProduct.vendor || apiProduct.brand || "").trim() || undefined,
    productType:
      (apiProduct.product_type || apiProduct.productType || "").trim() ||
      undefined,
    tags: normalizeTags(apiProduct.tags).length
      ? normalizeTags(apiProduct.tags)
      : undefined,
    options: collectOptions(apiProduct.variants).length
      ? collectOptions(apiProduct.variants)
      : undefined,
    description: stripHtml(apiProduct.description).slice(0, 500) || undefined,
  };
}

export async function searchProducts(
  query: string,
  limit: number = 50,
  page: number = 1
): Promise<{ products: TransformedProduct[]; totalCount: number }> {
  const response = await fetch("/api/v1/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      limit,
      page,
      storeId:
        process.env.NEXT_PUBLIC_STORE_ID || process.env.NEXT_PUBLIC_MERCHANT_ID,
      show_variants: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Search API failed: ${response.status}`);
  }

  const data: SearchApiResponse = await response.json();
  const transformedProducts = data.products.map(transformApiProduct);

  return {
    products: transformedProducts,
    totalCount: data.pagination?.total || transformedProducts.length,
  };
}
