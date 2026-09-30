"use client";

import React, { useEffect, useRef } from "react";

interface LoadMoreProps {
  onLoadMore: () => void | Promise<void>;
  hasNextPage: boolean;
  isLoading: boolean;
  /** Kept for API compatibility — pagination is always infinite-scroll. */
  autoLoadMore?: boolean;
}

/* Grid classes MUST match the product grid in V1 (index.tsx) so the skeleton
 * batch lines up seamlessly under the real products while loading. */
const GRID_CLASSES = "grid grid-cols-2 md:grid-cols-3 xl2:grid-cols-4 gap-4";

/* How many skeleton cards to show while the next batch loads. Enough to fill
 * ~2 rows so fast scrollers see loading cards, never a blank gap. */
const SKELETON_COUNT = 8;

/* A single product-card skeleton — mirrors the CartAwareProductCard shape
 * (image + title lines + price + CTA) in the Refined Monochrome palette. */
const ProductCardSkeleton = () => (
  <div className="h-full overflow-hidden rounded-2xl md:border md:border-neutral-200">
    <div className="aspect-square w-full animate-pulse bg-neutral-100" />
    <div className="space-y-2.5 p-3">
      <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
      <div className="h-3.5 w-4/5 animate-pulse rounded bg-neutral-200" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-100" />
      <div className="mt-3 h-9 w-full animate-pulse rounded-full bg-neutral-100" />
    </div>
  </div>
);

/**
 * Infinite-scroll pagination. Renders an invisible sentinel that fires
 * `onLoadMore` via IntersectionObserver *well before* the user reaches the end
 * (large rootMargin → preloads the next batch), and shows a full skeleton grid
 * in place of the incoming products while the request is in flight — so a fast
 * scroller always sees loading cards, never a blank white gap.
 *
 * Renders nothing once `hasNextPage` is false.
 */
export const LoadMore = ({
  onLoadMore,
  hasNextPage,
  isLoading,
}: LoadMoreProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (!hasNextPage) {
      return;
    }
    const node = sentinelRef.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingRef.current) {
          onLoadMore();
        }
      },
      // Preload aggressively: start fetching ~1200px before the sentinel is
      // visible so the next batch is usually ready by the time it's scrolled to.
      { rootMargin: "1200px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, onLoadMore]);

  if (!hasNextPage) {
    return null;
  }

  return (
    <>
      {isLoading && (
        <div
          data-testid="collection-load-more-skeletons"
          aria-hidden="true"
          className={`mt-4 ${GRID_CLASSES}`}
        >
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}
      {/* Sentinel sits AFTER the skeletons so the observer stays below the fold
          while a batch loads, ready to trigger the following page. */}
      <div
        ref={sentinelRef}
        data-testid="collection-load-more-sentinel"
        aria-hidden="true"
        className="h-px"
      />
      <span className="sr-only" role="status" aria-live="polite">
        {isLoading ? "Loading more products" : ""}
      </span>
    </>
  );
};
