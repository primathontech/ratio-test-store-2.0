"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@shopkit/cart";
import { dispatchProductViewEvent } from "./events";

/**
 * Extract the KwikEngage product payload from the heterogeneous commerce-client
 * product shape. Returns null when no product is present; returns partial data
 * otherwise — the dispatcher's mandatory-field guards drop incomplete payloads.
 */
function extractProductData(product: any) {
  if (!product || typeof product !== "object") {
    return null;
  }

  return {
    product_id: product.id,
    name: product.title,
    handle: product.handle,
    image_url: product.image?.url,
    price: product.price,
    variant_id: product.variants?.[0]?.id,
  };
}

interface KwikPassProductViewProps {
  /**
   * Product object returned by the commerce client
   * (the same shape passed to `<AppProductTracker product={...} />`).
   */
  product: any;
}

/**
 * Fires `page_view_kp` (type: "product") on mount and on every SPA navigation
 * to a different product. Mount in the product page server component alongside
 * `<AppProductTracker>` — the product prop carries server-fetched data so the
 * mandatory fields (product_id, name, image_url, price) are already populated.
 */
export default function KwikPassProductView({
  product,
}: KwikPassProductViewProps) {
  const pathname = usePathname();
  const { cartToken } = useCartStore();

  useEffect(() => {
    const data = extractProductData(product);

    if (!data || !cartToken) {
      return;
    }
    dispatchProductViewEvent({
      cart_id: cartToken,
      ...data,
    });
  }, [pathname, product, cartToken]);

  return null;
}
