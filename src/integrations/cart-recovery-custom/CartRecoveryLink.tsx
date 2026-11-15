"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import {
  getCartConfig,
  isCartConfigured,
  useCartStore,
  type CartItem,
} from "@shopkit/cart";
import {
  convertCartItemsForCheckout,
  CustomCheckoutService,
  useCustomCheckout,
} from "@/integrations/checkout-custom";
// TODO(sentry): wire up Sentry here once `@/lib/sentry/utils` exists.
// See src/feature-packs/post-order-flow/install/lib/sentry/utils.ts.example.
// Until then we log to the console; the call sites below mark what each
// event should become (captureException / captureMessage / breadcrumb).

/**
 * Cart-recovery deep link handler — MS-158.
 *
 * Restores an abandoned cart and opens the cart drawer when a shopper arrives
 * via a KwikEngage recovery link of the form:
 *
 *   https://your-store.com/?cart_token=<token>&cart_open=true
 *
 * or, to skip the cart and go straight to GoKwik checkout:
 *
 *   https://themomsco.com/?cart_token=<token>&checkout_open=true
 *
 * The GoKwik KwikCart side-cart (`side-cart.js`) only auto-opens on its own
 * `?openCart=true` param and reads the cart from the `merchant_*_cartToken`
 * localStorage key / `X-Cart-Token` cookie. Our links use different param
 * names, so we bridge them:
 *   1. Seed the recovery token where the side-cart + @shopkit both read it.
 *   2. Validate the token and populate @shopkit's own store (the header badge,
 *      and the CustomCartDrawer in KWIKCART_DISABLE mode, read from it).
 *   3. Open the cart — GoKwik side-cart in KwikCart mode, @shopkit drawer
 *      otherwise. With `checkout_open=true`, start GoKwik checkout instead
 *      (falls back to opening the cart if the checkout SDK never loads).
 *   4. Strip the params from the URL so a refresh doesn't re-run the flow.
 *
 * The token is seeded in a layout effect — it flushes before CartInitializer's
 * passive `initializeCart` effect, so @shopkit doesn't mint a fresh cart, while
 * keeping render pure. Mounted AFTER <AppCartInitializer/> so the cart module
 * is already configured.
 */

// Layout effects warn on the server; fall back to useEffect during SSR.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const OPEN_POLL_INTERVAL_MS = 250;
const OPEN_POLL_MAX_TRIES = 40; // ~10s — side-cart.js loads afterInteractive.
const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, matches a cart's life.
const KWIKCART_DISABLED = process.env.NEXT_PUBLIC_KWIKCART_DISABLE === "true";

type RecoveredCart = {
  token?: string;
  item_count?: number;
  items?: CartItem[];
  checkoutUrl?: string;
  totalAmount?: { amount: number; currencyCode: string };
};

