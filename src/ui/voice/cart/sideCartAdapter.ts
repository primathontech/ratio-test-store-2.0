/**
 * SIDE-CART ADAPTER SEAM.
 *
 * The voice tool layer drives the cart through a small set of semantic actions
 * (open / close / coupons / checkout). WHICH cart implementation those actions
 * talk to is a per-merchant concern, so it lives behind this adapter interface
 * instead of being branched inline in the session hook.
 *
 * Two implementations exist today, matching the platform's own two cart modes:
 *   - GoKwik SideCart (default)            — driven via GoKwik's globals + its
 *                                            Svelte shadow-DOM controls.
 *   - Custom drawer (@shopkit CartDrawer)  — driven via the shared cart store.
 *
 * The implementation is selected ONCE, from the SAME signal the storefront uses to
 * render the two carts (`NEXT_PUBLIC_KWIKCART_DISABLE`, see ClientDynamics) — so
 * voice can never disagree with the visible cart. Data operations (add/remove/update
 * line items) are NOT here: those already go through the provider-agnostic
 * `@shopkit/cart` store in runTool. This adapter owns only the UI-actuation that
 * differs per cart. Onboarding a new cart = one new adapter + one resolver line;
 * the tool layer and ToolContext never change.
 *
 * NOTE: cart DATA operations (add/remove/update) are merchant-agnostic already
 * (@shopkit/cart) and deliberately not part of this UI-actuation seam.
 */

import { useCartStore } from "@shopkit/cart";
import { voiceTrack } from "@/lib/voiceAnalytics";
import type { CheckoutPayload } from "../tools/context";

export interface SideCartAdapter {
  readonly name: "gokwik" | "custom";
  /** Whether coupons can be applied/removed IN the cart. GoKwik side-cart has an Apply
   *  control (true); the custom drawer has NONE — eligible coupons auto-apply at checkout
   *  (false), so the agent must NOT pretend to apply/remove one there. */
  readonly supportsInCartCoupons: boolean;
  /** Open the visible cart drawer. */
  openCart(): void;
  /** Close the visible cart drawer. */
  closeCart(): void;
  /** Reveal the coupons/offers panel (best-effort; opens the cart at minimum). */
  openCoupons(): void;
  /** Apply a coupon by driving the cart's OWN "Apply" control. Resolves true when
   *  clicked, false when the cart can't actuate it in-UI (caller falls back to the
   *  backend apply). */
  applyCouponInUI(code: string): Promise<boolean>;
  /** Remove an applied coupon via the cart's OWN remove control. Resolves true when
   *  clicked, false when there's nothing to remove / no in-UI control. */
  removeCouponInUI(code?: string): Promise<boolean>;
  /** Re-render the cart after a programmatic change so it reflects the new state. */
  refreshCart(): void;
  /** Open the merchant's native checkout. Returns false if unavailable (caller then
   *  shows the cart so the shopper can tap Checkout). May be async (the custom drawer
   *  clicks its own Checkout button, which renders after the drawer opens). */
  openCheckout(payload: CheckoutPayload): boolean | Promise<boolean>;
  /** Close the merchant's native checkout overlay (the GoKwik SDK overlay). Symmetric
   *  to openCheckout. Best-effort + idempotent — safe to call when no checkout is open.
   *  Used to guarantee the checkout overlay never lingers behind the page when the
   *  shopper navigates away to keep browsing (e.g. "add anything else?" → "yes"). */
  closeCheckout(): void;
}

const store = () => useCartStore.getState() as any;

