"use client";

import { useEffect, useMemo } from "react";
import { getKwikCartConfig } from "./config";
import KwikCartCheckoutScript from "./KwikCartCheckoutScript";
import { useCartStore } from "@shopkit/cart";
import {
  convertCartItemsForCheckout,
  useCustomCheckout,
} from "../checkout-custom";

export function KwikCartCustom() {
  const config = useMemo(() => getKwikCartConfig(), []);
  const { closeCart, clearCart } = useCartStore();
  // Cart-open intent from the shared @shopkit/cart store. The header cart icon
  // (and anything else) calls the store's openCart(), flipping this to true.
  const isOpen = useCartStore((s) => s.isOpen);

  const { startCheckout } = useCustomCheckout({
    onCheckoutSuccess: (order) => {
      console.info("Checkout success:", order);
      closeCart();
      clearCart();
    },
    onCheckoutError: (error) => {
      console.error("Checkout failed:", error);
    },
  });

  useEffect(() => {
    (window as any).triggerRatioSideCartCheckout = async (cart: any) => {
      const { token, items, total_price, currency } = cart;

      if (!token) {
        console.error("Cannot checkout: cart token is missing");
        return;
      }
      try {
        await startCheckout({
          cartToken: token,
          items: convertCartItemsForCheckout(items),
          total: total_price,
          currencyCode: currency,
          checkoutUrl: "",
        });
      } catch (error) {
        console.error("Checkout failed unexpectedly:", error);
      }
    };

    return () => {
      delete (window as any).triggerRatioSideCartCheckout;
    };
  }, [startCheckout]);

  // Bridge the shared cart-open intent → GoKwik side-cart.
  //
  // In side-cart mode there is NO @shopkit CustomCartDrawer mounted, so the
  // store's `openCart()` (fired by the header cart icon) has nothing to open.
  // The GoKwik side-cart auto-opens on add-to-cart, but a bare icon click never
  // reaches it. GoKwik's side-cart script exposes `window.openGokwikSideCart()`
  // (the same global the voice side-cart adapter drives) — call it whenever the
  // store's open intent flips true, then reset the flag so the next click
  // re-triggers. Polls briefly in case the click lands before the script loads.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    let cancelled = false;
    let tries = 0;
    const tryOpen = () => {
      if (cancelled) {
        return;
      }
      const open = (window as { openGokwikSideCart?: () => void })
        .openGokwikSideCart;
      if (typeof open === "function") {
        open();
        closeCart(); // reset intent flag; the visible side-cart stays open
        return;
      }
      if (tries++ < 20) {
        window.setTimeout(tryOpen, 100); // up to ~2s for the script to load
      } else {
        console.warn(
          "[KwikCart] openGokwikSideCart global not available; cannot open side-cart"
        );
        closeCart();
      }
    };
    tryOpen();
    return () => {
      cancelled = true;
    };
  }, [isOpen, closeCart]);

  // Inject scripts via DOM so they re-execute on every mount
  useEffect(() => {
    (window as any).gk_cart_currency = config.currency;
    (window as any).gk_currency_format = config.currencyFormat;

    const script = document.createElement("script");
    script.id = "kwikcart-side-cart";
    script.src = config.scriptUrl;
    script.onload = () => {
      (window as any).kwikCartActive = true;
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [config]);

  return <KwikCartCheckoutScript />;
}
