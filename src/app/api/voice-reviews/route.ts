/**
 * Voice reviews BFF — real ratings + top reviews for a product, so the agent
 * can truthfully answer "which has the best reviews / read the reviews" (search
 * does NOT return ratings). Backed by the same CustomerReviews backend the
 * storefront's review widgets use (src/utils/get-review-api.ts).
 *
 * The review APIs key on the numeric product id, so we resolve handle -> id via
 * the product-details endpoint first (same as /api/v1/product-id). Everything is
 * graceful: any failure returns an empty/neutral shape so the agent says "no
 * reviews yet" rather than inventing one.
 */

import { unstable_cache } from "next/cache";
import {
  getProductAverageRating,
  getProductReviews,
} from "@/utils/get-review-api";
import { fetchWithTimeout } from "@/utils/serverFetch";
import { voiceGuard } from "@/lib/voiceGuard";

const PRODUCT_API_URL = process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

// Cache the review payload per product for a few minutes. sort_results("rating")
// rates up to a dozen products at once, and shoppers re-sort often — this turns a
// repeated fan-out into one upstream call per product per window (the client-side
// ratingsCache only dedupes WITHIN a session; this dedupes across all of them).
const getReviewData = unstable_cache(
  async (productId: string) => {
    const [avg, revs] = await Promise.all([
      getProductAverageRating(productId),
      getProductReviews(productId, 1, 3, "rating_desc"),
    ]);
    return {
      productId,
      average_rating: avg?.average_rating ?? null,
      total_ratings: avg?.total_ratings ?? 0,
      top_reviews: (revs?.reviews ?? []).map((r) => ({
        rating: r.rating,
        title: r.title,
        text: r.description,
        name: r.name,
      })),
    };
  },
  ["voice-reviews"],
  { revalidate: 300 }
);

async function resolveId(handle: string): Promise<string | null> {
  try {
    if (!PRODUCT_API_URL) return null;
    const res = await fetchWithTimeout(
      `${PRODUCT_API_URL}/api/v1/product/details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          "gk-merchant-id": MERCHANT_ID,
        },
        body: JSON.stringify({ productHandle: handle }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const id = data?.product?.id || data?.data?.id || data?.id;
    return id ? String(id) : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const blocked = voiceGuard(req, "read", 150);
  if (blocked) return blocked;

  const { searchParams } = new URL(req.url);
  let productId = searchParams.get("productId");
  const handle = searchParams.get("handle");
  if (!productId && handle) productId = await resolveId(handle);
  const empty = { average_rating: null, total_ratings: 0, top_reviews: [] };
  if (!productId) return Response.json(empty);

  try {
    return Response.json(await getReviewData(productId));
  } catch {
    return Response.json(empty);
  }
}