// ---------------------------------------------------------------------------
// GoKwik SideCart adapter — all GoKwik-specific globals + shadow-DOM actuation.
// Behaviour is byte-for-byte the logic that previously lived inline in
// useVoiceSession's KwikCart-mode branch. Merchant-agnostic within GoKwik: every
// GoKwik merchant renders the same side-cart, matched by visible text (no
// hardcoded coupon/merchant).
// ---------------------------------------------------------------------------
function createGokwikSideCartAdapter(): SideCartAdapter {
  // GoKwik renders its side-cart as a Svelte app inside <shadow-dom-container>
  // shadow roots. Reach an element there so the agent can drive GoKwik's OWN UI —
  // the only way the widget visually reflects the change.
  const queryGokwikSideCart = (selector: string): HTMLElement | null => {
    try {
      const hosts = document.querySelectorAll("shadow-dom-container");
      for (const host of Array.from(hosts)) {
        const root = (host as HTMLElement & { shadowRoot?: ShadowRoot | null })
          .shadowRoot;
        const el = root?.querySelector(selector);
        if (el) return el as HTMLElement;
      }
    } catch {
      /* shadow DOM not present yet */
    }
    return null;
  };

  const queryAllGokwikSideCart = (selector: string): HTMLElement[] => {
    const found: HTMLElement[] = [];
    try {
      const hosts = document.querySelectorAll("shadow-dom-container");
      for (const host of Array.from(hosts)) {
        const root = (host as HTMLElement & { shadowRoot?: ShadowRoot | null })
          .shadowRoot;
        root
          ?.querySelectorAll(selector)
          .forEach((el) => found.push(el as HTMLElement));
      }
    } catch {
      /* shadow DOM not present yet */
    }
    return found;
  };

  // Fire a click that mirrors a REAL user tap: the full pointer → mouse → click
  // sequence, each event `composed: true` so it crosses GoKwik's shadow boundary.
  const dispatchRealClick = (el: HTMLElement) => {
    try {
      el.scrollIntoView?.({ block: "nearest" });
      const base = {
        bubbles: true,
        cancelable: true,
        composed: true,
        view: window,
      };
      try {
        el.dispatchEvent(new PointerEvent("pointerdown", base));
      } catch {
        /* PointerEvent unsupported → mouse events below still fire */
      }
      el.dispatchEvent(new MouseEvent("mousedown", base));
      el.focus?.();
      try {
        el.dispatchEvent(new PointerEvent("pointerup", base));
      } catch {
        /* ignore */
      }
      el.dispatchEvent(new MouseEvent("mouseup", base));
      el.dispatchEvent(new MouseEvent("click", base));
      el.click?.();
    } catch {
      try {
        el.click?.();
      } catch {
        /* best-effort */
      }
    }
  };

  const openCart = () => {
    try {
      const open = (window as { openGokwikSideCart?: () => void })
        .openGokwikSideCart;
      if (typeof open === "function") {
        open();
        return;
      }
      // Side-cart script not loaded yet → fall back to the @shopkit drawer.
      console.warn(
        "🎙️ [voice] GoKwik selector miss: openGokwikSideCart global"
      );
      voiceTrack("selector_miss", { control: "open_side_cart" });
      store().openCart?.();
    } catch {
      /* opening is best-effort */
    }
  };

  const closeCart = () => {
    try {
      const w = window as {
        closeGokwikSideCart?: () => void;
        gokwikSideCartClose?: () => void;
      };
      const close = w.closeGokwikSideCart ?? w.gokwikSideCartClose;
      if (typeof close === "function") close();
      // Also clear the @shopkit store's open flag so any store-driven UI stays in sync.
      store().closeCart?.();
    } catch {
      /* closing is best-effort */
    }
  };

  const refreshCart = () => {
    try {
      (window as { refreshSideCart?: () => void }).refreshSideCart?.();
    } catch {
      /* best-effort refresh */
    }
  };

  const openCoupons = () => {
    openCart();
    let tries = 0;
    const tick = () => {
      const btn =
        queryGokwikSideCart("button.view-coupon-list") ||
        queryGokwikSideCart(".view-coupon-text");
      if (btn) {
        btn.click();
        return;
      }
      if (tries++ < 25)
        window.setTimeout(tick, 120); // up to ~3s
      else {
        console.warn("🎙️ [voice] GoKwik selector miss: view-coupon button");
        voiceTrack("selector_miss", { control: "view_coupons" });
      }
    };
    window.setTimeout(tick, 200);
  };

  const applyCouponInUI = (code: string): Promise<boolean> => {
    const want = code.trim().toUpperCase();
    return new Promise((resolve) => {
      openCoupons(); // open cart + Offers panel
      let tries = 0;
      const tick = () => {
        const candidates = [
          ...queryAllGokwikSideCart("button"),
          ...queryAllGokwikSideCart(".apply-btn"),
        ];
        for (const el of candidates) {
          if (!/^apply$/i.test((el.textContent || "").trim())) continue;
          let anc: HTMLElement | null = el;
          for (let hops = 0; anc && hops < 6; hops++) {
            if ((anc.textContent || "").toUpperCase().includes(want)) {
              el.click();
              resolve(true);
              return;
            }
            anc = anc.parentElement;
          }
        }
        if (tries++ < 30)
          window.setTimeout(tick, 120); // up to ~3.6s
        else {
          console.warn("🎙️ [voice] GoKwik selector miss: apply-coupon button");
          voiceTrack("selector_miss", { control: "apply_coupon", code: want });
          resolve(false);
        }
      };
      window.setTimeout(tick, 400); // offers render a beat after the panel opens
    });
  };

  const removeCouponInUI = (code?: string): Promise<boolean> => {
    const want = (code || "").trim().toUpperCase();
    const findRemoveBtn = (): HTMLElement | null => {
      const btns = queryAllGokwikSideCart(".remove-btn");
      const chosen =
        (want
          ? btns.find((el) => {
              let anc: HTMLElement | null = el;
              for (let h = 0; anc && h < 4; h++) {
                if ((anc.textContent || "").toUpperCase().includes(want))
                  return true;
                anc = anc.parentElement;
              }
              return false;
            })
          : undefined) ?? btns[0];
      if (!chosen) return null;
      return (chosen.querySelector("button") ?? chosen) as HTMLElement;
    };
    return new Promise((resolve) => {
      const immediate = findRemoveBtn();
      if (immediate) {
        console.log("🎙️ [voice] removing coupon (banner already open)");
        dispatchRealClick(immediate);
        resolve(true);
        return;
      }
      openCart();
      let tries = 0;
      const tick = () => {
        const btn = findRemoveBtn();
        if (btn) {
          console.log("🎙️ [voice] removing coupon (after opening cart)");
          dispatchRealClick(btn);
          resolve(true);
          return;
        }
        if (tries++ < 25) window.setTimeout(tick, 120);
        else {
          console.warn("🎙️ [voice] GoKwik selector miss: remove-coupon banner");
          voiceTrack("selector_miss", { control: "remove_coupon" });
          resolve(false);
        }
      };
      window.setTimeout(tick, 200);
    });
  };

  return {
    name: "gokwik",
    supportsInCartCoupons: true, // GoKwik side-cart has an in-cart Apply/Remove control
    openCart,
    closeCart,
    openCoupons,
    applyCouponInUI,
    removeCouponInUI,
    refreshCart,
    openCheckout: sharedNativeCheckout,
    closeCheckout: sharedCloseCheckout,
  };
}

