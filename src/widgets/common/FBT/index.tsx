"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCartStore, type CartItem } from "@shopkit/cart";
import { useResponsive } from "@/hooks";
import { getCommerceClient } from "@/config/commerce";

type ProductData = { id?: string | number };
type ProductResponse = { data?: ProductData };
type Props = {
  data?: ProductData | ProductResponse;
  settings?: { title?: string };
};

type ProductBundler = {
  initStandaloneFromLookup?: (
    containerId: string,
    config: {
      merchantId?: string;
      backendType?: string;
      externalApiUrl?: string;
    },
    sourceId?: string | null,
  ) => void | (() => void);
};

type SelectedItem = {
  id: string;
  variants?: Array<{ id: string; availableForSale: boolean }>;
};

type CartItemWithGid = CartItem & { productGid?: string; product_id?: string };

const isProductResponse = (
  input: ProductData | ProductResponse,
): input is ProductResponse => "data" in input;

const loadSDK = (url?: string) =>
  new Promise<void>((resolve, reject) => {
    const PB = (window as Window & { ProductBundler?: ProductBundler })
      .ProductBundler;
    if (PB) {
      return resolve();
    }
    if (!url) {
      return reject(new Error("SDK URL missing"));
    }
    const s = document.createElement("script");
    s.src = url;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("SDK script failed to load"));
    document.head.appendChild(s);
  });

const toProductGid = (raw: string | number) =>
  typeof raw === "string" && raw.startsWith("gid://")
    ? raw
    : `gid://shopify/Product/${raw}`;

const CardSkeleton = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-3">
    <div className="h-40 w-full rounded-xl bg-[#f3f3f3] animate-pulse" />
    <div className="mt-3 h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
    <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
    <div className="mt-3 flex h-10 w-full items-center justify-center rounded-xl border border-gray-300 bg-white">
      <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
    </div>
  </div>
);

