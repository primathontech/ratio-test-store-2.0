"use client";

import { useEffect, useState } from "react";
import { getCommerceClient } from "@/config/commerce";

/**
 * Resolve variant titles (e.g. "Medium / Red") for order line items.
 *
 * Order line items only carry `variant_id` + `productHandle` (variant_title
 * comes back null), so we fetch the product once per handle via the commerce
 * client and map each variant id to its title. Results are cached at module
 * scope so navigating away and back does not refetch.
 *
 * Cart items may lose their handle after @shopkit/cart rehydration; pass
 * `productId` as a fallback so subtitle can still be resolved.
 */

// productHandle -> (variant_id -> title)
const handleCache = new Map<string, Record<string, string>>();
// productHandle -> subtitle (from product metadata.subtitle.value)
const subtitleCache = new Map<string, string>();
const inFlight = new Map<string, Promise<Record<string, string>>>();

// productId -> subtitle fallback when handle is unavailable
const productIdSubtitleCache = new Map<string, string>();
const productIdInFlight = new Map<string, Promise<void>>();

async function fetchVariantTitles(
  handle: string
): Promise<Record<string, string>> {
  const cached = handleCache.get(handle);
  if (cached) {
    return cached;
  }
  const existing = inFlight.get(handle);
  if (existing) {
    return existing;
  }

  const promise = (async () => {
    try {
      const res = await getCommerceClient().getProduct({ handle });
      const variants: any[] = res?.success
        ? ((res.data as any)?.variants ?? [])
        : [];
      const subtitle = res?.success
        ? (res.data as any)?.metadata?.subtitle?.value
        : undefined;
      if (typeof subtitle === "string" && subtitle) {
        subtitleCache.set(handle, subtitle);
      }
      const map: Record<string, string> = {};
      for (const v of variants) {
        if (v?.id != null && v?.title) {
          map[String(v.id)] = String(v.title);
        }
      }
      handleCache.set(handle, map);
      return map;
    } catch {
      // Cache an empty result so a failed lookup doesn't refetch or keep the
      // page spinning forever.
      handleCache.set(handle, {});
      return {};
    } finally {
      inFlight.delete(handle);
    }
  })();

  inFlight.set(handle, promise);
  return promise;
}

async function fetchSubtitleByProductId(productId: string): Promise<void> {
  if (productIdSubtitleCache.has(productId)) {
    return;
  }
  const existing = productIdInFlight.get(productId);
  if (existing) {
    return existing;
  }

  const promise = (async () => {
    try {
      const res = await getCommerceClient().getProduct({ id: productId });
      const subtitle = res?.success
        ? (res.data as any)?.metadata?.subtitle?.value
        : undefined;
      // Store empty string to mark as fetched (prevents re-fetching when no subtitle)
      productIdSubtitleCache.set(
        productId,
        typeof subtitle === "string" && subtitle ? subtitle : ""
      );
    } catch {
      productIdSubtitleCache.set(productId, "");
    } finally {
      productIdInFlight.delete(productId);
    }
  })();

  productIdInFlight.set(productId, promise);
  return promise;
}

export interface VariantTitleItem {
  variant_id: string;
  /** Product URL handle. When absent, `productId` is used as a subtitle fallback. */
  productHandle?: string;
  /** GoKwik / Shopify product ID. Used to resolve subtitle when handle is unavailable. */
  productId?: string;
}

/**
 * @returns `titles` (variant_id -> title), `subtitles` (productHandle or
 * productId -> subtitle from product metadata) and `loading`, true until every
 * handle/productId fetch has settled. Callers can gate their render on
 * `loading` so titles appear together with the rest of the content.
 */
export function useVariantTitles(items: VariantTitleItem[]): {
  titles: Record<string, string>;
  subtitles: Record<string, string>;
  loading: boolean;
} {
  const handles = Array.from(
    new Set(items.map((i) => i.productHandle).filter(Boolean))
  ) as string[];

  // Items that have no handle but do have a productId need the fallback path.
  const orphanProductIds = Array.from(
    new Set(
      items
        .filter((i) => !i.productHandle && i.productId)
        .map((i) => i.productId!)
    )
  );

  const key = [...handles, ...orphanProductIds].join("|");

  const [titles, setTitles] = useState<Record<string, string>>({});
  const [subtitles, setSubtitles] = useState<Record<string, string>>({});

  // Derived synchronously from the module cache: pending while any handle or
  // productId is unresolved. Avoids a one-frame flash between order load and
  // title/subtitle load.
  const loading =
    handles.some((h) => !handleCache.has(h)) ||
    orphanProductIds.some((id) => !productIdSubtitleCache.has(id));

  useEffect(() => {
    if (handles.length === 0 && orphanProductIds.length === 0) {
      return;
    }
    let cancelled = false;

    const handlePromises = handles.map((h) => fetchVariantTitles(h));
    const productIdPromises = orphanProductIds.map((id) =>
      fetchSubtitleByProductId(id)
    );

    Promise.allSettled([...handlePromises, ...productIdPromises]).then(() => {
      if (cancelled) {
        return;
      }

      const mergedTitles: Record<string, string> = {};
      for (const h of handles) {
        const map = handleCache.get(h);
        if (map) {
          Object.assign(mergedTitles, map);
        }
      }
      setTitles(mergedTitles);

      const mergedSubtitles: Record<string, string> = {};
      for (const h of handles) {
        const subtitle = subtitleCache.get(h);
        if (subtitle) {
          mergedSubtitles[h] = subtitle;
        }
      }
      for (const id of orphanProductIds) {
        const subtitle = productIdSubtitleCache.get(id);
        if (subtitle) {
          mergedSubtitles[id] = subtitle;
        }
      }
      setSubtitles(mergedSubtitles);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { titles, subtitles, loading };
}
