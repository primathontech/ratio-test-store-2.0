"use client";

/**
 * GoKwik CART-AWARE offers for the voice agent.
 *
 * The generic "published discounts" list the storefront drawer uses returns
 * nothing in this deployment; the REAL, cart-specific coupons come from GoKwik's
 * kwik-cart `valid-offers` endpoint — the same one GoKwik's own side-cart.js calls
 * to show the "N coupons available" list. We rebuild the cart payload from the live
 * cart and POST it through the commerce client (the same transport
 * applyBundleCoupon uses, so CORS/proxying is already handled).
 *
 * Merchant-agnostic: the merchant id and endpoint come from env, never hardcoded.
 */

import { getCommerceClient } from "@/config";

const VALID_OFFERS_URL =
  process.env.NEXT_PUBLIC_GOKWIK_VALID_OFFERS_URL ||
  "https://gkx.gokwik.co/v3/kwik-cart/valid-offers";

export interface GokwikOffer {
  code: string;
  description?: string;
}

/** The slice of a cart line the payload needs (matches ToolContext's CartLine). */
interface OfferCartLine {
  id: string;
  variantId?: string;
  variant_id?: string;
  quantity: number;
  price?: { amount?: number } | number;
}

function pricePaise(p: OfferCartLine["price"]): number {
  return typeof p === "number" ? p : (p?.amount ?? 0);
}

/** Fetch the coupons GoKwik considers valid for THIS cart. Returns [] on any
 *  failure (no token/mid/items, network, or an unrecognized response shape) so
 *  the agent simply says there are none rather than erroring. */
export async function fetchValidOffers(
  cartToken: string | undefined,
  items: OfferCartLine[]
): Promise<GokwikOffer[]> {
  const mid =
    process.env.NEXT_PUBLIC_GOKWIK_MID ||
    process.env.NEXT_PUBLIC_MERCHANT_ID ||
    "";
  if (!cartToken || !mid || !items?.length) return [];

  const gkItems = items.map((i) => {
    const price = pricePaise(i.price);
    const quantity = i.quantity ?? 1;
    const vid = Number(i.variantId ?? i.variant_id ?? i.id) || 0;
    const linePrice = price * quantity;
    return {
      id: vid,
      variantId: vid,
      quantity,
      price,
      originalPrice: price,
      discountedPrice: price,
      linePrice,
      originalLinePrice: linePrice,
      totalDiscount: 0,
    };
  });
  const subtotal = gkItems.reduce((t, i) => t + i.linePrice, 0);
  const itemCount = gkItems.reduce((t, i) => t + i.quantity, 0);

  const cart = {
    discountCodes: [],
    inventoryMessages: [],
    token: cartToken,
    note: "",
    attributes: { "GoKwik-Cart": true },
    originalTotalPrice: subtotal,
    totalDiscount: 0,
    itemsSubtotalPrice: subtotal,
    totalPrice: subtotal,
    totalWeight: 0,
    itemCount,
    items: gkItems,
    requiresShipping: true,
    currency: "INR",
    cartLevelDiscountApplications: [],
  };

  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : cartToken;

  try {
    const client = getCommerceClient();
    const res = await client.fetchRequest({
      url: VALID_OFFERS_URL,
      method: "POST",
      headers: { "Content-Type": "application/json", "x-gk-mid": mid },
      body: JSON.stringify({ cart, requestId, platform: "checkout_1.0" }),
    });

    // Actual GoKwik shape (verified live):
    //   { statusCode, message, data: { discounts: [{ discountCode, discountDetail,
    //     additionalDetails: { bulletPoints }, valid }], unavailableDiscounts, ... } }
    // fetchRequest may or may not unwrap the outer body, so probe both levels.
    const body: any = (res as any)?.data ?? res;
    const container: any = body?.data ?? body;
    const raw: any[] = Array.isArray(container?.discounts)
      ? container.discounts
      : Array.isArray(body?.discounts)
        ? body.discounts
        : Array.isArray(container?.offers)
          ? container.offers
          : [];
    if (raw.length === 0) {
      console.log(
        "[voice] valid-offers: no offers parsed; raw response =",
        body
      );
      return [];
    }
    return raw
      .filter((o: any) => o?.valid !== false) // drop explicitly-invalid ones
      .map((o: any): GokwikOffer => ({
        code: o.discountCode ?? o.code ?? o.coupon_code ?? o.couponCode ?? "",
        description:
          o.discountDetail ??
          o.additionalDetails?.bulletPoints?.[0] ??
          o.description ??
          "",
      }))
      .filter((o: GokwikOffer) => Boolean(o.code));
  } catch (e) {
    console.warn("[voice] valid-offers failed:", (e as Error)?.message);
    return [];
  }
}