// ---------------------------------------------------------------------------
// Custom SideCart adapter — the @shopkit CustomCartDrawer, driven through the
// shared cart store. No GoKwik globals / shadow DOM. There is no shadow-DOM Offers
// panel to actuate here, so coupon apply/remove resolve false and runTool falls back
// to its backend coupon apply — the same OUTCOME as before, just without the dead
// GoKwik shadow-DOM polling that used to run (and always miss) in this mode.
// LIMITATION: in-UI coupon actuation and a native-checkout bridge are not
// implemented for the custom drawer (see openCheckout); both degrade gracefully.
// ---------------------------------------------------------------------------
function createCustomSideCartAdapter(): SideCartAdapter {
  return {
    name: "custom",
    // No in-cart apply UI — the drawer shows "coupons apply at checkout"; eligible ones
    // auto-apply there. The agent must be honest about this, not fake an apply.
    supportsInCartCoupons: false,
    openCart: () => {
      try {
        store().openCart?.();
      } catch {
        /* best-effort */
      }
    },
    closeCart: () => {
      try {
        store().closeCart?.();
      } catch {
        /* best-effort */
      }
    },
    // No separate offers panel to drive → "show coupons" opens the cart; the agent
    // still speaks the offers it fetched from the backend (get_offers).
    openCoupons: () => {
      try {
        store().openCart?.();
      } catch {
        /* best-effort */
      }
    },
    // No in-UI coupon actuation for the custom drawer → runTool's backend apply
    // (applyBundleCoupon) handles the OUTCOME; returning false triggers that path.
    applyCouponInUI: async () => false,
    removeCouponInUI: async () => false,
    // The @shopkit drawer re-renders reactively from store state, so an explicit
    // refresh is usually a no-op; call the store's refresh if it exposes one.
    refreshCart: () => {
      try {
        store().refreshCart?.();
      } catch {
        /* best-effort */
      }
    },
    // The custom drawer has no side-cart checkout global. Instead, open the drawer
    // and click ITS OWN "Checkout" button (the shared CartSummary's `.checkout-btn`,
    // which drives the storefront's fully-wired GoKwik checkout — config, handlers,
    // redirects). This reuses the exact flow a shopper taps, so nothing is
    // re-implemented. Async because the button renders after the drawer opens.
    openCheckout: async () => {
      try {
        store().openCart?.();
      } catch {
        /* best-effort */
      }
      return clickWhenPresent(
        ".checkout-btn, [data-testid*='checkout-button']"
      );
    },
    // Same GoKwik SDK overlay as the side-cart mode (the custom drawer's Checkout
    // button drives CustomCheckoutService → window.gokwikSdk), so the shared closer
    // applies here too.
    closeCheckout: sharedCloseCheckout,
  };
}

