"use client";

import { useEffect, useState } from "react";
import { getProductAverageRating } from "@/utils/get-review-api";

export interface ProductRating {
  score: number;
  reviewCount: number;
}

const ratingCache = new Map<string, ProductRating>();
const inFlight = new Map<string, Promise<ProductRating | null>>();

function normalizeId(raw: string): string {
  return raw.includes("/") ? (raw.split("/").pop() ?? raw) : raw;
}

async function fetchRating(productId: string): Promise<ProductRating | null> {
  const cached = ratingCache.get(productId);
  if (cached) {
    return cached;
  }
  const existing = inFlight.get(productId);
  if (existing) {
    return existing;
  }
  const promise = (async () => {
    try {
      const data = await getProductAverageRating(productId);
      if (!data) {
        return null;
      }
      const result: ProductRating = {
        score: Number(data.average_rating) || 0,
        reviewCount: Number(data.total_ratings) || 0,
      };
      ratingCache.set(productId, result);
      return result;
    } finally {
      inFlight.delete(productId);
    }
  })();
  inFlight.set(productId, promise);
  return promise;
}

/**
 * Fetch average rating + review count for a list of product IDs in parallel.
 * Results are cached at module scope so navigating between pages does not refetch.
 */
export function useProductRatings(productIds: string[]): {
  ratings: Record<string, ProductRating>;
  loading: boolean;
} {
  const normalized = productIds.map(normalizeId).filter(Boolean);
  const key = normalized.join("|");

  const [ratings, setRatings] = useState<Record<string, ProductRating>>(() => {
    const seed: Record<string, ProductRating> = {};
    for (const id of normalized) {
      const cached = ratingCache.get(id);
      if (cached) {
        seed[id] = cached;
      }
    }
    return seed;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (normalized.length === 0) {
      return;
    }
    let cancelled = false;

    const seedFromCache: Record<string, ProductRating> = {};
    for (const id of normalized) {
      const r = ratingCache.get(id);
      if (r) {
        seedFromCache[id] = r;
      }
    }
    setRatings(seedFromCache);

    const missing = normalized.filter((id) => !ratingCache.has(id));
    if (missing.length === 0) {
      return;
    }
    setLoading(true);
    Promise.allSettled(missing.map((id) => fetchRating(id))).then(() => {
      if (cancelled) {
        return;
      }
      const next: Record<string, ProductRating> = {};
      for (const id of normalized) {
        const r = ratingCache.get(id);
        if (r) {
          next[id] = r;
        }
      }
      setRatings(next);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { ratings, loading };
}

export { normalizeId as normalizeProductId };
