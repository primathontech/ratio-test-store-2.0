import { getCommerceClient } from "@/config/commerce";

/**
 * Fetches products from the "bestseller" collection using the shopkit typed
 * `getCollectionsByHandles` method. Auth (`gk-merchant-id`, storeId, etc.) is
 * auto-injected by the commerce client from @/config/commerce.
 *
 * Used for: pre-search recommended products strip, no-results bestseller fallback.
 */
export async function fetchMostLovedProducts(productLimit: number = 12) {
  try {
    const client = getCommerceClient();
    const response = await client.getCollectionsByHandles({
      handles: ["bestseller"],
      productLimit,
    });

    if (!response.success) {
      throw new Error(
        response.message || "Failed to fetch bestseller collection"
      );
    }

    // Shopkit's custom adapter normalises each collection into a wrapper:
    //   { handle, data: <raw collection with products>, meta, success, message }
    // So the products live at `entry.data.products`, NOT `entry.products`.
    // We still handle a couple of fallback shapes defensively.
    type RawCollection = {
      handle?: string;
      products?: unknown[];
      title?: string;
    };
    type NormalisedEntry = {
      handle?: string;
      data?: RawCollection;
      products?: unknown[]; // fallback if shape ever changes
    };
    const rawData = response.data as
      | NormalisedEntry[]
      | { collections?: NormalisedEntry[] }
      | null;
    const entries: NormalisedEntry[] = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.collections)
        ? (rawData!.collections as NormalisedEntry[])
        : [];

    const bestsellerEntry =
      entries.find((c) => c?.handle === "bestseller") ?? entries[0];

    // Prefer the normalised `.data.products`; fall back to `.products` just in case.
    const products: unknown[] = Array.isArray(bestsellerEntry?.data?.products)
      ? (bestsellerEntry!.data!.products as unknown[])
      : Array.isArray(bestsellerEntry?.products)
        ? (bestsellerEntry!.products as unknown[])
        : [];
    return {
      products,
      totalHits: products.length,
      collectionHandle: bestsellerEntry?.handle ?? "bestseller",
      productLimit,
    };
  } catch (error) {
    console.error("[search-api] fetchMostLovedProducts failed:", error);
    return {
      products: [],
      totalHits: 0,
      collectionHandle: "bestseller",
      productLimit,
    };
  }
}

export async function getMostLovedProductsForComponent(
  productLimit: number = 12
) {
  return fetchMostLovedProducts(productLimit);
}
