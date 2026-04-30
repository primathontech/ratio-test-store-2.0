"use client";

import React, { useEffect, useRef } from "react";

import { ThumbnailPreview } from "./ThumbnailPreview";
import { ProductImage } from "../types";
import { useProgressiveImageLoading } from "../hooks/useProgressiveImageLoading";

interface ThumbnailContainerProps {
  images: ProductImage[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  layout: "vertical" | "horizontal";

  thumbnailSize: number;
  thumbnailRadius: number;
  thumbnailSpacing: number;
  activeThumbnailBorderColor: string;
  activeThumbnailBorderWidth: number;
  thumbnailLayout: string;

  containerRef: React.RefObject<HTMLDivElement>;

  /** Stagger thumbnails into view with a spin-in animation. */
  enableProgressiveLoading?: boolean;
  /** Per-thumbnail reveal delay (ms) — defaults to 150ms (reference value). */
  progressiveLoadingDelay?: number;
  /** Render a same-size pulsing skeleton until each slot becomes visible. */
  showLoadingPlaceholders?: boolean;
}

/**
 * Scrollable thumbnail strip below the main image. Auto-scrolls so the
 * active thumbnail stays in view as the user navigates the main slider.
 */
export const ThumbnailContainer: React.FC<ThumbnailContainerProps> = ({
  images,
  currentIndex,
  onThumbnailClick,
  layout,
  thumbnailSize,
  thumbnailRadius,
  thumbnailSpacing,
  activeThumbnailBorderColor,
  activeThumbnailBorderWidth,
  thumbnailLayout,
  containerRef,
  enableProgressiveLoading = true,
  progressiveLoadingDelay = 150,
  showLoadingPlaceholders = true,
}) => {
  const thumbnailRefs = useRef<(HTMLElement | null)[]>([]);

  // Horizontal strip is sized to show exactly 6 thumbnails per viewport
  // regardless of container width — see `horizontalThumbnailSize` below.
  const HORIZONTAL_VISIBLE_COUNT = 6;
  const HORIZONTAL_GAP_PX = 10;

  // Drives the staggered spin-in animation in `ThumbnailPreview`.
  const { shouldShowImage } = useProgressiveImageLoading({
    totalImages: images.length,
    loadingDelay: progressiveLoadingDelay,
    enableProgressiveLoading,
  });

  useEffect(() => {
    thumbnailRefs.current = thumbnailRefs.current.slice(0, images.length);
  }, [images.length]);

  // Custom eased smooth-scroll to keep the active thumbnail centred.
  // Uses RAF + easeInOutCubic so we get the same animation curve cross-browser
  // (native scrollTo({ behavior: "smooth" }) is too fast and varies per UA).
  useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[currentIndex];
    if (!activeThumbnail || !containerRef.current) {
      return;
    }

    const container = containerRef.current;

    let targetScroll: number;
    let currentScroll: number;
    if (layout === "horizontal") {
      targetScroll =
        activeThumbnail.offsetLeft -
        container.offsetLeft -
        container.clientWidth / 2 +
        activeThumbnail.offsetWidth / 2;
      currentScroll = container.scrollLeft;
    } else {
      targetScroll =
        activeThumbnail.offsetTop -
        container.offsetTop -
        container.clientHeight / 2 +
        activeThumbnail.offsetHeight / 2;
      currentScroll = container.scrollTop;
    }

    const duration = 500;
    const startTime = performance.now();
    const distance = targetScroll - currentScroll;

    const easeInOutCubic = (t: number): number =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newScroll = currentScroll + distance * easeInOutCubic(progress);

      if (layout === "horizontal") {
        container.scrollLeft = newScroll;
      } else {
        container.scrollTop = newScroll;
      }
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, [currentIndex, layout, containerRef]);

  const renderThumbnails = (size: number | string) =>
    images.map((image, index) => (
      <ThumbnailPreview
        key={image.id || index}
        ref={(el) => {
          thumbnailRefs.current[index] = el;
        }}
        image={image}
        isActive={index === currentIndex}
        onClick={() => onThumbnailClick(index)}
        size={size}
        radius={thumbnailRadius}
        activeBorderColor={activeThumbnailBorderColor}
        activeBorderWidth={activeThumbnailBorderWidth}
        isVisible={shouldShowImage(index)}
        showLoadingPlaceholder={showLoadingPlaceholders}
      />
    ));

  if (layout === "vertical") {
    return (
      <div className="flex flex-col gap-2 relative flex-shrink-0">
        <div
          ref={containerRef}
          className="flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ gap: `${thumbnailSpacing}px` }}
        >
          {renderThumbnails(thumbnailSize)}
        </div>
      </div>
    );
  }

  // Each thumbnail takes 1/6 of the container minus the 5 gaps between them
  // so exactly `HORIZONTAL_VISIBLE_COUNT` slots fit in view at any width.
  const horizontalThumbnailSize = `calc((100% - ${
    (HORIZONTAL_VISIBLE_COUNT - 1) * HORIZONTAL_GAP_PX
  }px) / ${HORIZONTAL_VISIBLE_COUNT})`;

  return (
    <div className="relative hidden md:block">
      <div
        ref={containerRef}
        className={`flex ${
          thumbnailLayout === "multi-row" ? "flex-wrap" : "flex-nowrap"
        } overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
        style={{ maxWidth: "100%", gap: `${HORIZONTAL_GAP_PX}px` }}
      >
        {renderThumbnails(horizontalThumbnailSize)}
      </div>
    </div>
  );
};
