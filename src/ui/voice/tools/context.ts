import type { TransformedProduct } from "../catalog";
import type { VoiceConfig } from "../voiceConfig";
import type { VoiceProductDetail } from "../productDetail";
import type { CustomerAuthPort } from "../auth/customerAuth";
import type { GuardState } from "./guardrails";
import type { LastCartMutation } from "../hooks/useVoiceMemory";

type Ref<T> = { current: T };

/**
 * The cart PORT — the minimal slice of the store's cart the tools actually use.
 * Typing it here (instead of `any`) makes the cart WRITE boundary — the closest
 * thing the agent has to a money path — an explicit contract, and keeps the tool
 * layer independent of the concrete @shopkit/cart implementation.
 */
export interface CartLine {
  id: string;
  productId?: string;
  product_id?: string;
  variantId?: string;
  variant_id?: string;
  title: string;
  quantity: number;
  price?: { amount?: number; currencyCode?: string } | number;
}
export interface CartState {
  items: CartLine[];
  cartToken?: string;
  addItem: (item: Record<string, unknown>) => Promise<void> | void;
  updateItemQuantity: (
    lineId: string,
    quantity: number,
    variantId?: string
  ) => Promise<void> | void;
  removeItem: (lineId: string, variantId?: string) => Promise<void> | void;
}

/** Payload handed to the merchant's native checkout overlay. */
export interface CheckoutPayload {
  token: string;
  items: unknown[];
  total_price: number;
  currency: string;
}

/**
 * Everything the tools need, INJECTED. Because the tool business logic depends
 * only on this context — not on React, the DOM, a vendor SDK, or a specific
 * merchant — it is fully provider-agnostic, UI-agnostic, merchant-agnostic, and
 * DOM-agnostic (all browser actions go through the ports below). That makes it
 * unit-testable with a plain mock and relocatable (the read-only "data tier" could
 * later run server-side). This is the seam that keeps commerce logic independent
 * of everything around it.
 */
export interface ToolContext {
  /** Cart store accessor (e.g. useCartStore.getState). */
  cart: () => CartState;
  /** Navigation (router.push / router.back). */
  router: { push: (url: string) => void; back: () => void };
  /** Surface a short status caption to the shopper. */
  setCaption: (s: string) => void;
  /** Emit an analytics/funnel event. */
  track: (event: string, props?: Record<string, unknown>) => void;
  /** Merchant/runtime config (limits, etc.). */
  config: VoiceConfig;
  // ---- Browser/platform ACTION ports (injected so tool logic stays DOM-free) ----
  /** Scroll the current page. The DOM-querying lives in the impl, not the tool. */
  scrollPage: (to: string) => void;
  /** Open the merchant's native checkout overlay. Returns false if unavailable.
   *  May be async (the custom drawer clicks its own Checkout button post-render). */
  openNativeCheckout: (payload: CheckoutPayload) => boolean | Promise<boolean>;
  /** Open the cart DRAWER via the provider-correct opener (GoKwik side-cart global
   *  in KwikCart mode, @shopkit drawer otherwise). The store's own openCart only
   *  drives the @shopkit drawer, so this port is what makes "open my cart" work. */
  openCart: () => void;
  /** Close the cart DRAWER via the provider-correct closer (GoKwik side-cart global
   *  in KwikCart mode, @shopkit drawer otherwise). Symmetric to openCart. */
  closeCart: () => void;
  /** Open the cart's OFFERS/coupons panel by driving GoKwik's own "View Coupons"
   *  control, so the coupon list is visually shown (not just spoken). */
  openCoupons: () => void;
  /** Re-render the cart drawer after a programmatic change (e.g. a coupon applied
   *  via the backend) so the widget shows the applied state + updated total. */
  refreshCart: () => void;
  /** Apply a coupon by driving GoKwik's OWN "Apply" control for the matching code
   *  (so it applies + returns to the cart + shows the banner). Resolves true when
   *  clicked, false if the code isn't in the visible offer list (caller falls back
   *  to the backend apply). */
  applyCouponInUI: (code: string) => Promise<boolean>;
  /** Remove an applied coupon by clicking the "✕" on GoKwik's applied-coupon
   *  banner (so the widget removes it + restores the total). Resolves true when
   *  clicked, false if no applied-coupon banner is found. */
  removeCouponInUI: (code?: string) => Promise<boolean>;
  /** PAGE PERCEPTION: return the visible content of the shopper's current screen
   *  (rendered text + image alt / aria-label / title labels), so the agent can
   *  answer on-screen questions on ANY merchant without hardcoded facts. The DOM
   *  reading lives in the impl, keeping the tool layer DOM-free. */
  readPage: () => string;
  /** Customer AUTH port (read-only KwikPass observation). Gates the account tools
   *  (profile/orders) and supplies the BFF credential. The agent never logs in —
   *  it only reads whether the shopper already is. Injected so auth stays fully
   *  decoupled from the AI provider and the tool business logic. */
  auth: CustomerAuthPort;
  // ---- Session working set + product focus (owned by the widget, injected as refs) ----
  lastResultsRef: Ref<TransformedProduct[]>;
  searchResultsRef: Ref<TransformedProduct[]>;
  currentProductRef: Ref<TransformedProduct | null>;
  currentProductDetailRef: Ref<VoiceProductDetail | null>;
  collectionsRef: Ref<{ handle: string; title: string }[]>;
  ratingsCacheRef: Ref<Map<string, { avg: number; total: number }>>;
  /** Recent result sets (bounded ring) so references to earlier searches still resolve. */
  searchHistoryRef: Ref<{ query: string; products: TransformedProduct[] }[]>;
  /** Last reversible cart change, for undo_last_action. */
  lastMutationRef: Ref<LastCartMutation | null>;
  toolCallsRef: Ref<number>;
  /** Per-session abuse-guard state (rate window + pending confirmation). Reset at
   *  session start; owned by the widget, enforced by runTool via guardrails.ts. */
  guardStateRef: Ref<GuardState>;
  /** Monotonic tool-call BATCH counter (bumped once per model function-call batch).
   *  Lets the confirmation guard require arm and execute to be in different batches,
   *  so a high-impact action can't be armed-and-fired within a single turn. */
  batchSeqRef: Ref<number>;
}
