"use client";

import React, { useEffect, useRef } from "react";

interface LoadMoreProps {
  onLoadMore: () => void | Promise<void>;
  hasNextPage: boolean;
  isLoading: boolean;
  /** Kept for API compatibility — pagination is always infinite-scroll. */
  autoLoadMore?: boolean;
}

/**
 * Infinite-scroll pagination. Renders an invisible sentinel that fires
 * `onLoadMore` via IntersectionObserver when it scrolls into view, plus
 * a shimmer grid in place of the next batch while the request is in flight.
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
      { rootMargin: "200px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, onLoadMore]);

  if (!hasNextPage) {
    return null;
  }

  return (
    <>
      <div
        ref={sentinelRef}
        data-testid="collection-load-more-sentinel"
        aria-hidden="true"
        className="h-px"
      />
      {isLoading && (
        <div
          data-testid="collection-load-more-spinner"
          className="flex items-center justify-center py-6 md:py-8"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}
    </>
  );
};
