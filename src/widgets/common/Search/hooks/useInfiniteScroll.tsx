"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({
  hasMore,
  loading,
  onLoadMore,
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (!entry?.isIntersecting) {
        return;
      }
      if (!hasMore || loading) {
        return;
      }
      onLoadMore();
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!hasMore || loading) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px 0px 200px 0px",
      threshold: 0,
    });

    observer.observe(target);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, hasMore, loading]);

  return { sentinelRef };
};
