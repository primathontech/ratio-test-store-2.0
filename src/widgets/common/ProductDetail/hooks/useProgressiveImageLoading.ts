"use client";

import { useState, useEffect, useCallback } from "react";

interface UseProgressiveImageLoadingProps {
  totalImages: number;
  loadingDelay?: number;
  enableProgressiveLoading?: boolean;
}

interface UseProgressiveImageLoadingReturn {
  visibleImageIndices: Set<number>;
  shouldShowImage: (index: number) => boolean;
  resetLoading: () => void;
}

/**
 * Stagger thumbnails into view one-by-one — drives the 300ms spin-in
 * animation in `ThumbnailPreview`. Each thumbnail flips to "visible"
 * `i * loadingDelay` ms after mount, so consumers render an animated
 * placeholder until their slot becomes visible.
 *
 * Set `enableProgressiveLoading: false` to short-circuit and reveal all
 * thumbnails immediately (the hook still runs cheaply but every index
 * is reported visible).
 */
export const useProgressiveImageLoading = ({
  totalImages,
  loadingDelay = 150,
  enableProgressiveLoading = true,
}: UseProgressiveImageLoadingProps): UseProgressiveImageLoadingReturn => {
  const [visibleImageIndices, setVisibleImageIndices] = useState<Set<number>>(
    new Set()
  );

  const resetLoading = useCallback(() => {
    setVisibleImageIndices(new Set());
  }, []);

  const shouldShowImage = useCallback(
    (index: number) => {
      if (!enableProgressiveLoading) {
        return true;
      }
      return visibleImageIndices.has(index);
    },
    [visibleImageIndices, enableProgressiveLoading]
  );

  useEffect(() => {
    if (!enableProgressiveLoading || totalImages === 0) {
      setVisibleImageIndices(
        new Set(Array.from({ length: totalImages }, (_, i) => i))
      );
      return;
    }

    setVisibleImageIndices(new Set());

    const timeouts: NodeJS.Timeout[] = [];
    for (let i = 0; i < totalImages; i++) {
      timeouts.push(
        setTimeout(() => {
          setVisibleImageIndices((prev) => new Set([...Array.from(prev), i]));
        }, i * loadingDelay)
      );
    }

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [totalImages, loadingDelay, enableProgressiveLoading]);

  return { visibleImageIndices, shouldShowImage, resetLoading };
};