export function CartRecoveryLink() {
  const seeded = useRef(false);
  const { clearCart, closeCart } = useCartStore();
  // Set by the recovery effect: opens the cart if checkout fails to start.
  const checkoutFallback = useRef<(() => void) | null>(null);
  const { startCheckout } = useCustomCheckout({
    clearCart,
    closeCart,
    onCheckoutError: (err) => {
      // sentry: captureException(err, { tags: { flow: "cart-recovery", operation: "checkout" } })
      console.error("[cart-recovery] checkout failed", err);
      checkoutFallback.current?.();
      checkoutFallback.current = null;
    },
  });
  // The recovery effect runs once; read the latest startCheckout via a ref.
  const startCheckoutRef = useRef(startCheckout);
  startCheckoutRef.current = startCheckout;

  // 1. Restore (seed) the token in a layout effect. It flushes before
  //    CartInitializer's passive init effect, so @shopkit adopts THIS token
  //    instead of minting a fresh cart (isInitialized:true makes init bail);
  //    the store's items are then populated from the validation fetch below.
  useIsomorphicLayoutEffect(() => {
    if (seeded.current) {
      return;
    }
    seeded.current = true;
    try {
      const cartToken = new URLSearchParams(window.location.search)
        .get("cart_token")
        ?.trim();
      if (!cartToken) {
        return;
      }
      if (isCartConfigured()) {
        getCartConfig().cartStorage.setCartToken(cartToken);
      }
      document.cookie = `X-Cart-Token=${cartToken}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; SameSite=Lax`;
      useCartStore.setState({ cartToken, isInitialized: true });
    } catch (err) {
      // sentry: captureException(err, { tags: { flow: "cart-recovery", operation: "seed" } })
      console.error("[cart-recovery] seed failed", err);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cartToken = params.get("cart_token")?.trim();
    // No recovery params → leave the default storefront experience untouched.
    if (!cartToken) {
      return;
    }

    const shouldOpen = params.get("cart_open") === "true";
    const shouldCheckout = params.get("checkout_open") === "true";
    let cancelled = false;

    // Strip cart_token / cart_open / checkout_open so a refresh or back-nav doesn't re-run this.
    const clearParams = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("cart_token");
      url.searchParams.delete("cart_open");
      url.searchParams.delete("checkout_open");
      window.history.replaceState(
        null,
        "",
        url.pathname + url.search + url.hash
      );
    };

    // Undo the seeded token and re-initialize a clean cart so an invalid link
    // leaves a working default session (add-to-cart, header badge, etc.).
    const rollback = async () => {
      try {
        if (isCartConfigured()) {
          getCartConfig().cartStorage.removeCartToken();
        }
        document.cookie =
          "X-Cart-Token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        useCartStore.setState({ cartToken: null, isInitialized: false });
        await useCartStore.getState().initializeCart();
      } catch {
        // Best effort — never break the page on cleanup.
      }
    };

    const openDrawer = () => {
      // @shopkit drawer mode (KwikCart disabled): the store is populated, so
      // open the CustomCartDrawer directly — the GoKwik global never exists.
      if (KWIKCART_DISABLED) {
        void useCartStore.getState().openCart();
        return;
      }
      // KwikCart mode: poll for GoKwik's global, fall back to the @shopkit
      // drawer if the side-cart script never loads.
      let tries = 0;
      const tick = () => {
        if (cancelled) {
          return;
        }
        const open = (window as { openGokwikSideCart?: () => void })
          .openGokwikSideCart;
        if (typeof open === "function") {
          open();
          return;
        }
        if (tries++ < OPEN_POLL_MAX_TRIES) {
          window.setTimeout(tick, OPEN_POLL_INTERVAL_MS);
        } else {
          void useCartStore.getState().openCart();
        }
      };
      tick();
    };

    // Poll for the GoKwik checkout SDK (gokwik.js loads afterInteractive),
    // then start checkout for the restored cart. Falls back to opening the
    // cart so the shopper is still one tap from checkout.
    const openCheckout = (cart: RecoveredCart) => {
      const items = cart.items ?? [];
      const total =
        cart.totalAmount?.amount ??
        items.reduce((sum, item) => {
          const price =
            typeof item.price === "number" ? item.price : item.price.amount;
          return sum + price * item.quantity;
        }, 0);
      const currencyCode = cart.totalAmount?.currencyCode ?? "INR";

      let tries = 0;
      const tick = () => {
        if (cancelled) {
          return;
        }
        if (CustomCheckoutService.isGokwikAvailable()) {
          checkoutFallback.current = openDrawer;
          void startCheckoutRef.current({
            cartToken,
            items: convertCartItemsForCheckout(items),
            total,
            currencyCode,
            checkoutUrl: cart.checkoutUrl ?? "",
          });
          return;
        }
        if (tries++ < OPEN_POLL_MAX_TRIES) {
          window.setTimeout(tick, OPEN_POLL_INTERVAL_MS);
        } else {
          console.warn("[cart-recovery] GoKwik checkout SDK never loaded");
          openDrawer();
        }
      };
      tick();
    };

    (async () => {
      // 2. Validate + populate: the backend never errors on a bad token — it
      //    silently mints a fresh empty cart with a *different* token. A restore
      //    counts only when the returned cart echoes our token and has items.
      let restored = false;
      let cart: RecoveredCart | undefined;
      try {
        if (isCartConfigured()) {
          cart = (await getCartConfig().cartService.getCart(
            cartToken
          )) as unknown as RecoveredCart;
          const itemCount = cart?.item_count ?? cart?.items?.length ?? 0;
          restored = cart?.token === cartToken && itemCount > 0;
          if (cart && cart.token !== cartToken) {
            // Surface backend contract drift (missing/renamed token) instead of
            // failing silently.
            // sentry: addBreadcrumb({ category: "cart-recovery", level: "warning",
            //   message: "cart-get response did not echo the requested token",
            //   data: { requested: cartToken, returned: cart.token } })
            console.warn(
              "[cart-recovery] cart-get response did not echo the requested token",
              { requested: cartToken, returned: cart.token }
            );
          }
        }
      } catch (err) {
        // sentry: captureException(err, { tags: { flow: "cart-recovery", operation: "validate" }, extra: { cartToken } })
        console.error("[cart-recovery] validate failed", err, { cartToken });
      }

      if (cancelled) {
        return;
      }

      if (!restored) {
        // Invalid / expired / empty cart — bail gracefully per MS-158.
        // sentry: captureMessage("Cart recovery failed: invalid or empty cart",
        //   { level: "warning", tags: { flow: "cart-recovery", operation: "restore" },
        //     extra: { cartToken, returnedToken: cart?.token, itemCount } })
        console.warn("[cart-recovery] failed: invalid or empty cart", {
          cartToken,
          returnedToken: cart?.token,
          itemCount: cart?.item_count ?? cart?.items?.length ?? 0,
        });
        await rollback();
        clearParams();
        return;
      }

      // Populate @shopkit's own store with the restored cart (mirrors what
      // initializeCart would set) so the header badge + CustomCartDrawer reflect
      // it — not just the GoKwik side-cart.
      useCartStore.setState({
        items: cart?.items ?? [],
        cartToken,
        checkoutUrl: cart?.checkoutUrl,
        totalAmount: cart?.totalAmount,
        isInitialized: true,
      });

      // 3. Auto-open checkout or the drawer only when explicitly requested;
      //    checkout wins when both params are present.
      if (shouldCheckout && cart) {
        openCheckout(cart);
      } else if (shouldOpen) {
        openDrawer();
      }
      // 4. Clean the URL after a successful restoration.
      clearParams();
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
