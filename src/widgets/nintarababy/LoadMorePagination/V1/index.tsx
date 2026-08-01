"use client";

import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { LoadMorePaginationProps } from "../types";
import "../style.css";

/* =====================================================================
   V1 -- Load More / Pagination button

   Source: nintarababy.in/collections/all-products
   Selector: .t4s-pagination-wrapper

   Layout:
   - Wrapper: text-align center, 40px padding-top, full width
   - Single centered pill button (border-radius 60px)
   - Outline style: transparent bg, 2px border via ::after pseudo
   - Sweep-to-right hover: ::before scaleX(0) -> scaleX(1), 0.5s ease-out
   - Text color transitions from #01464f -> #ffffff on hover, 0.3s ease-in-out
   - Desktop: 50px height, padding 0 45px, font 14px/600
   - Mobile (<768px): 44px height, padding 0 25px, font 13px/600
   - Loading state: text opacity->0, SVG spinner appears (rotator + dash)
   - Scroll reveal: translateY(2rem)->0 + opacity 0.01->1, 600ms
   ===================================================================== */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: LoadMorePaginationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const buttonText = settings?.buttonText ?? data?.buttonText ?? "Load More";
  const hasNextPage = data?.hasNextPage ?? true;

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) {
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [hidden, setHidden] = useState(false);

  // Listen for hasmore events from ProductGrid
  useEffect(() => {
    const handleHasMore = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.hasMore === "boolean") {
        setHidden(!detail.hasMore);
      }
    };

    window.addEventListener("nintara:hasmore", handleHasMore);
    // Ask ProductGrid for current state (handles mount-order timing)
    window.dispatchEvent(new CustomEvent("nintara:hasmore:query"));
    return () => window.removeEventListener("nintara:hasmore", handleHasMore);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isLoading) {
        return;
      }

      setIsLoading(true);

      // Dispatch load-more event to ProductGrid after a brief delay for UX
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("nintara:loadmore"));
        setIsLoading(false);
      }, 800);
    },
    [isLoading]
  );

  if (!hasNextPage || hidden) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className={`nintara-lm${isRevealed ? " nintara-lm--revealed" : ""} ${className ?? ""}`}
    >
      <button
        className={`nintara-lm__btn${isLoading ? " nintara-lm__btn--loading" : ""}`}
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isLoading ? "Loading more products" : buttonText}
        aria-busy={isLoading}
      >
        {/* Text label */}
        <span className="nintara-lm__btn-text">{buttonText}</span>

        {/* SVG spinner (visible only when loading) -- matches source exactly:
            SVG 16x16, viewBox 0 0 66 66, circle r=30, stroke-width=6.
            Rotator animation: rotate 0->270deg, 1.4s linear infinite.
            Dash animation: stroke-dashoffset 280->75->280 with rotation, 1.4s ease-in-out infinite. */}
        <span className="nintara-lm__spinner" aria-hidden="true">
          <svg
            className="nintara-lm__spinner-svg"
            width="16"
            height="16"
            viewBox="0 0 66 66"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="presentation"
          >
            <circle
              className="nintara-lm__spinner-path"
              fill="none"
              strokeWidth="6"
              cx="33"
              cy="33"
              r="30"
            />
          </svg>
        </span>
      </button>
    </div>
  );
});

export { V1 as default };
