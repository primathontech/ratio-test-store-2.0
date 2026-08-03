"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@shopkit/cart";
import { useResponsive } from "@/hooks/useResponsive";
import type { FBTProps, FBTData, FBTProductResponse } from "../types";

declare global {
  interface Window {
    ProductBundler?: {
      initStandaloneFromLookup: (
        containerId: string,
        config: {
          merchantId?: string;
          backendType?: string;
          externalApiUrl?: string;
        },
        sourceId: string
      ) => undefined | (() => void);
    };
  }
}

const SDK_URL = process.env.NEXT_PUBLIC_SDK_URL || "";
const BACKEND_TYPE = process.env.NEXT_PUBLIC_BACKEND_TYPE || "openstore";
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID_SDK || "";
const BUNDLE_API_BASE_URL = process.env.NEXT_PUBLIC_BUNDLE_API_BASE_URL || "";

const CONTAINER_ID = "fbt-container-shopify";

let sdkLoadPromise: Promise<void> | null = null;

function loadSdkOnce(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (window.ProductBundler) {
    return Promise.resolve();
  }
  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }
  if (!SDK_URL) {
    return Promise.reject(new Error("NEXT_PUBLIC_SDK_URL not set"));
  }

  sdkLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SDK_URL}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load ProductBundler SDK"))
      );
      return;
    }
    // ProductBundler SDK must be injected at runtime after sourceId resolves;
    // next/script can't gate the load on that, and the SDK exposes itself on
    // `window.ProductBundler`.
    // eslint-disable-next-line no-restricted-syntax
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      sdkLoadPromise = null;
      reject(new Error("Failed to load ProductBundler SDK"));
    };
    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

function toProductGid(raw: string | number | undefined | null): string | null {
  if (raw === undefined || raw === null || raw === "") {
    return null;
  }
  const s = String(raw);
  if (s.startsWith("gid://")) {
    return s;
  }
  return `gid://shopify/Product/${s}`;
}

function resolveIdFromData(data?: FBTData): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }
  // Prefer a direct `id` on the product object (the builder injects the raw
  // product as `data`). Fall back to `data.data.id` only when the outer
  // object is a wrapper response with no id of its own.
  const direct = (data as { id?: string | number }).id;
  if (direct !== undefined && direct !== null && direct !== "") {
    return String(direct);
  }
  const nested = (data as FBTProductResponse).data?.id;
  if (nested !== undefined && nested !== null && nested !== "") {
    return String(nested);
  }
  return null;
}

function currentCartGidsFrom(items: any[]): string[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .map((it) =>
      toProductGid(
        it?.productGid ?? it?.productId ?? it?.product_id ?? it?.id ?? null
      )
    )
    .filter((g): g is string => typeof g === "string" && g.length > 0);
}

const CardSkeleton: React.FC = () => (
  <div className="rounded-xl border border-gray-200 p-4 bg-white animate-pulse">
    <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
    <div className="flex items-center gap-2">
      <div className="h-8 bg-gray-200 rounded flex-1" />
      <div className="h-8 w-8 bg-gray-200 rounded" />
    </div>
  </div>
);

