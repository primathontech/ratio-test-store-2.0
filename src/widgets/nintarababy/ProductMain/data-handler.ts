import { cache } from "react";
import { getProductAverageRating } from "@/utils/get-review-api";

/**
 * Request-scoped memoized version of `getProductAverageRating`.
 * Multiple widgets on the same page asking for the same productId
 * will share a single Promise + parsed result.
 */
const fetchRating = cache(getProductAverageRating);

/**
 * Server-side enrichment for ProductMain.
 *
 * Takes the product data passed in by the page builder, fetches live
 * rating + review count from the Review Service
 * (GET /qa/pi/ps/api/v1/review/{productId}/average — Section 13.2),
 * and returns the data with `average_rating` / `rating_count` overwritten.
 *
 * Runs on the server during SSR/ISR so values land in the initial HTML —
 * no client flicker, SEO-indexable. Falls back to the original metafield
 * values if the Review Service errors or returns nothing.
 */
export async function enrichProductMainData(data: any): Promise<any> {
  const product = data?.data;
  if (!product?.id) {
    return data;
  }

  // Product ID may be a Shopify GID (gid://shopify/Product/12345);
  // the Review Service expects the bare numeric/string ID.
  const rawId = String(product.id);
  const productId = rawId.includes("/") ? rawId.split("/").pop()! : rawId;
  if (!productId) {
    return data;
  }

  const rating = await fetchRating(productId);
  if (!rating) {
    return data;
  }

  return {
    ...data,
    data: {
      ...product,
      average_rating: rating.average_rating,
      rating_count: rating.total_ratings,
    },
  };
}
