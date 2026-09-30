"use client";

/**
 * VOICE OFFERS SOURCE.
 *
 * When the shopper asks "any offers / discounts?", the agent must read the SAME coupons
 * the VISIBLE cart shows — otherwise voice and the UI disagree (the bug this fixes: on a
 * custom-drawer merchant the drawer lists /api/v1/discounts coupons while the agent was
 * reading GoKwik valid-offers).
 *
 * WHICH source depends on the per-merchant cart mode — the SAME signal
 * (`NEXT_PUBLIC_KWIKCART_DISABLE`) that resolveSideCartAdapter uses, so the offers can
 * never disagree with the visible cart:
 *   - GoKwik side-cart mode  → GoKwik kwik-cart `valid-offers` (cart-aware; the list the
 *                              side-cart's "N coupons available" shows).
 *   - Custom drawer mode     → POST /api/v1/discounts (the published-discount list the
 *                              custom CartDrawer's useCoupons renders — same request).
 * Both normalize to one {code, title?, description?} shape for the agent. Fully
 * env-driven; no merchant literals. Onboarding a new cart = one new branch here, mirroring
 * the adapter seam.
 */

import { fetchValidOffers } from "@/utils/gokwikOffers";
import { resolveSideCartAdapter } from "./sideCartAdapter";
import { timeoutSignal } from "../voiceHttp";
import type { CartLine } from "../tools/context";

export interface VoiceOffer {
  code: string;
  title?: string;
  description?: string;
}

// Derive the mode from the SAME resolver the visible cart's actuation uses, so the
// offers source can NEVER drift from the cart the shopper actually sees — even if the
// mode-resolution logic changes later. (Both ultimately read NEXT_PUBLIC_KWIKCART_DISABLE
// today; going through the adapter makes "offers match the cart" structural, not
// coincidental.) Custom drawer = "custom"; GoKwik side-cart = "gokwik".
const isCustomCart = () => resolveSideCartAdapter().name === "custom";

/**
 * Coupons for the CURRENT cart, from the source that matches the visible cart. Returns
 * [] on any failure so the agent simply says there are none (never errors / invents).
 */
export async function fetchCartOffers(
  cartToken: string | undefined,
  items: CartLine[]
): Promise<VoiceOffer[]> {
  if (isCustomCart()) return fetchCustomDiscounts();
  const offers = await fetchValidOffers(cartToken, items as never[]);
  return offers.map((o) => ({ code: o.code, description: o.description }));
}

/**
 * The custom CartDrawer's coupon source — the SAME `/api/v1/discounts` request
 * useCoupons makes (published + always-visible), so voice matches the drawer exactly.
 */
async function fetchCustomDiscounts(): Promise<VoiceOffer[]> {
  try {
    const res = await fetch("/api/v1/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: 1,
        limit: 10,
        status: "published",
        visibility: "always",
      }),
      signal: timeoutSignal(6000),
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    const list = (data as { data?: { data?: unknown } })?.data?.data;
    if (!Array.isArray(list)) return [];
    return list
      .map((d: Record<string, unknown>): VoiceOffer => ({
        code: typeof d.code === "string" ? d.code : "",
        title: typeof d.title === "string" ? d.title : undefined,
        description:
          typeof d.description === "string" ? d.description : undefined,
      }))
      .filter((o) => Boolean(o.code));
  } catch {
    return [];
  }
}
