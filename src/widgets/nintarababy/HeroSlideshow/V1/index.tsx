"use client";

import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import {
  HeroSlideshowProps,
  DEFAULT_SLIDES,
  DESIGN_TOKENS,
  IMAGE_PATHS,
  type HeroSlide,
} from "../types";
import "../style.css";

/**
 * HeroSlideshow V1 Component
 *
 * A full-width auto-playing image slideshow using CSS scroll-snap.
 * Cloned from nintarababy.in hero section.
 *
 * Features:
 * - CSS scroll-snap for native smooth transitions
 * - Clone-first-last pattern for infinite loop
 * - Auto-play at 7000ms interval
 * - Dot indicators with progress fill animation
 * - Touch/swipe support via native scroll
 * - Responsive image swap at 550px breakpoint
 * - Pause on visibility hidden, resume on visible
 */
export const V1 = memo(function V1({
  data,
  settings,
  className,
}: HeroSlideshowProps) {
  // Build slides from settings (full paths), data, or defaults
  const slides: HeroSlide[] = React.useMemo(() => {
    const settingsSlides = settings?.slides;
    if (Array.isArray(settingsSlides) && settingsSlides.length > 0) {
      return settingsSlides.map((s, i) => ({
        index: i,
        desktopImage: s.desktopImage,
        mobileImage: s.mobileImage,
        href: s.href,
        alt: s.alt || "",
        loading: (i === 0 ? "eager" : "lazy") as "eager" | "lazy",
      }));
    }
    return data?.slides && data.slides.length > 0
      ? data.slides
      : DEFAULT_SLIDES;
  }, [settings?.slides, data?.slides]);

  const autoplayMs = settings?.autoplayMs ?? DESIGN_TOKENS.animation.autoplayMs;
  const mobileBreakpoint =
    settings?.mobileBreakpoint ?? DESIGN_TOKENS.breakpoints.mobileImageSwap;

  const slideCount = slides.length;
  const basePath = IMAGE_PATHS.basePath;

  // State: activeIndex is the real slide index (0 to slideCount-1)
  const [activeIndex, setActiveIndex] = useState(0);
  // Key that increments on every slide change to remount progress span
  const [dotAnimKey, setDotAnimKey] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isJumpingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserInteractingRef = useRef(false);
  const initDoneRef = useRef(false);

  // Total DOM slides: cloneLast + real slides + cloneFirst
  const totalDOMSlides = slideCount + 2;

  /**
   * Get the current slide width (= container width)
   */
  const getSlideWidth = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) {
      return 0;
    }
    return slider.offsetWidth;
  }, []);

  /**
   * Scroll to a specific DOM index (0-based including clones)
   */
  const scrollToDOMIndex = useCallback(
    (domIndex: number, smooth: boolean) => {
      const slider = sliderRef.current;
      if (!slider) {
        return;
      }
      const slideWidth = getSlideWidth();
      if (smooth) {
        slider.style.scrollBehavior = "smooth";
      } else {
        slider.style.scrollBehavior = "auto";
      }
      slider.scrollLeft = domIndex * slideWidth;
      if (smooth) {
        setTimeout(() => {
          if (slider) {
            slider.style.scrollBehavior = "smooth";
          }
        }, DESIGN_TOKENS.animation.scrollBehaviorResetMs);
      }
    },
    [getSlideWidth]
  );

  /**
   * Convert real index to DOM index (offset by 1 for prepended clone)
   */
  const realToDOMIndex = useCallback((realIndex: number) => {
    return realIndex + 1;
  }, []);

  /**
   * Go to a specific real slide index
   */
  const goToSlide = useCallback(
    (realIndex: number, smooth = true) => {
      const domIndex = realToDOMIndex(realIndex);
      scrollToDOMIndex(domIndex, smooth);
      setActiveIndex(realIndex);
      setDotAnimKey((prev) => prev + 1);
    },
    [realToDOMIndex, scrollToDOMIndex]
  );

  /**
   * Advance to the next slide
   */
  const goToNext = useCallback(() => {
    const nextReal = (activeIndex + 1) % slideCount;
    const nextDOM = realToDOMIndex(activeIndex) + 1;
    scrollToDOMIndex(nextDOM, true);
    setActiveIndex(nextReal);
    setDotAnimKey((prev) => prev + 1);
  }, [activeIndex, slideCount, realToDOMIndex, scrollToDOMIndex]);

  /**
   * Handle infinite loop teleport after scroll settles
   */
  const handleInfiniteLoop = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider || isJumpingRef.current) {
      return;
    }
    const slideWidth = getSlideWidth();
    if (slideWidth === 0) {
      return;
    }

    const scrollLeft = slider.scrollLeft;
    const currentDOMIndex = Math.round(scrollLeft / slideWidth);

    // At clone-last (position 0): teleport to real last slide
    if (currentDOMIndex === 0) {
      isJumpingRef.current = true;
      const realLastDOM = realToDOMIndex(slideCount - 1);
      scrollToDOMIndex(realLastDOM, false);
      setActiveIndex(slideCount - 1);
      setDotAnimKey((prev) => prev + 1);
      setTimeout(() => {
        isJumpingRef.current = false;
      }, DESIGN_TOKENS.animation.teleportDebounceMs);
      return;
    }

    // At clone-first (last DOM position): teleport to real first slide
    if (currentDOMIndex === totalDOMSlides - 1) {
      isJumpingRef.current = true;
      const realFirstDOM = realToDOMIndex(0);
      scrollToDOMIndex(realFirstDOM, false);
      setActiveIndex(0);
      setDotAnimKey((prev) => prev + 1);
      setTimeout(() => {
        isJumpingRef.current = false;
      }, DESIGN_TOKENS.animation.teleportDebounceMs);
      return;
    }

    // Normal slide: update active index from DOM position
    const realIndex = currentDOMIndex - 1;
    if (realIndex >= 0 && realIndex < slideCount) {
      if (realIndex !== activeIndex) {
        setActiveIndex(realIndex);
        setDotAnimKey((prev) => prev + 1);
      }
    }
  }, [
    getSlideWidth,
    realToDOMIndex,
    scrollToDOMIndex,
    slideCount,
    totalDOMSlides,
    activeIndex,
  ]);

  /**
   * Start autoplay
   */
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    autoplayRef.current = setInterval(() => {
      if (!isUserInteractingRef.current && !isJumpingRef.current) {
        goToNext();
      }
    }, autoplayMs);
  }, [autoplayMs, goToNext]);

  /**
   * Stop autoplay
   */
  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  /**
   * Initialize: set scrollLeft to skip past prepended clone
   */
  useEffect(() => {
    if (initDoneRef.current) {
      return;
    }
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    // Wait for layout to be computed
    requestAnimationFrame(() => {
      const slideWidth = getSlideWidth();
      if (slideWidth > 0) {
        slider.style.scrollBehavior = "auto";
        slider.scrollLeft = slideWidth; // Skip clone-last at position 0
        slider.style.scrollBehavior = "smooth";
        initDoneRef.current = true;
      }
    });
  }, [getSlideWidth]);

  /**
   * Autoplay lifecycle
   */
  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  /**
   * Visibility change: pause on hidden, resume on visible
   */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [startAutoplay, stopAutoplay]);

  /**
   * Scroll event handler: debounced scroll settle detection
   */
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      handleInfiniteLoop();
      if (isUserInteractingRef.current) {
        isUserInteractingRef.current = false;
        startAutoplay();
      }
    }, DESIGN_TOKENS.animation.scrollSettleMs);
  }, [handleInfiniteLoop, startAutoplay]);

  // Clear pending scroll-settle timer on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Touch handlers for mobile swipe
   */
  const handleTouchStart = useCallback(() => {
    isUserInteractingRef.current = true;
    stopAutoplay();
  }, [stopAutoplay]);

  /**
   * Dot click handler
   */
  const handleDotClick = useCallback(
    (realIndex: number) => {
      isUserInteractingRef.current = true;
      stopAutoplay();
      goToSlide(realIndex, true);
      setTimeout(() => {
        isUserInteractingRef.current = false;
        startAutoplay();
      }, 100);
    },
    [stopAutoplay, goToSlide, startAutoplay]
  );

  /**
   * Resize handler: re-center on current slide
   */
  useEffect(() => {
    const handleResize = () => {
      if (initDoneRef.current) {
        goToSlide(activeIndex, false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, goToSlide]);

  /**
   * Build the slide array: cloneLast + real slides + cloneFirst
   */
  const cloneLast = slides[slideCount - 1];
  const cloneFirst = slides[0];

  const autoplayDurationStyle = {
    "--autoplay-duration": `${autoplayMs}ms`,
  } as React.CSSProperties;

  return (
    <div
      className={`nintara-hero ${className ?? ""}`}
      style={autoplayDurationStyle}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
      data-testid="momsco-home-hero-section"
    >
      {/* Scroll track */}
      <div
        ref={sliderRef}
        className="nintara-hero__track"
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        aria-live="off"
      >
        {/* Clone of last slide (prepended) */}
        <SlideItem
          slide={cloneLast}
          basePath={basePath}
          mobileBreakpoint={mobileBreakpoint}
          isClone
          loading="lazy"
          aria-hidden="true"
        />

        {/* Real slides */}
        {slides.map((slide, i) => (
          <SlideItem
            key={slide.index}
            slide={slide}
            basePath={basePath}
            mobileBreakpoint={mobileBreakpoint}
            loading={i === 0 ? "eager" : "lazy"}
            aria-hidden={i !== activeIndex}
          />
        ))}

        {/* Clone of first slide (appended) */}
        <SlideItem
          slide={cloneFirst}
          basePath={basePath}
          mobileBreakpoint={mobileBreakpoint}
          isClone
          loading="lazy"
          aria-hidden="true"
        />
      </div>

      {/* Dot indicators */}
      <div
        className="nintara-hero__dots"
        role="tablist"
        aria-label="Slide indicators"
        data-testid="momsco-home-hero-dots"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.index}
            className="nintara-hero__dot"
            data-active={i === activeIndex ? "true" : "false"}
            data-testid="momsco-home-hero-dot"
            onClick={() => handleDotClick(i)}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Slide ${i + 1}`}
            type="button"
          >
            {i === activeIndex && (
              <span key={dotAnimKey} className="nintara-hero__dot-progress" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
});

/**
 * Single slide item with responsive <picture> element
 */
const SlideItem = memo(function SlideItem({
  slide,
  basePath,
  mobileBreakpoint,
  isClone,
  loading = "lazy",
  "aria-hidden": ariaHidden,
}: {
  slide: HeroSlide;
  basePath: string;
  mobileBreakpoint: number;
  isClone?: boolean;
  loading?: "eager" | "lazy";
  "aria-hidden"?: boolean | "true" | "false";
}) {
  // Support both full paths (/assets/...) and relative filenames (slide-0-desktop.webp)
  const desktopSrc =
    slide.desktopImage.startsWith("/") || slide.desktopImage.startsWith("http")
      ? slide.desktopImage
      : `${basePath}/${slide.desktopImage}`;
  const mobileSrc =
    slide.mobileImage.startsWith("/") || slide.mobileImage.startsWith("http")
      ? slide.mobileImage
      : `${basePath}/${slide.mobileImage}`;

  return (
    <div
      className="nintara-hero__slide"
      data-clone={isClone ? "true" : undefined}
      aria-hidden={ariaHidden}
      data-testid="momsco-home-hero-slide"
    >
      <a
        href={slide.href}
        className="nintara-hero__slide-link"
        tabIndex={isClone || ariaHidden ? -1 : 0}
        data-testid="momsco-home-hero-slide-link"
      >
        <picture>
          <source
            media={`(max-width: ${mobileBreakpoint}px)`}
            srcSet={mobileSrc}
            type="image/webp"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={desktopSrc}
            alt={slide.alt || ""}
            className="nintara-hero__slide-img"
            width={1440}
            height={480}
            loading={loading}
            fetchPriority={loading === "eager" ? "high" : undefined}
            decoding="async"
            draggable={false}
          />
        </picture>
      </a>
    </div>
  );
});

export { V1 as default };