export const V1: React.FC<FBTProps> = ({ data }) => {
  const pathname = usePathname();
  const { isMobile, isTablet } = useResponsive();

  const cartStore = useCartStore() as any;
  const items = cartStore?.items as any[] | undefined;
  const openCart = cartStore?.openCart as (() => void) | undefined;
  const addItem = cartStore?.addItem as
    | ((item: any) => Promise<void> | void)
    | undefined;
  const addItemsFn = cartStore?.addItems as
    | ((items: any[]) => Promise<void> | void)
    | undefined;

  const itemsRef = useRef<any[]>(items || []);
  useEffect(() => {
    itemsRef.current = items || [];
  }, [items]);

  const [sourceId, setSourceId] = useState<string | null>(null);
  const [productFound, setProductFound] = useState<boolean>(true);
  const [sdkLoading, setSdkLoading] = useState<boolean>(true);

  // Resolve sourceId
  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      try {
        const collectionMatch = pathname?.match(/\/collections\/([^/?#]+)/);
        if (collectionMatch) {
          const handle = collectionMatch[1];
          // On collection pages we must translate the URL handle to an id at
          // runtime; no dataSource carries the collection id here.
          // eslint-disable-next-line no-restricted-syntax
          const res = await fetch(
            `/api/v1/collection?handle=${encodeURIComponent(handle)}`
          );
          if (!res.ok) {
            throw new Error(`collection lookup failed: ${res.status}`);
          }
          const json = await res.json();
          const id = json?.collection?.id;
          if (cancelled) {
            return;
          }
          if (id === undefined || id === null || id === "") {
            setProductFound(false);
            setSdkLoading(false);
            setSourceId(null);
            return;
          }
          setSourceId(String(id));
          return;
        }
        const fromData = resolveIdFromData(data);
        if (cancelled) {
          return;
        }
        if (!fromData) {
          setProductFound(false);
          setSdkLoading(false);
          setSourceId(null);
          return;
        }
        setSourceId(fromData);
      } catch (err) {
        if (cancelled) {
          return;
        }
        setProductFound(false);
        setSdkLoading(false);
        setSourceId(null);
      }
    };

    resolve();
    return () => {
      cancelled = true;
    };
  }, [pathname, data]);

  // Load SDK + init once we have a sourceId
  useEffect(() => {
    if (!sourceId) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      try {
        await loadSdkOnce();
        if (cancelled) {
          return;
        }
        if (!window.ProductBundler?.initStandaloneFromLookup) {
          setProductFound(false);
          setSdkLoading(false);
          return;
        }
        const maybeCleanup = window.ProductBundler.initStandaloneFromLookup(
          CONTAINER_ID,
          {
            merchantId: MERCHANT_ID,
            backendType: BACKEND_TYPE,
            externalApiUrl: BUNDLE_API_BASE_URL,
          },
          sourceId
        );
        if (typeof maybeCleanup === "function") {
          cleanup = maybeCleanup;
        }

        window.dispatchEvent(
          new CustomEvent("metaDataOrDescription", {
            detail: { ok: true, metaData: "/" },
          })
        );
      } catch (err) {
        if (!cancelled) {
          setProductFound(false);
          setSdkLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        cleanup?.();
      } catch {
        /* ignore */
      }
    };
  }, [sourceId]);

  // MutationObserver on container — when children appear, hide skeleton
  useEffect(() => {
    if (!sourceId) {
      return;
    }
    const el = document.getElementById(CONTAINER_ID);
    if (!el) {
      return;
    }

    if (el.children.length > 0) {
      setSdkLoading(false);
      return;
    }
    const observer = new MutationObserver(() => {
      if (el.children.length > 0) {
        setSdkLoading(false);
      }
    });
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [sourceId]);

  // Window events
  useEffect(() => {
    if (!sourceId) {
      return;
    }

    const dispatchSnapshot = () => {
      window.dispatchEvent(
        new CustomEvent("cart:snapshot", {
          detail: { ids: currentCartGidsFrom(itemsRef.current) },
        })
      );
    };

    const onOpenRequest = () => {
      try {
        openCart?.();
      } catch {
        /* ignore */
      }
    };

    const onSnapshotRequest = () => dispatchSnapshot();

    const onFbtAddTo = async (evt: Event) => {
      try {
        const detail = (evt as CustomEvent).detail || {};
        const selectedItems: any[] = Array.isArray(detail.selectedItems)
          ? detail.selectedItems
          : [];
        const existingGids = new Set(currentCartGidsFrom(itemsRef.current));

        const toAdd = selectedItems
          .map((sel) => {
            const productRaw =
              sel?.productId ?? sel?.product_id ?? sel?.id ?? null;
            const productGid = toProductGid(productRaw);
            if (!productGid || existingGids.has(productGid)) {
              return null;
            }

            const variants: any[] = Array.isArray(sel?.variants)
              ? sel.variants
              : [];
            const firstAvailable = variants.find(
              (v) => v && v.availableForSale === true
            );
            const chosenVariant = firstAvailable || variants[0] || null;
            const variantId =
              chosenVariant?.id ?? sel?.variantId ?? sel?.variant_id ?? null;

            return {
              productId: productRaw,
              variantId,
              quantity: Number(sel?.quantity) > 0 ? Number(sel.quantity) : 1,
              productGid,
              selected: sel,
            };
          })
          .filter(Boolean) as Array<{
          productId: any;
          variantId: any;
          quantity: number;
          productGid: string;
          selected: any;
        }>;

        if (toAdd.length > 0) {
          if (typeof addItemsFn === "function") {
            await addItemsFn(
              toAdd.map((it) => ({
                productId: it.productId,
                variantId: it.variantId,
                quantity: it.quantity,
              }))
            );
          } else if (typeof addItem === "function") {
            for (const it of toAdd) {
              await addItem({
                id: it.variantId,
                productId: it.productId,
                variantId: it.variantId,
                quantity: it.quantity,
              });
            }
          }

          for (const it of toAdd) {
            window.dispatchEvent(
              new CustomEvent("cart:item:added", {
                detail: { productGid: it.productGid, selected: it.selected },
              })
            );
          }
        }

        window.dispatchEvent(
          new CustomEvent("fbtAddToHandler:success", {
            detail: {
              ok: true,
              selectedItems,
              count: toAdd.length,
            },
          })
        );
        window.dispatchEvent(
          new CustomEvent("metaDataOrDescription", {
            detail: { ok: true, metaData: "/" },
          })
        );
      } catch (error) {
        window.dispatchEvent(
          new CustomEvent("fbtAddToHandler:success", {
            detail: {
              ok: false,
              error: error instanceof Error ? error.message : "fbt add failed",
            },
          })
        );
      }
    };

    const onNoBundleFound = () => {
      setProductFound(false);
      setSdkLoading(false);
    };

    window.addEventListener(
      "cart:open:request",
      onOpenRequest as EventListener
    );
    window.addEventListener(
      "cart:snapshot:request",
      onSnapshotRequest as EventListener
    );
    window.addEventListener("fbtAddToHandler", onFbtAddTo as EventListener);
    window.addEventListener(
      "no_bundle_found",
      onNoBundleFound as EventListener
    );

    dispatchSnapshot();

    return () => {
      window.removeEventListener(
        "cart:open:request",
        onOpenRequest as EventListener
      );
      window.removeEventListener(
        "cart:snapshot:request",
        onSnapshotRequest as EventListener
      );
      window.removeEventListener(
        "fbtAddToHandler",
        onFbtAddTo as EventListener
      );
      window.removeEventListener(
        "no_bundle_found",
        onNoBundleFound as EventListener
      );
    };
  }, [sourceId, openCart, addItem, addItemsFn]);

  // Re-snapshot whenever cart items change
  useEffect(() => {
    if (!sourceId) {
      return;
    }
    window.dispatchEvent(
      new CustomEvent("cart:snapshot", {
        detail: { ids: currentCartGidsFrom(items || []) },
      })
    );
  }, [items, sourceId]);

  const containerStyle = useMemo<React.CSSProperties>(() => {
    if (isMobile) {
      return {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 10,
      };
    }
    if (isTablet) {
      return {
        paddingTop: 12,
        paddingRight: 0,
        paddingBottom: 12,
        paddingLeft: 10,
      };
    }
    return {
      paddingTop: 68,
      paddingRight: 100,
      paddingBottom: 0,
      paddingLeft: 100,
    };
  }, [isMobile, isTablet]);

  if (productFound === false) {
    return null;
  }
  if (!sourceId) {
    return null;
  }

  return (
    <div className="bg-white mb-6">
      <div
        className="max-w-[1400px] mx-auto bg-white rounded-3xl overflow-hidden"
        style={containerStyle}
      >
        <div className="relative">
          {sdkLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}
          <div
            id={CONTAINER_ID}
            className={`min-h-[240px] overflow-auto ${
              sdkLoading ? "hidden" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default V1;
