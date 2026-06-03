"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@shopkit/cart";
import { dispatchCollectionViewEvent } from "./events";

function extractCollectionData(collection: any) {
  if (!collection || typeof collection !== "object") {
    return null;
  }

  return {
    collection_id: collection.id,
    name: collection.title,
    handle: collection.handle,
    image_url: collection.image_url,
  };
}

interface KwikPassCollectionViewProps {
  /**
   * Collection object returned by the commerce client.
   */
  collection: any;
}

/**
 * Fires `page_view_kp` (type: "collection") on mount and on every SPA
 * navigation to a different collection. Mount in the collection page server
 * component so the prop carries server-fetched data.
 */
export default function KwikPassCollectionView({
  collection,
}: KwikPassCollectionViewProps) {
  const pathname = usePathname();
  const { cartToken } = useCartStore();

  useEffect(() => {
    const data = extractCollectionData(collection);

    if (!data || !cartToken) {
      return;
    }

    dispatchCollectionViewEvent({
      cart_id: cartToken,
      ...data,
    });
  }, [pathname, collection, cartToken]);

  return null;
}
