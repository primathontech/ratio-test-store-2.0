"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@shopkit/cart";
import { ProductBundleProps } from "../types";
import {
  useCustomCheckout,
  convertCartItemsForCheckout,
} from "@/integrations/checkout-custom";
import CheckoutScriptCustom from "@/integrations/checkout-custom/CheckoutScriptCustom";
import { applyBundleCoupon } from "@/utils/applyBundleCoupon";

const waitForBundler = (timeoutMs = 8000) =>
  new Promise<void>((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if ((window as any).ProductBundler?.initStandalone) {
        resolve();
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        reject(new Error("Product bundler is unavailable"));
        return;
      }
      setTimeout(check, 50);
    };
    check();
  });

const loadBundlerScript = async (url?: string) => {
  if ((window as any).ProductBundler?.initStandalone) {
    return;
  }
  if (!url) {
    throw new Error("Product bundler script URL not configured");
  }

  const attachScript = (scriptUrl: string) => {
    const existing = document.querySelector(
      `script[src="${scriptUrl}"]`
    ) as HTMLScriptElement | null;
    if (existing) {
      return existing;
    }

    // eslint-disable-next-line no-restricted-syntax
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    document.head.appendChild(script);
    return script;
  };

  const waitForScript = async (scriptUrl: string) => {
    const script = attachScript(scriptUrl);
    const scriptError = new Promise<void>((_, reject) => {
      script.addEventListener(
        "error",
        () => reject(new Error("Failed to load product bundler script")),
        { once: true }
      );
    });
    await Promise.race([waitForBundler(), scriptError]);
  };

  try {
    await waitForScript(url);
  } catch (err) {
    if (
      err instanceof Error &&
      err.message !== "Failed to load product bundler script" &&
      err.message !== "Product bundler is unavailable"
    ) {
      throw err;
    }
    const cacheBustedUrl = `${url}${url.includes("?") ? "&" : "?"}cb=${Date.now()}`;
    await waitForScript(cacheBustedUrl);
  }
};

function getBundleId(
  settingsId?: string,
  dataId?: string,
  fallback?: string
): string {
  if (settingsId) {
    return settingsId;
  }
  if (dataId) {
    return dataId;
  }
  if (fallback) {
    return fallback;
  }
  if (typeof window === "undefined") {
    return "";
  }

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  return pathParts[pathParts.length - 1] || "";
}

const waitForGokwik = (timeoutMs = 8000) =>
  new Promise<boolean>((resolve) => {
    const start = Date.now();
    const check = () => {
      if ((window as any).gokwikSdk) {
        resolve(true);
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        resolve(false);
        return;
      }
      setTimeout(check, 50);
    };
    check();
  });

