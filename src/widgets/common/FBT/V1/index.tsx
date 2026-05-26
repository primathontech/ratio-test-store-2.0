"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useCartStore, useCartItems, type CartItem } from "@shopkit/cart";

import type { FBTProductResponse, FBTProps } from "../types";

/* ------------------------------------------------------------------ */
/*  External Product-Bundler SDK type contract                         */
/* ------------------------------------------------------------------ */

type ProductBundler = {
  initStandaloneFromLookup?: (
    containerId: string,
    // Fixed base keys + open-ended extras forwarded from
    // NEXT_PUBLIC_FBT_SDK_CONFIG. To add a new key to the SDK, add it
    // to that env var — no code change needed.
    config: {
      merchantId?: string;
      backendType?: string;
      externalApiUrl?: string;
      [key: string]: string | undefined;
    },
    sourceId?: string | null
  ) => void | (() => void);
};

const parseFbtSdkConfig = (): Record<string, string> => {
  try {
    const raw = process.env.NEXT_PUBLIC_FBT_SDK_CONFIG;
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed).filter(([, v]) => typeof v === "string")
    ) as Record<string, string>;
  } catch {
    return {};
  }
};

const fbtSdkConfig = parseFbtSdkConfig();

type SelectedItem = {
  id: string;
  variants?: Array<{ id: string; availableForSale: boolean }>;
};

type CartItemWithGid = CartItem & {
  productGid?: string;
  productId?: string;
  product_id?: string;
};

/**
 * Type guard for the envelope shape `{ success, data: {...product}, ... }`
 * that the data-aggregator emits. We treat any payload carrying a `data`
 * key as the envelope — but also accept it ONLY when the envelope is
 * well-formed (success !== false). On `success === false` we fall through
 * to treat the input as the inner product (which usually fails too — and
 * `productId` ends up null, hiding the rail).
 */
const isProductResponse = (
  input: NonNullable<FBTProps["data"]>
): input is FBTProductResponse =>
  "data" in input || "success" in input || "message" in input;

/* ------------------------------------------------------------------ */
/*  SDK loader — single-shot script injection                          */
/* ------------------------------------------------------------------ */

