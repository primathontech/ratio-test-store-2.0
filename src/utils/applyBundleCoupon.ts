"use client";

import { getCommerceClient } from "@/config/commerce";

/**
 * Applies a discount code to the live GoKwik cart so it carries into checkout.
 *
 * Momsco has no local cart-proxy routes, so (like `useCoupons`) this calls the
 * GoKwik discount service directly via the commerce client's `fetchRequest`.
 * The endpoint/headers mirror the GoKwik apply-discount contract:
 *   POST <apply-discount-url>  body: { cart_id, discount_code }
 *   headers: gk-merchant-id, x-cart-token
 *
 * Configure the endpoint via NEXT_PUBLIC_GOKWIK_APPLY_DISCOUNT_API_URL. If that
 * is unset it is derived from NEXT_PUBLIC_GOKWIK_DISCOUNT_API_URL by swapping the
 * fetch path for the apply path.
 *
 * Returns true on success. Throws on failure so the caller can decide whether to
 * proceed undiscounted.
 */
const APPLY_DISCOUNT_URL =
  process.env.NEXT_PUBLIC_GOKWIK_APPLY_DISCOUNT_API_URL ||
  (process.env.NEXT_PUBLIC_GOKWIK_DISCOUNT_API_URL || "").replace(
    /\/gk-discounts\/[^/?#]+/,
    "/gk-discounts/apply-discount"
  );

export async function applyBundleCoupon(
  cartToken: string,
  discountCode: string
): Promise<boolean> {
  if (!cartToken || !discountCode) {
    return false;
  }
  if (!APPLY_DISCOUNT_URL) {
    throw new Error("Apply-discount endpoint is not configured");
  }

  const client = getCommerceClient();

  // Resolve the GoKwik cart_* id from the UUID cart token. The apply-discount
  // endpoint rejects the raw token ("Expected format: cart_* or ckout_*").
  // getCart sends the token via the X-Cart-Token header and returns the cart,
  // whose `id` is the cart_* value (mirrors plixkids' resolveCartId).
  const cartRes = await client.getCart({ id: cartToken });
  const cartId = (cartRes?.data?.id ?? "") as string;
  if (!cartId) {
    throw new Error("Could not resolve cart id for discount");
  }

  const response = await client.fetchRequest({
    url: APPLY_DISCOUNT_URL,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "gk-merchant-id":
        process.env.NEXT_PUBLIC_MERCHANT_ID ||
        process.env.NEXT_PUBLIC_GOKWIK_MID ||
        "",
      "x-cart-token": cartToken,
    },
    body: JSON.stringify({ cart_id: cartId, discount_code: discountCode }),
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to apply bundle discount");
  }
  return true;
}