export const V1 = memo(function V1({
  data,
  settings,
  className = "",
}: ProductBundleProps) {
  const [bundleId, setBundleId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [processingCart, setProcessingCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const queryBundleId = (
    searchParams?.get("bundleId") ||
    searchParams?.get("bundle_id") ||
    ""
  ).trim();

  const merchantName = useMemo(
    () => process.env.NEXT_PUBLIC_MERCHANT_NAME || "momsco",
    []
  );
  const addItems = useCartStore((s) => s.addItems);
  const initializeCart = useCartStore((s) => s.initializeCart);
  const { startCheckout, isGokwikAvailable } = useCustomCheckout();
  const inFlightRef = useRef(false);

  const resolvedBundleId = useMemo(() => {
    if (queryBundleId) {
      return queryBundleId;
    }
    return getBundleId(
      settings?.bundleId,
      data?.bundleId,
      bundleId || undefined
    );
  }, [queryBundleId, settings?.bundleId, data?.bundleId, bundleId]);

  useEffect(() => {
    const id = queryBundleId || getBundleId(settings?.bundleId, data?.bundleId);
    if (id && id !== bundleId) {
      setBundleId(id);
    }
  }, [data?.bundleId, settings?.bundleId, queryBundleId, bundleId]);

  // Disable KwikCart's auto-open-on-add for the bundle page only, via GoKwik's
  // own config override. KwikCart merges `window.customGKCartConfig` over the
  // server config (and re-applies it ~1s after load), so atcBehaviour = "NONE"
  // means adding the bundle won't pop the side cart or a toast — we go straight
  // to checkout instead. Restored on unmount so the rest of the store keeps its
  // normal OPENCART behaviour.
  useEffect(() => {
    const w = window as any;
    const prev = w.customGKCartConfig;
    w.customGKCartConfig = {
      ...(prev || {}),
      appearance: {
        ...(prev?.appearance || {}),
        atcBehaviour: { type: "NONE" },
      },
    };
    return () => {
      w.customGKCartConfig = prev;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!resolvedBundleId) {
        setLoading(false);
        setError("Bundle id missing");
        return;
      }

      setLoading(true);
      setError(null);

      const scriptUrl =
        settings?.scriptUrl ||
        process.env.NEXT_PUBLIC_PRODUCT_BUNDLER_SCRIPT_URL ||
        process.env.NEXT_PUBLIC_SDK_URL;
      try {
        await loadBundlerScript(scriptUrl);
        if (cancelled) {
          return;
        }

        const bundler = (window as any).ProductBundler;
        if (!bundler?.initStandalone) {
          throw new Error("Product bundler is unavailable");
        }

        const bundlerConfig = {
          externalApiUrl: process.env.NEXT_PUBLIC_BUNDLE_API_BASE_URL,
          merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID_SDK,
          productResolutionEnabled: true,
          ProductResolutionService: (window as any).ProductResolutionService,
          backendType: process.env.NEXT_PUBLIC_BACKEND_TYPE || "custom",
          storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
          storefrontAccessToken:
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
        };

        bundler.initStandalone(
          "product-bundle-container",
          bundlerConfig,
          resolvedBundleId
        );

        setLoading(false);
      } catch (err) {
        if (cancelled) {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "Failed to initialize product bundler";
        setError(message);
        setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [resolvedBundleId, settings?.scriptUrl]);

  const handleBundleCartEvent = useCallback(
    async (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      const items = detail.items || detail.bundleItems || [];

      if (!items || items.length === 0) {
        return;
      }

      // The flow mutates the cart and opens checkout, so it must run once at a
      // time — ignore re-entrant calls (double-click / duplicate events).
      if (inFlightRef.current) {
        return;
      }
      inFlightRef.current = true;

      setProcessingCart(true);

      // Safety net for the config override above: KwikCart's auto-open routes
      // through window.openGokwikSideCart(). No-op it for the duration of this
      // checkout flow in case the atcBehaviour="NONE" config hasn't merged yet
      // on the very first add. Restored in `finally`.
      const win = window as any;
      const originalOpenSideCart = win.openGokwikSideCart;
      win.openGokwikSideCart = () => {};

      try {
        if (!useCartStore.getState().isInitialized) {
          await initializeCart(merchantName);
        }

        const payload = items.map((item: any) => ({
          productId: item.productId || item.id,
          variantId: item.variantId || item.id || item.productId,
          quantity: Math.max(1, Number(item.quantity) || 1),
        }));

        await addItems(payload);

        // Apply the SDK-generated dynamic discount code to the live cart so it
        // carries into GoKwik checkout. If it fails, proceed undiscounted
        // (never trap the shopper).
        const couponCartToken = useCartStore.getState().cartToken;
        if (detail.discountCode && couponCartToken) {
          try {
            await applyBundleCoupon(couponCartToken, detail.discountCode);
          } catch (couponErr) {
            window.dispatchEvent(
              new CustomEvent("dynamicDiscountFailed", {
                detail: {
                  error:
                    couponErr instanceof Error
                      ? couponErr.message
                      : "Failed to apply bundle discount",
                  discountCode: detail.discountCode,
                },
              })
            );
          }
        }

        window.dispatchEvent(
          new CustomEvent("itemsAddedToCart", {
            detail: { itemsAdded: true },
          })
        );
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { cartUpdated: true },
          })
        );
        window.dispatchEvent(
          new CustomEvent("addBundleToCartComplete", {
            detail: { cartUpdated: true, itemsAdded: true },
          })
        );

        // Auto-proceed to GoKwik checkout with the discount applied. The GoKwik
        // script loads asynchronously, so wait until it's ready before starting.
        const freshToken = useCartStore.getState().cartToken;
        const freshItems = useCartStore.getState().items;
        const gokwikReady = isGokwikAvailable || (await waitForGokwik());

        if (gokwikReady && freshToken && freshItems.length > 0) {
          const total = freshItems.reduce(
            (sum: number, item: any) =>
              sum +
              (typeof item.price === "number"
                ? item.price
                : item.price.amount) *
                item.quantity,
            0
          );
          const currencyCode =
            typeof freshItems[0]?.price === "object"
              ? freshItems[0].price.currencyCode
              : "INR";
          await startCheckout({
            cartToken: freshToken,
            items: convertCartItemsForCheckout(freshItems),
            total,
            currencyCode,
            checkoutUrl: useCartStore.getState().checkoutUrl || "",
          });
        } else {
          setError("Unable to open checkout. Please retry.");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to add bundle to cart. Please try again.";
        setError(message);
        window.dispatchEvent(
          new CustomEvent("addBundleToCartComplete", {
            detail: { cartUpdated: false, error: message },
          })
        );
      } finally {
        // Restore KwikCart's auto-open for the rest of the site — only if we
        // captured a real handler, so we don't clobber one KwikCart may have
        // assigned during this flow with `undefined`.
        if (originalOpenSideCart) {
          win.openGokwikSideCart = originalOpenSideCart;
        }
        inFlightRef.current = false;
        setProcessingCart(false);
      }
    },
    [addItems, initializeCart, merchantName, startCheckout, isGokwikAvailable]
  );

  useEffect(() => {
    window.addEventListener("addBundleToCart", handleBundleCartEvent);
    return () => {
      window.removeEventListener("addBundleToCart", handleBundleCartEvent);
    };
  }, [handleBundleCartEvent]);

  return (
    <>
      {/* Load GoKwik checkout script so direct-to-checkout works without the
          cart drawer (mirrors CheckoutButtonCustom). */}
      <CheckoutScriptCustom />
      <section
        className={`w-full bg-gradient-to-br from-gray-50 to-white py-4 px-4 md:px-0 md:py-10 ${className}`}
        data-testid="product-bundle-container"
      >
        <div className="mx-auto flex flex-col gap-6 md:px-8">
          {settings?.heading && (
            <div className="flex flex-col gap-2 text-left md:text-center">
              <h2
                className="text-[30px] lg:text-[36px] font-black text-gray-900"
                data-testid="product-bundle-title"
              >
                {settings.heading}
              </h2>
              {settings?.subheading && (
                <p className="text-sm text-gray-500 md:text-base">
                  {settings.subheading}
                </p>
              )}
            </div>
          )}

          {error && (
            <div
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              data-testid="product-bundle-error"
            >
              {error}
            </div>
          )}

          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
            {loading && (
              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-[260px] rounded-xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white p-4"
                  >
                    <div className="h-36 rounded-lg bg-gray-100 animate-pulse" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
                    <div className="mt-4 h-10 rounded-lg bg-gray-100 animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            <div
              id="product-bundle-container"
              className={`min-h-[420px] w-full transition-opacity ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              data-testid="product-bundle-content"
            />

            {processingCart && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm">
                  <span className="h-3 w-3 animate-ping rounded-full bg-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Adding bundle to cart...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
});

export { V1 as default };
