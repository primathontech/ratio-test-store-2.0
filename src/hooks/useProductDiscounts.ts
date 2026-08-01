"use client";

import { useState, useEffect } from "react";
import { getCommerceClient } from "@/config/commerce";
import type { Offer } from "@/widgets/nintarababy/ProductMain/types";

const DISCOUNT_API_URL = process.env.NEXT_PUBLIC_PRODUCT_PAGE_DISCOUNT_URL;
const PRODUCT_API_BASE = (process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL || "")
  .trim()
  .replace(/\/api\/v\d+\/?$/i, "");
const STORE_ID =
  process.env.NEXT_PUBLIC_STORE_ID || process.env.NEXT_PUBLIC_MERCHANT_ID || "";
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

interface Args {
  handle: string;
  /** Optional — if provided from ISR data, skips the product-by-handle fetch */
  productId?: string;
  variantId?: string;
}

/**
 * Fetch product-page discounts client-side (post-ISR).
 *
 * Page is built with ISR so productId/variantId are already known at render
 * time — pass them in to skip the admin product fetch. collectionIds are
 * not in the ISR payload, so when productId/variantId are supplied but we
 * still need collectionIds, we fetch the admin product once to get them.
 */
export function useProductDiscounts({ handle, productId, variantId }: Args) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!handle) {
      return;
    }
    if (!DISCOUNT_API_URL) {
      console.warn(
        "[useProductDiscounts] NEXT_PUBLIC_PRODUCT_PAGE_DISCOUNT_URL not set"
      );
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        let pid = productId;
        let vid = variantId;
        let collectionIds: string[] = [];

        // Always need collection_ids; admin fetch also provides ids if missing.
        const productUrl = `${PRODUCT_API_BASE}/api/v1/admin/products/handle/${handle}?storeId=${STORE_ID}`;
        const productRes = await fetch(productUrl, {
          method: "GET",
          headers: {
            accept: "application/json",
            "gk-merchant-id": MERCHANT_ID,
          },
          signal: controller.signal,
        });

        if (!productRes.ok) {
          return;
        }
        const productData = await productRes.json();
        const product = productData?.product;
        if (!product) {
          return;
        }

        pid = pid || String(product.id ?? "");
        vid = vid || String(product.variants?.[0]?.id ?? "");
        collectionIds = product.collectionIds || [];

        if (!pid || !vid) {
          return;
        }

        const client = getCommerceClient();
        const discountRes = await client.fetchRequest({
          url: DISCOUNT_API_URL!,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "gk-merchant-id": MERCHANT_ID,
          },
          body: JSON.stringify({
            product_id: pid,
            variant_id: vid,
            collection_ids: collectionIds,
          }),
        });

        if (cancelled) {
          return;
        }

        if (discountRes.success) {
          const discounts =
            (discountRes.data as any)?.data?.applicable_discounts ?? [];
          console.log("[useProductDiscounts] discounts for", handle, discounts);
          setOffers(
            discounts.map((d: any) => ({
              code: d.code,
              description: d.description || d.title,
            }))
          );
        }
      } catch (err) {
        if ((err as any)?.name === "AbortError") {
          return;
        }
        console.warn("[useProductDiscounts] failed", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [handle, productId, variantId]);

  return { offers, loading };
}
