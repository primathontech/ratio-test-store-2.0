"use client";

import React, { memo, useState, useRef, useCallback, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselBreakpoint {
  /** Min viewport width in px (0 = mobile default) */
  minWidth: number;
  /** Number of cards visible (fractional = peek, e.g. 2.3) */
  cards: number;
  /** Gap between cards in px */
  gap: number;
}

export interface SwipeCarouselProps {
  /** Total number of items */
  itemCount: number;
  /**
   * Breakpoints sorted ascending by minWidth.
   * The last matching breakpoint wins.
   * Example: [
   *   { minWidth: 0,    cards: 2.3, gap: 12 },
   *   { minWidth: 768,  cards: 3,   gap: 16 },
   *   { minWidth: 1024, cards: 4,   gap: 16 },
   *   { minWidth: 1440, cards: 5,   gap: 16 },
   * ]
   */
  breakpoints: CarouselBreakpoint[];
  /** Render function for each slide */
  renderItem: (index: number, cardWidth: number) => React.ReactNode;
  /** Render prev arrow — receives (onClick, disabled) */
  renderPrev?: (onClick: () => void, disabled: boolean) => React.ReactNode;
  /** Render next arrow — receives (onClick, disabled) */
  renderNext?: (onClick: () => void, disabled: boolean) => React.ReactNode;
  /** Extra className on the viewport container */
  className?: string;
  /** Minimum swipe distance in px to trigger slide (default: 40) */
  swipeThreshold?: number;
  /** Reset index to 0 when this value changes (e.g. active tab) */
  resetKey?: string | number;
}

/* ------------------------------------------------------------------ */
/*  Resolve breakpoint                                                 */
/* ------------------------------------------------------------------ */

function resolveBreakpoint(
  breakpoints: CarouselBreakpoint[],
  width: number
): CarouselBreakpoint {
  let match = breakpoints[0];
  for (const bp of breakpoints) {
    if (width >= bp.minWidth) match = bp;
  }
  return match;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const SwipeCarousel = memo(function SwipeCarousel({
  itemCount,
  breakpoints,
  renderItem,
  renderPrev,
  renderNext,
  className,
  swipeThreshold = 40,
  resetKey,
}: SwipeCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [bp, setBp] = useState<CarouselBreakpoint>(
    () => breakpoints[0] // Start with mobile breakpoint (smallest)
  );

  /* ---------- Mount + Resize listener ---------- */
  useEffect(() => {
    const update = () => {
      setBp(resolveBreakpoint(breakpoints, window.innerWidth));
    };
    update();
    setMounted(true);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoints]);

  /* ---------- Reset index on key change ---------- */
  useEffect(() => {
    setCurrentIndex(0);
  }, [resetKey]);

  /* ---------- Derived values ---------- */
  const { cards: visibleCards, gap: gapPx } = bp;
  const maxIndex = Math.max(0, Math.ceil(itemCount - visibleCards));
  const safeIndex = Math.min(currentIndex, maxIndex);
  const canGoPrev = safeIndex > 0;
  const canGoNext = safeIndex < maxIndex;

  /* ---------- Compute pixel transform ---------- */
  const [transformPx, setTransformPx] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const compute = () => {
      if (!viewportRef.current) return;
      const vw = viewportRef.current.offsetWidth;
      const cw = (vw - gapPx * (Math.floor(visibleCards) - 1)) / visibleCards;
      setCardWidth(cw);
      setTransformPx(-(safeIndex * (cw + gapPx)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [safeIndex, visibleCards, gapPx]);

  /* ---------- Prev / Next (scroll by full visible page) ---------- */
  const step = Math.max(1, Math.floor(visibleCards));

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + step, maxIndex));
  }, [maxIndex, step]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - step, 0));
  }, [step]);

  /* ---------- Touch swipe ---------- */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    // If horizontal movement dominates, this is a swipe — prevent page scroll
    if (dx > dy && dx > 10) {
      isSwiping.current = true;
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwiping.current) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) >= swipeThreshold) {
        if (dx < 0) goNext();
        else goPrev();
      }
    },
    [swipeThreshold, goNext, goPrev]
  );

  /* ---------- Mouse drag ---------- */
  const mouseStartX = useRef(0);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only primary button
    if (e.button !== 0) return;
    mouseStartX.current = e.clientX;
    isDragging.current = true;
    hasDragged.current = false;
    e.preventDefault(); // prevent text selection
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = Math.abs(e.clientX - mouseStartX.current);
      if (dx > 5) hasDragged.current = true;
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      const dx = e.clientX - mouseStartX.current;
      if (Math.abs(dx) >= swipeThreshold) {
        if (dx < 0) goNext();
        else goPrev();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [swipeThreshold, goNext, goPrev]);

  /* Prevent click on links after drag */
  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
    }
  }, []);

  /* ---------- Render ---------- */
  return (
    <div
      className="relative"
      style={{ visibility: mounted ? "visible" : "hidden" }}
    >
      {renderPrev?.(goPrev, !canGoPrev)}
      {renderNext?.(goNext, !canGoNext)}

      <div
        ref={viewportRef}
        className={`overflow-hidden ${className || ""}`}
        style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onClickCapture={handleClickCapture}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${transformPx}px)`,
            transition: isDragging.current ? "none" : "transform 0.4s ease",
            gap: `${gapPx}px`,
          }}
        >
          {Array.from({ length: itemCount }).map((_, idx) => (
            <div
              key={idx}
              className="flex-shrink-0"
              style={{
                width: `calc((100% - ${gapPx * (Math.floor(visibleCards) - 1)}px) / ${visibleCards})`,
              }}
            >
              {renderItem(idx, cardWidth)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
