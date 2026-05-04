"use client";

import React, { memo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnnouncementBarProps, AnnouncementItem } from "../types";

/**
 * Default announcement items — matches the BBlunt source site
 */
const DEFAULT_ITEMS: AnnouncementItem[] = [
  {
    text: "Buy 3 Products at \u20B9799 | Use code : <strong>FLAT3</strong>",
    href: "/pages/flat3",
  },
  {
    text: "Shop for \u20B9499 & Get 2 Best Sellers FREE | Code : <strong>FREEIM</strong>",
    href: "/pages/shine-squad-weekly-offer",
  },
];

// Utility function to format href for tooltip
const formatHrefForTooltip = (href: string): string => {
  // Remove /pages/ prefix if it exists
  const cleanPath = href.replace(/^\/pages\//, "");

  // If the path contains hyphens, return as-is (keep hyphens)
  if (cleanPath.includes("-")) {
    return cleanPath;
  }

  // If no hyphens, capitalize the entire string
  return cleanPath.toUpperCase();
};

/**
 * AnnouncementBar V1 Component
 *
 * A full-width marquee bar with continuously scrolling promotional text
 * on a black background. Pauses on hover. Implements a CSS-animation-based
 * infinite scroll by duplicating content to fill the viewport seamlessly.
 */
export const V1 = memo(function V1({
  settings,
  className,
}: AnnouncementBarProps) {
  const items = settings?.items ?? DEFAULT_ITEMS;
  const bgColor = settings?.backgroundColor ?? "#000000";
  const textColor = settings?.textColor ?? "#ffffff";
  const speed = settings?.speed ?? 35;
  const pauseOnHover = settings?.pauseOnHover ?? true;

  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const isPausedRef = useRef(false);
  const contentWidthRef = useRef(0);

  const animate = useCallback(() => {
    if (!marqueeRef.current) {
      return;
    }

    if (!isPausedRef.current) {
      positionRef.current -= speed / 60;
      if (
        contentWidthRef.current > 0 &&
        Math.abs(positionRef.current) >= contentWidthRef.current
      ) {
        positionRef.current += contentWidthRef.current;
      }
      marqueeRef.current.style.transform = `translateX(${positionRef.current}px)`;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [speed]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !marqueeRef.current) {
      return;
    }

    // Measure the width of one set of items
    const firstChild = marqueeRef.current.children[0] as HTMLElement | null;
    if (firstChild) {
      contentWidthRef.current = firstChild.offsetWidth;
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const handlePointerEnter = useCallback(() => {
    if (pauseOnHover) {
      isPausedRef.current = true;
    }
  }, [pauseOnHover]);

  const handlePointerLeave = useCallback(() => {
    if (pauseOnHover) {
      isPausedRef.current = false;
    }
  }, [pauseOnHover]);

  if (!items || items.length === 0) {
    return null;
  }

  /**
   * Renders one set of marquee items. We render 4 duplicates
   * to ensure the strip is wide enough to cover the viewport
   * during continuous scrolling.
   */
  const renderItemSet = (setIndex: number) => (
    <div
      key={setIndex}
      className="inline-flex shrink-0 items-center"
      aria-hidden={setIndex > 0 ? "true" : undefined}
    >
      {items.map((item, i) => {
        const tooltipText = item.href ? formatHrefForTooltip(item.href) : "";

        return (
          <div
            key={`${setIndex}-${i}`}
            className="relative inline-flex items-center pr-[40px] mr-[20px] lg:pr-[46px] lg:mr-[23px]"
          >
            <p className="py-[11px] mb-0">
              <Link
                href={item.href}
                title={tooltipText}
                className="no-underline"
                style={{ color: textColor }}
                // eslint-disable-next-line no-restricted-syntax
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </p>
            {/* Separator line (::after equivalent) */}
            <span
              className="absolute top-0 right-0 bottom-0 my-auto h-[1px] w-[22px]"
              style={{ backgroundColor: textColor }}
              aria-hidden="true"
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className={`w-full overflow-hidden ${className ?? ""}`}
      style={{ backgroundColor: bgColor, zIndex: 23 }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className="w-full px-[3px]">
        <div className="relative overflow-hidden h-[41px]">
          <div
            ref={marqueeRef}
            className="flex whitespace-nowrap will-change-transform"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "19px",
              color: textColor,
            }}
          >
            {/* Render 4 copies for seamless looping */}
            {renderItemSet(0)}
            {renderItemSet(1)}
            {renderItemSet(2)}
            {renderItemSet(3)}
          </div>
        </div>
      </div>
    </div>
  );
});

export { V1 as default };
