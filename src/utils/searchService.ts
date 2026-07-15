import { paiseToRupees } from "@/utils/apiTransforms";
import { searchProducts as searchStorefront } from "@/widgets/common/Search/services/search-api";
// The normalized product shape is OWNED by the voice module (so that module can be
// extracted into a standalone SDK). Re-exported here under its historical name so
// every existing importer of `TransformedProduct` from this util keeps working.
import type { VoiceProduct } from "@/ui/voice/catalog";
export type { VoiceProduct as TransformedProduct } from "@/ui/voice/catalog";

/**
 * SINGLE SOURCE OF TRUTH for voice search.
 *
 * The voice agent MUST describe the SAME products, in the SAME order, as the search
 * PAGE the shopper sees. The storefront search page renders its grid from SearchTap
 * (`NEXT_PUBLIC_SEARCH_API_URL`) via the Search widget's `searchProducts`. We reuse
 * that EXACT fetcher here — same engine, same params, same default filters
 * (inStock+onSale default true, relevance sort) — and only remap its result to the
 * voice product shape. So voice can never speak a different result set than the UI.
 *
 * WHY THIS CHANGED: voice previously proxied a DIFFERENT engine — the generic
 * product-service (`NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL` `/products/search`) — whose
 * ranking, result set, and (missing) ratings did not match the SearchTap-powered
 * page. That split-brain is why the agent described products the page didn't show,
 * and why search results carried an invented `4.5` rating (that backend returns none).
 *
 * Prices from SearchTap arrive in PAISE (minor units); we convert to rupees here so
 * the downstream "ready-to-speak" ₹ string (built from this number) is never 100× off.
 */

// A product as returned by the storefront Search widget's `searchProducts` transform
// (src/widgets/common/Search/services/search-api.ts). Only the fields voice needs.
interface StorefrontSearchProduct {
  id: string;
  title: string;
  handle: string;
  productType?: string;
  image?: string;
  images?: Array<{ url?: string; is_main?: boolean } | string>;
  price: number; // PAISE
  compareAtPrice?: number | null; // PAISE
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  isInStock?: boolean;
  variantId?: string;
  variant?: { id?: string };
  tags?: string[];
}

/** URL of an image object across the common key variants (`url`/`src`/`imageUrl`). */
function imageObjUrl(i: unknown): string {
  if (!i || typeof i !== "object") {
    return "";
  }
  const o = i as { url?: unknown; src?: unknown; imageUrl?: unknown };
  const u = o.url ?? o.src ?? o.imageUrl;
  return typeof u === "string" ? u : "";
}

/** First usable image URL, tolerating the widget's `image` string and raw `images`
 *  (objects keyed by url/src/imageUrl, or bare strings), preferring the main image. */
function firstImageUrl(p: StorefrontSearchProduct): string {
  if (typeof p.image === "string" && p.image) {
    return p.image;
  }
  const imgs = p.images;
  if (Array.isArray(imgs)) {
    const main = imgs.find(
      (i) => i && typeof i === "object" && (i as { is_main?: boolean }).is_main
    );
    const mainUrl = imageObjUrl(main);
    if (mainUrl) {
      return mainUrl;
    }
    for (const i of imgs) {
      if (typeof i === "string" && i) {
        return i;
      }
      const u = imageObjUrl(i);
      if (u) {
        return u;
      }
    }
  }
  return "";
}

/** Map a storefront search product → the voice working-set shape (`VoiceProduct`).
 *
 * TRADE-OFF (intentional): the storefront search transform does NOT expose `brand`,
 * a full `options` list, or a `description`, so search-sourced products carry none of
 * them (the old product-service path did). Attribute reasoning on SEARCH results
 * (refine_results / compare_products) therefore falls back to title + productType +
 * tags — which SearchTap populates richly — instead of free-text description / option
 * matching. Collection- and PDP-sourced products (their own routes) are unaffected.
 * Guaranteed UI parity is worth this; enrich from the raw SearchTap payload later if
 * description/option matching on search results proves necessary. */
function mapStorefrontProduct(p: StorefrontSearchProduct): VoiceProduct {
  const price = paiseToRupees(p.price);
  const compareAtPrice =
    p.compareAtPrice != null ? paiseToRupees(p.compareAtPrice) : undefined;
  return {
    id: String(p.id),
    handle: String(p.handle ?? ""),
    title: String(p.title ?? ""),
    imageUrl: firstImageUrl(p),
    price,
    compareAtPrice,
    available: p.inStock ?? p.isInStock ?? true,
    // REAL rating from SearchTap (0 when the product has none) — never an invented 4.5.
    rating: Number(p.rating) || 0,
    reviewCount: Number(p.reviewsCount) || 0,
    variantId: p.variantId || p.variant?.id || `${p.id}-variant`,
    productType: (p.productType || "").trim() || undefined,
    tags:
      Array.isArray(p.tags) && p.tags.length ? p.tags.map(String) : undefined,
  };
}

export async function searchProducts(
  query: string,
  limit: number = 24,
  page: number = 1
): Promise<{ products: VoiceProduct[]; totalCount: number }> {
  // Same fetcher + same defaults as the search PAGE, so the working set matches the
  // rendered grid. The widget's `searchProducts` THROWS on a real backend failure —
  // we let it propagate so runTool's health tracker can degrade honestly (rather than
  // masquerade an outage as "no results").
  const result = await searchStorefront(query, { page, limit });
  const raw = Array.isArray(result?.products)
    ? (result.products as StorefrontSearchProduct[])
    : [];
  const products = raw.map(mapStorefrontProduct);
  return {
    products,
    totalCount: Number(result?.totalHits) || products.length,
  };
}