const loadSDK = (url?: string) =>
  new Promise<void>((resolve, reject) => {
    const PB = (window as Window & { ProductBundler?: ProductBundler })
      .ProductBundler;
    if (PB) {
      resolve();
      return;
    }
    if (!url) {
      reject(new Error("SDK URL missing"));
      return;
    }
    // eslint-disable-next-line no-restricted-syntax
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

/* ------------------------------------------------------------------ */
/*  Skeleton card while SDK boots                                      */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Main V1                                                             */
/* ------------------------------------------------------------------ */

export const V1: React.FC<FBTProps> = ({ data }) => {
  const sdkUrl = process.env.NEXT_PUBLIC_SDK_URL;
  const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE || "shopify";
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID_SDK;

  const pathname = usePathname();
  const items = useCartItems() as CartItemWithGid[];
  const addItems = useCartStore((s) => s.addItems);
  const openCart = useCartStore((s) => s.openCart);

  const [sdkLoading, setSdkLoading] = useState(true);
  const [productFound, setProductFound] = useState(true);
  const [collectionId, setCollectionId] = useState<string | null>(null);

  const collectionHandle = useMemo(() => {
    const m = pathname?.match(/^\/collections\/([^/]+)/i);
    return m ? decodeURIComponent(m[1]) : null;
  }, [pathname]);

  /**
   * Resolve the product id from one of:
   *   1. Standard envelope: `{ success: true, data: { id, ... } }`
   *      → reads `data.data.id`. Refuses to read it when
   *      `success === false` so a failed fetch doesn't try to boot the
   *      SDK against `undefined`.
   *   2. Raw product (some consumers may pre-unwrap): `{ id, ... }`
   *      → reads `data.id` directly.
   *   3. Anything else → null (rail hides itself).
   *
   * Sample API response this matches:
   *   { success: true, data: { id: "7623090045003", title: "...", ... }, ... }
   *   → productId = "7623090045003"
   */
  const productId = useMemo(() => {
    if (!data) {
      return null;
    }
    if (isProductResponse(data)) {
      if (data.success === false) {
        return null;
      }
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

  /* ── Resolve a collection handle to its numeric/gid id (for /collections/* pages) ── */
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!collectionHandle) {
        setCollectionId(null);
        return;
      }
      try {
        // eslint-disable-next-line no-restricted-syntax
        const res = await fetch(
          `/api/v1/collection?handle=${encodeURIComponent(collectionHandle)}`
        );
        if (!alive) {
          return;
        }
        if (res.ok) {
          const json = await res.json();
          setCollectionId(json?.collection?.id ?? null);
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

  /* ── Boot the SDK once we have a sourceId ── */
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
          console.error("ProductBundler.initStandaloneFromLookup missing");
          return;
        }
        const maybeUnmount = PB.initStandaloneFromLookup(
          "fbt-container-shopify",
          {
            merchantId,
            backendType,
            externalApiUrl: process.env.NEXT_PUBLIC_BUNDLE_API_BASE_URL,
            ...fbtSdkConfig,
          },
          sourceId
        );
        unmount = typeof maybeUnmount === "function" ? maybeUnmount : null;
        window.dispatchEvent(
          new CustomEvent("metaDataOrDescription", {
            detail: { ok: true, metaData: "/" },
          })
        );
      })
      .catch(console.error);

    return () => {
      try {
        unmount?.();
      } catch {
        console.error("FBT SDK unmount error");
      }
    };
  }, [merchantId, backendType, sourceId, sdkUrl, productFound, pathname]);

  /* ── Hide skeleton once the SDK injects child nodes ── */
  useEffect(() => {
    if (!sourceId || !productFound) {
      return;
    }
    const el = document.getElementById("fbt-container-shopify");
    if (!el) {
      return;
    }

    const applyFirstCardMargin = () => {
      if (window.innerWidth >= 770) {
        return;
      }
      const scrollContainer = el.querySelector(".fbt-no-scrollbar");
      const firstCard = scrollContainer?.firstElementChild as HTMLElement;
      if (firstCard) {
        firstCard.style.paddingLeft = "12px";
      }
    };

    const check = () => {
      if (el.childElementCount > 0) {
        setSdkLoading(false);
        applyFirstCardMargin();
      }
    };
    check();

    const obs = new MutationObserver(check);
    obs.observe(el, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [sourceId, productFound]);

  /* ── Cart-snapshot bridge: SDK asks for current cart, we reply ── */
  const currentCartGids = useCallback(
    () =>
      itemsRef.current.map((ci) => {
        const productId =
          ci.productGid ?? ci.productId ?? ci.product_id ?? ci.id;
        return toProductGid(productId);
      }),
    []
  );

  useEffect(() => {
    const onSnapshotRequest = () => {
      window.dispatchEvent(
        new CustomEvent("cart:snapshot", {
          detail: { ids: currentCartGids() },
        })
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
            return {
              productId: p.id,
              variantId: v?.id || "",
              quantity: 1,
            };
          });
          await addItems(payload);
          toAdd.forEach((p) =>
            window.dispatchEvent(
              new CustomEvent("cart:item:added", { detail: { id: p.id } })
            )
          );
        }

        window.dispatchEvent(
          new CustomEvent("fbtAddToHandler:success", {
            detail: {
              ok: true,
              selectedItems,
              count: selectedItems.length,
            },
          })
        );
        window.dispatchEvent(
          new CustomEvent("metaDataOrDescription", {
            detail: { ok: true, metaData: "/" },
          })
        );
      } catch (err) {
        console.error("FBT addItems failed", err);
        window.dispatchEvent(
          new CustomEvent("fbtAddToHandler:success", {
            detail: { ok: false, error: String(err) },
          })
        );
      }
    };

    const onOpenCartRequest = () => {
      openCart();
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

    // Initial snapshot push so the SDK can render correct
    // "already in cart" state on first paint.
    window.dispatchEvent(
      new CustomEvent("cart:snapshot", { detail: { ids: currentCartGids() } })
    );

    return () => {
      window.removeEventListener("cart:open:request", onOpenCartRequest);
      window.removeEventListener("cart:snapshot:request", onSnapshotRequest);
      window.removeEventListener("fbtAddToHandler", onAdd);
      window.removeEventListener("no_bundle_found", handleCheckBundleExist);
    };
  }, [addItems, currentCartGids, openCart]);

  /* ── Push fresh snapshot when cart items change ── */
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("cart:snapshot", { detail: { ids: currentCartGids() } })
    );
  }, [currentCartGids, items]);

  /* ── Inject minor padding tweaks the SDK can't express in its own DOM ── */
  useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax
    const style = document.createElement("style");
    style.textContent = `
      #fbt-container-shopify [data-fbt] > div {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      @media (min-width: 768px) and (max-width: 1150px) {
        #fbt-container-shopify [data-fbt] h2 {
          padding: 0px 40px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!productFound) {
    return null;
  }

  return (
    <div className="bg-white mb-6">
      <div className="theme-box w-full max-w-[1400px] mx-auto md:px-6 min-[1150px]:px-[65px] relative py-8">
        <div className="relative pb-6 min-[1280px]:px-[28px] min-[1280px]:pl-[38px]">
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
  );
};
