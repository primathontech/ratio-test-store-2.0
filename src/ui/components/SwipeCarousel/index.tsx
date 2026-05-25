"use client";

import React, { memo, useState, useRef, useCallback, useEffect } from "react";
import useResponsive from "@/hooks/useResponsive";

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
/*  Pick a carousel breakpoint from the responsive flags               */
/* ------------------------------------------------------------------ */

/**
 * Map the useResponsive hook's flags onto the carousel's breakpoint list:
 *   isMobile     → smallest minWidth (mobile bucket, <768)
 *   isTabletWide → largest bp with minWidth < 1150 (the 992 bucket, 992–1149)
 *   isTablet     → largest bp with minWidth < 992 (the 768 bucket, 768–991)
 *   isDesktop    → largest bp overall (≥1150)
 */
function pickBreakpoint(
  breakpoints: CarouselBreakpoint[],
  flags: { isMobile: boolean; isTablet: boolean; isTabletWide: boolean }
): CarouselBreakpoint {
  if (breakpoints.length === 0) {
    return { minWidth: 0, cards: 1, gap: 0 };
  }
  // Defensive: ensure ascending order.
  const sorted = [...breakpoints].sort((a, b) => a.minWidth - b.minWidth);

  if (flags.isMobile) {
    return sorted[0];
  }
  if (flags.isTabletWide) {
    // Upper tablet (992–1149): largest bp with minWidth < 1150.
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].minWidth < 1150) {
        return sorted[i];
      }
    }
    return sorted[0];
  }
  if (flags.isTablet) {
    // Lower tablet (768–991): largest bp with minWidth < 992.
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].minWidth < 992) {
        return sorted[i];
      }
    }
    return sorted[0];
  }
  // isDesktop
  return sorted[sorted.length - 1];
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

  // Source of truth for breakpoint: the shared useResponsive hook.
  // The hook owns its own resize listener AND handles editor-preview
  // breakpoint switching — no `window.innerWidth` access here.
  const { isMobile, isTablet, isTabletWide } = useResponsive();

  /* ---------- Resolve carousel breakpoint from flags ----------
   *
   * Pre-hydration default = the smallest (mobile) breakpoint.
   *
   * Why: `useResponsive` returns `isDesktop: true` on the server and
   * during the first client render before its mount effect fires. Without
   * this guard `pickBreakpoint` would resolve to the desktop card count
   * (e.g. 5 cards) on SSR, then snap to the real value (e.g. 2.3 cards)
   * once useResponsive measures the viewport — producing a visible reflow
   * on mobile page refresh. By forcing the smallest breakpoint until
   * `mounted` flips true, mobile users (the majority) get the correct
   * 2.3-cards layout on first paint. Desktop users still see a one-frame
   * mobile layout before snapping to desktop, but that direction is less
   * jarring (uniform-width cards just multiply in count). */
  const bp = !mounted
    ? breakpoints.length > 0
      ? [...breakpoints].sort((a, b) => a.minWidth - b.minWidth)[0]
      : { minWidth: 0, cards: 1, gap: 0 }
    : pickBreakpoint(breakpoints, { isMobile, isTablet, isTabletWide });

  useEffect(() => {
    setMounted(true);
  }, []);

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
      if (!viewportRef.current) {
        return;
      }
      const el = viewportRef.current;
      const cs = getComputedStyle(el);
      // Viewport horizontal padding acts as an edge gutter: cards sit at
      // x=padL initially but can scroll OVER the padding area (overflow:hidden
      // clips at the padding box edge, not the content edge). This matches
      // the "16px gutter on first/last only" pattern used by e.g. bblunt.com.
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const vw = el.offsetWidth;
      const innerW = vw - padL - padR;
      const cw =
        (innerW - gapPx * (Math.floor(visibleCards) - 1)) / visibleCards;
      setCardWidth(cw);
      // Index 0: keep track at content-box origin so the first card sits at
      // x=padL (the visible left gutter). Index > 0: shift by an extra padL
      // so the active card snaps flush to viewport x=0 — the gutter only
      // exists at the start, not on every step.
      const desired = safeIndex === 0 ? 0 : -(padL + safeIndex * (cw + gapPx));
      // Clamp so the final position aligns the last card's right edge with
      // x = viewport_width - padR (the visible right gutter).
      const totalContent = itemCount * cw + Math.max(0, itemCount - 1) * gapPx;
      const maxScroll = Math.max(0, padL + totalContent + padR - vw);
      setTransformPx(Math.max(desired, -maxScroll));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [safeIndex, visibleCards, gapPx, itemCount]);

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
      if (!isSwiping.current) {
        return;
      }
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) >= swipeThreshold) {
        if (dx < 0) {
          goNext();
        } else {
          goPrev();
        }
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
    if (e.button !== 0) {
      return;
    }
    mouseStartX.current = e.clientX;
    isDragging.current = true;
    hasDragged.current = false;
    e.preventDefault(); // prevent text selection
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) {
        return;
      }
      const dx = Math.abs(e.clientX - mouseStartX.current);
      if (dx > 5) {
        hasDragged.current = true;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) {
        return;
      }
      isDragging.current = false;
      const dx = e.clientX - mouseStartX.current;
      if (Math.abs(dx) >= swipeThreshold) {
        if (dx < 0) {
          goNext();
        } else {
          goPrev();
        }
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
                width:
                  cardWidth > 0
                    ? `${cardWidth}px`
                    : `calc((100% - ${gapPx * (Math.floor(visibleCards) - 1)}px) / ${visibleCards})`,
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
