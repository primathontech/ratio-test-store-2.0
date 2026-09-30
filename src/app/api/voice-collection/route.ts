/**
 * Voice collection PRODUCTS — the retrieval source that lets the agent act on the
 * products a shopper can already SEE on a collection page, instead of navigating
 * away to search for them again.
 *
 * The bug this fixes: the agent's working set is only ever filled by search. When
 * a shopper is on a collection page (landed there themselves, or the agent opened
 * it) and says "open the Argan shampoo" / "add this", the agent had no loaded
 * products to reference, so it fell back to a fresh search → an extra hop to the
 * search page. This route returns the collection's products in the SAME slim card
 * shape the search pipeline produces (`TransformedProduct`), so both the tool
 * layer (navigate_to_collection / on-screen fallback) and the passive page-context
 * seed can populate the working set directly — no re-search, no extra navigation.
 *
 * Reuses the storefront's own `collectionApiClient.fetchCollection` (the exact
 * Data-Cache-backed path the collection PAGE renders from), then remaps to the
 * voice card shape. Prices arrive in PAISE (the storefront divides by 100 to
 * render), so we convert with minorToMajor (the voice module's own helper) —
 * to guarantee the agent never quotes a 100× price.
 *
 * Same-origin, guarded (origin + per-IP rate limit) like the other voice routes.
 */

import { collectionApiClient } from "@/widgets/common/CollectionPage/api/client";
import { voiceGuard } from "@/lib/voiceGuard";
import { formatMoney, minorToMajor } from "@/ui/voice/money";

// Match the voice working-set size (voiceConfig.limits.workingSetSize default 24)
// so "the tenth one" / a later filter has enough to work with, without over-fetching.
const FIRST = 24;

export async function GET(req: Request) {
  const blocked = voiceGuard(req, "read", 150);
  if (blocked) return blocked;

  const handle = (new URL(req.url).searchParams.get("handle") || "").trim();
  if (!handle) {
    return Response.json({ products: [] });
  }

  try {
    const col = await collectionApiClient.fetchCollection(handle, {
      first: FIRST,
    });
    const products = (col.products ?? []).map((p) => {
      const imageUrl =
        p.images?.find((i) => i.is_main)?.url || p.images?.[0]?.url || "";
      // Prefer the REAL variant id; else a synthetic placeholder the cart WRITE
      // path (add_to_cart → prepareForCart) re-resolves against product detail.
      const variantId =
        p.variant?.id != null ? String(p.variant.id) : `${p.id}-variant`;
      const priceRupees = minorToMajor(p.price);
      const compareRupees =
        p.compareAtPrice != null ? minorToMajor(p.compareAtPrice) : undefined;
      return {
        id: p.id,
        handle: p.handle,
        title: p.title,
        imageUrl,
        price: priceRupees, // paise → rupees (never 100× the price)
        compareAtPrice: compareRupees,
        // Ready-to-speak strings with the ₹ symbol baked in (deterministic — the
        // model reads these verbatim instead of currency-tagging a bare number).
        // Omit the spoken price when it's unknown (0 = null-variant combo etc.) so the
        // agent never announces a real product as "₹0"; add_to_cart re-resolves the
        // true variant price from product detail before adding.
        price_display: priceRupees > 0 ? formatMoney(priceRupees) : null,
        compare_at_display: formatMoney(compareRupees),
        // Trust availableForSale; else infer from quantity; else default in-stock
        // (unknown stock must not wrongly hide a product). add_to_cart re-verifies
        // the authoritative stock before any cart write.
        available: p.availableForSale ?? (p.availableQuantity ?? 1) > 0,
        rating: Number(p.average_rating) || 0,
        reviewCount: Number(p.rating_count) || 0,
        variantId,
        productType: p.productType || undefined,
        tags:
          Array.isArray(p.tags) && p.tags.length
            ? p.tags.slice(0, 8)
            : undefined,
      };
    });
    return Response.json({ handle, title: col.title, products });
  } catch {
    // Graceful: the agent still has search as a fallback. Never echo the upstream
    // error to the client.
    return Response.json({ products: [] });
  }
}