const FBT = ({ data }: Props) => {
  const sdkUrl = process.env.NEXT_PUBLIC_SDK_URL;
  const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE || "shopify";
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID_SDK;

  const pathname = usePathname();
  const { items, openCart, addItems } = useCartStore();
  const { isMobile, isTablet } = useResponsive();

  const [sdkLoading, setSdkLoading] = useState(true);
  const [productFound, setProductFound] = useState(true);
  const [collectionId, setCollectionId] = useState<string | null>(null);

  const collectionHandle = useMemo(() => {
    const m = pathname?.match(/^\/collections\/([^/]+)/i);
    return m ? decodeURIComponent(m[1]) : null;
  }, [pathname]);

  const productId = useMemo(() => {
    if (!data) {
      return null;
    }
    if (isProductResponse(data)) {
      const id = data.data?.id;
      return id !== null && id !== undefined ? String(id) : null;
    }
    const id = data.id;
    return id !== null && id !== undefined ? String(id) : null;
  }, [data]);

  const sourceId = useMemo(() => {
    if (collectionId) {
      return collectionId;
    }
    if (productId === null || productId === undefined) {
      return null;
    }
    return String(productId);
  }, [collectionId, productId]);

  const itemsRef = useRef<CartItemWithGid[]>(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!sourceId) {
      setProductFound(false);
      setSdkLoading(false);
      return;
    }

    setProductFound(true);
    setSdkLoading(true);
  }, [sourceId]);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!collectionHandle) {
        setCollectionId(null);
        return;
      }
      try {
        const client = getCommerceClient();
        const response = await client.getCollection({ handle: collectionHandle });
        if (!alive) {
          return;
        }
        if (response.success && response.data) {
          setCollectionId((response.data as any)?.id ?? null);
        } else {
          setCollectionId(null);
        }
      } catch {
        if (alive) {
          setCollectionId(null);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [collectionHandle]);

  useEffect(() => {
    let unmount: null | (() => void) = null;

    if (!sourceId || !productFound) {
      return () => undefined;
    }

    loadSDK(sdkUrl)
      .then(() => {
        const PB = (window as Window & { ProductBundler?: ProductBundler })
          .ProductBundler;
        if (!PB?.initStandaloneFromLookup) {
          // eslint-disable-next-line no-console
          console.error("ProductBundler.initStandaloneFromLookup missing");
          return;
        }
        const maybeUnmount = PB.initStandaloneFromLookup(
          "fbt-container-shopify",
          {
            merchantId,
            backendType,
            externalApiUrl: process.env.NEXT_PUBLIC_BUNDLE_API_BASE_URL,
          },
          sourceId,
        );
        unmount = typeof maybeUnmount === "function" ? maybeUnmount : null;
      })
      // eslint-disable-next-line no-console
      .catch(console.error);

    return () => {
      try {
        unmount?.();
      } catch {
        // eslint-disable-next-line no-console
        console.error("Error");
      }
    };
  }, [merchantId, backendType, sourceId, sdkUrl, productFound]);

  useEffect(() => {
    if (!sourceId || !productFound) {
      return;
    }

    const el = document.getElementById("fbt-container-shopify");
    if (!el) {
      return;
    }

    const check = () => {
      if (el.childElementCount > 0) {
        setSdkLoading(false);
      }
    };

    check();

    const obs = new MutationObserver(check);
    obs.observe(el, { childList: true, subtree: true });

    return () => obs.disconnect();
  }, [sourceId, productFound]);

  const currentCartGids = useCallback(
    () =>
      itemsRef.current.map((ci) => {
        const productId =
          ci.productGid ?? ci.productId ?? ci.product_id ?? ci.id;
        return toProductGid(productId);
      }),
    [],
  );

  useEffect(() => {
    const onSnapshotRequest = () => {
      window.dispatchEvent(
        new CustomEvent("cart:snapshot", {
          detail: { ids: currentCartGids() },
        }),
      );
    };

    const onAdd = async (e: Event) => {
      const { selectedItems } = (
        e as CustomEvent<{ selectedItems: SelectedItem[] }>
      ).detail;

      const cartSet = new Set(currentCartGids());
      const toAdd = selectedItems.filter((p) => !cartSet.has(p.id));

      try {
        if (toAdd.length > 0) {
          const payload = toAdd.map((p) => {
            const v =
              p.variants?.find((x) => x.availableForSale) || p.variants?.[0];
            return { productId: p.id, variantId: v?.id || "", quantity: 1 };
          });

          await addItems(payload);
          toAdd.forEach((p) =>
            window.dispatchEvent(
              new CustomEvent("cart:item:added", { detail: { id: p.id } }),
            ),
          );
        }

        window.dispatchEvent(
          new CustomEvent("fbtAddToHandler:success", {
            detail: { ok: true, selectedItems, count: selectedItems.length },
          }),
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("addItem failed", err);
        window.dispatchEvent(
          new CustomEvent("fbtAddToHandler:success", {
            detail: { ok: false, error: String(err) },
          }),
        );
      }
    };

    const onOpenCartRequest = () => {
      void openCart();
    };

    const handleCheckBundleExist = () => {
      setProductFound(false);
      setSdkLoading(false);
    };

    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("cart:open:request", onOpenCartRequest);
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("cart:snapshot:request", onSnapshotRequest);
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("fbtAddToHandler", onAdd);
    // eslint-disable-next-line no-restricted-syntax
    window.addEventListener("no_bundle_found", handleCheckBundleExist);

    window.dispatchEvent(
      new CustomEvent("cart:snapshot", { detail: { ids: currentCartGids() } }),
    );

    return () => {
      window.removeEventListener("cart:snapshot:request", onSnapshotRequest);
      window.removeEventListener("fbtAddToHandler", onAdd);
      window.removeEventListener("cart:open:request", onOpenCartRequest);
      window.removeEventListener("no_bundle_found", handleCheckBundleExist);
    };
  }, [addItems, currentCartGids, openCart]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("cart:snapshot", { detail: { ids: currentCartGids() } }),
    );
  }, [currentCartGids, items]);

  // Default responsive padding values - controlled from component
  const getResponsivePadding = (): {
    paddingTop: string;
    paddingRight: string;
    paddingBottom: string;
    paddingLeft: string;
  } => {
    let padding: { top: number; right: number; bottom: number; left: number };

    if (isMobile) {
      padding = { top: 0, right: 0, bottom: 0, left: 10 };
    } else if (isTablet) {
      padding = { top: 12, right: 0, bottom: 12, left: 10 };
    } else {
      // desktop
      padding = { top: 68, right: 100, bottom: 40, left: 100 };
    }

    return {
      paddingTop: `${padding.top}px`,
      paddingRight: `${padding.right}px`,
      paddingBottom: `${padding.bottom}px`,
      paddingLeft: `${padding.left}px`,
    };
  };

  const containerStyle = getResponsivePadding();

  if (!productFound) {
    return null;
  }

  return (
    <>
      <div className="bg-[#F4F6F8] pb-4 pt-4 mb-6">
        <div
          className="mx-auto bg-white rounded-3xl overflow-hidden"
          style={containerStyle}
        >
          <div className="relative px-4 pb-6">
            {sdkLoading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            )}
            <div
              id="fbt-container-shopify"
              className={`min-h-[240px] overflow-auto ${
                sdkLoading ? "hidden" : ""
              }`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export { FBT };
export default FBT;