/** Open the drawer's own Checkout button once it renders (poll up to ~3s). Regular
 *  light DOM (not shadow) for the custom drawer. Resolves true when clicked. */
function clickWhenPresent(
  selector: string,
  timeoutMs = 3000
): Promise<boolean> {
  return new Promise((resolve) => {
    let tries = 0;
    const maxTries = Math.ceil(timeoutMs / 120);
    const tick = () => {
      const btn = document.querySelector<HTMLElement>(selector);
      if (btn) {
        btn.click();
        resolve(true);
        return;
      }
      if (tries++ < maxTries) window.setTimeout(tick, 120);
      else {
        voiceTrack("selector_miss", { control: "custom_checkout" });
        resolve(false);
      }
    };
    tick();
  });
}

// Native-checkout trigger. Shared because it is provider-neutral: it drives the
// platform's own side-cart checkout bridge if present, and returns false otherwise
// so runTool shows the cart for the shopper to tap Checkout. A custom cart with a
// different checkout entrypoint overrides this in its own adapter.
function sharedNativeCheckout(payload: CheckoutPayload): boolean {
  const trigger = (window as any).triggerRatioSideCartCheckout;
  if (typeof trigger !== "function") return false;
  trigger(payload); // if this throws, runTool's try/catch handles it
  return true;
}

// Close the GoKwik checkout overlay. Provider-neutral: BOTH cart modes drive checkout
// through the SAME GoKwik SDK global — the custom drawer via CustomCheckoutService, the
// side-cart via triggerRatioSideCartCheckout → CustomCheckoutService — so a single
// `window.gokwikSdk.close()` is the correct closer for every mode (mirrors what the
// storefront's own CustomCheckoutService.closeCheckout / ShopifyCheckoutService.closeCheckout
// do). Idempotent + guarded: safe when nothing is open, and a missing/failing SDK close
// must never break navigation.
function sharedCloseCheckout(): void {
  try {
    (window as { gokwikSdk?: { close?: () => void } }).gokwikSdk?.close?.();
  } catch {
    /* best-effort */
  }
}

const gokwikSideCartAdapter = createGokwikSideCartAdapter();
const customSideCartAdapter = createCustomSideCartAdapter();

/**
 * Resolve the active side-cart adapter from the platform's cart-mode flag — the
 * SAME signal ClientDynamics uses to render the custom drawer vs the GoKwik
 * side-cart, so voice and the visible cart never disagree. Config decides; a
 * missing GoKwik global is handled defensively inside the GoKwik adapter (it logs
 * `selector_miss` and falls back to the store drawer).
 */
export function resolveSideCartAdapter(): SideCartAdapter {
  return process.env.NEXT_PUBLIC_KWIKCART_DISABLE === "true"
    ? customSideCartAdapter
    : gokwikSideCartAdapter;
}

/** Whether the ACTIVE cart supports applying/removing a coupon IN the cart. When false,
 *  eligible coupons auto-apply at checkout and there is no in-cart control — so the agent
 *  must tell the shopper that instead of claiming it applied/removed one. Derived from the
 *  same resolver as everything else cart-mode-specific, so it can't disagree with the UI. */
export function cartSupportsInCartCoupons(): boolean {
  return resolveSideCartAdapter().supportsInCartCoupons;
}
