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
