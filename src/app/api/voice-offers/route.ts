/**
 * Voice offers BFF — the store's REAL published coupons/offers, so the agent can
 * answer "any coupons or offers?" from live data (never invented codes). Same
 * GoKwik discount source the cart drawer uses (integrations/.../coupons/useCoupons).
 *
 * Graceful: if the discount API isn't configured or fails, returns an empty list
 * and the agent says discounts may still apply at checkout — it never fabricates
 * a coupon code.
 */

import { getCommerceClient } from "@/config";
import { voiceGuard } from "@/lib/voiceGuard";

const DISCOUNT_API_URL = process.env.NEXT_PUBLIC_GOKWIK_DISCOUNT_API_URL;

// Guarded via voiceGuard (reads headers → dynamic), so no route-level
// `revalidate`; the per-IP rate limit is the upstream-abuse backstop.

export async function GET(req: Request) {
  const blocked = voiceGuard(req, "read", 150);
  if (blocked) return blocked;
  if (!DISCOUNT_API_URL) return Response.json({ offers: [] });
  try {
    const client: any = getCommerceClient();
    const response = await client.fetchRequest({
      url: DISCOUNT_API_URL,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: 1,
        limit: 10,
        status: "published",
        visibility: "always",
        merchant_id: process.env.NEXT_PUBLIC_MERCHANT_ID,
      }),
    });
    // useCoupons shape: response.data.data.data === array of discounts
    const list = response?.data?.data?.data ?? [];
    const offers = Array.isArray(list)
      ? list.map((d: any) => ({
          title: d.title,
          code: d.code,
          description: d.description,
        }))
      : [];
    return Response.json({ offers });
  } catch {
    return Response.json({ offers: [] });
  }
}
