"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  TestimonialsCarouselProps,
  TestimonialReview,
  DEFAULT_HEADING,
  DEFAULT_SUBHEADING,
  DEFAULT_REVIEWS,
  IMAGE_PATHS,
} from "../types";
import "../style.css";

/**
 * TestimonialsCarousel V1 Component
 *
 * Cloned from nintarababy.in product page testimonials section.
 * CSS grid scroll-snap carousel with:
 * - 4-col desktop (>1200px), 3-col tablet (901-1200px),
 *   2-col small tablet (481-900px), 80% peek mobile (<=480px)
 * - Gold arrow buttons (#c49330) positioned -35px outside bounds
 * - Dot navigation on mobile only (<=480px)
 * - Cards: white bg, shadow, bottom decoration image
 * - Star ratings (inline star icon), reviewer name
 */
export function V1({ data, className }: TestimonialsCarouselProps) {
  const heading = data?.heading ?? DEFAULT_HEADING;
  const subheading = data?.subheading ?? DEFAULT_SUBHEADING;
  const reviews: TestimonialReview[] = data?.reviews ?? DEFAULT_REVIEWS;

  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const [totalDots, setTotalDots] = useState(3);

  /**
   * Calculate visible card count based on viewport width
   */
  const getVisibleCount = useCallback((): number => {
    if (typeof window === "undefined") {
      return 4;
    }
    const w = window.innerWidth;
    if (w <= 480) {
      return 1;
    }
    if (w <= 900) {
      return 2;
    }
    if (w <= 1200) {
      return 3;
    }
    return 4;
  }, []);

  /**
   * Get card width + gap for scroll math
   */
  const getScrollStep = useCallback((): number => {
    const track = trackRef.current;
    if (!track) {
      return 325;
    }
    const firstCard = track.querySelector(
      ".nintara-tc__card"
    ) as HTMLElement | null;
    if (!firstCard) {
      return 325;
    }
    return firstCard.offsetWidth + 20; // card width + gap
  }, []);

  /**
   * Update arrow disabled state and active dot
   */
  const syncState = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const step = getScrollStep();
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, reviews.length - visibleCount);
    const dotCount = maxIndex + 1;
    const currentIndex = Math.min(Math.round(scrollLeft / step), maxIndex);

    setAtStart(scrollLeft <= 2);
    setAtEnd(scrollLeft >= maxScroll - 2);
    setActiveDot(currentIndex);
    setTotalDots(dotCount);
  }, [getScrollStep, getVisibleCount, reviews.length]);

  /**
   * Scroll to a specific index
   */
  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) {
        return;
      }
      const step = getScrollStep();
      track.scrollTo({ left: index * step, behavior: "smooth" });
    },
    [getScrollStep]
  );

  /**
   * Handle next arrow click
   */
  const handleNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const step = getScrollStep();
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, reviews.length - visibleCount);
    const currentIndex = Math.round(track.scrollLeft / step);
    const nextIndex = Math.min(currentIndex + 1, maxIndex);
    scrollToIndex(nextIndex);
  }, [getScrollStep, getVisibleCount, reviews.length, scrollToIndex]);

  /**
   * Handle prev arrow click
   */
  const handlePrev = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const step = getScrollStep();
    const currentIndex = Math.round(track.scrollLeft / step);
    const prevIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(prevIndex);
  }, [getScrollStep, scrollToIndex]);

  /**
   * Handle dot click
   */
  const handleDotClick = useCallback(
    (index: number) => {
      scrollToIndex(index);
    },
    [scrollToIndex]
  );

  /**
   * Attach scroll listener and resize handler
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const onScroll = () => syncState();
    const onResize = () => {
      syncState();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Initial sync
    syncState();

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [syncState]);

  /**
   * Render star icons for a review
   */
  const renderStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Image
        key={i}
        src={IMAGE_PATHS.starIcon}
        alt="Star review"
        width={17}
        height={17}
        className="nintara-tc__star-img"
        loading="lazy"
      />
    ));
  };

  /**
   * Arrow SVG (chevron left)
   */
  const ArrowSvg = ({ direction }: { direction: "prev" | "next" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="nintara-tc__arrow-svg"
    >
      {direction === "prev" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 6 15 12 9 18" />
      )}
    </svg>
  );

  return (
    <section className={"nintara-tc" + (className ? " " + className : "")}>
      <div className="nintara-tc__container">
        {/* Headings */}
        <div className="nintara-tc__title-block">
          <h3 className="nintara-tc__heading">{heading}</h3>
          <h5 className="nintara-tc__subheading">{subheading}</h5>
        </div>

        {/* Carousel wrapper (relative for arrow positioning) */}
        <div className="nintara-tc__carousel">
          {/* Previous arrow */}
          <button
            className={
              "nintara-tc__arrow nintara-tc__arrow--prev" +
              (atStart ? " nintara-tc__arrow--disabled" : "")
            }
            onClick={handlePrev}
            aria-label="Previous"
            disabled={atStart}
          >
            <ArrowSvg direction="prev" />
          </button>

          {/* Scrollable track */}
          <div className="nintara-tc__track" ref={trackRef}>
            <div className="nintara-tc__grid">
              {reviews.map((review) => (
                <div key={review.id} className="nintara-tc__card">
                  {/* Stars */}
                  <div className="nintara-tc__stars">
                    {renderStars(review.stars)}
                  </div>

                  {/* Review text */}
                  <div className="nintara-tc__review-text">
                    <p>{review.text}</p>
                  </div>

                  {/* Author name */}
                  <p className="nintara-tc__author">{review.author}</p>

                  {/* Bottom decoration */}
                  <Image
                    src={IMAGE_PATHS.cardBottomDecoration}
                    alt="Nintara Baby"
                    width={301}
                    height={36}
                    className="nintara-tc__decoration"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next arrow */}
          <button
            className={
              "nintara-tc__arrow nintara-tc__arrow--next" +
              (atEnd ? " nintara-tc__arrow--disabled" : "")
            }
            onClick={handleNext}
            aria-label="Next"
            disabled={atEnd}
          >
            <ArrowSvg direction="next" />
          </button>
        </div>

        {/* Dots (mobile only) */}
        <div className="nintara-tc__dots">
          {Array.from({ length: totalDots }, (_, i) => (
            <button
              key={i}
              className={
                "nintara-tc__dot" +
                (i === activeDot ? " nintara-tc__dot--active" : "")
              }
              onClick={() => handleDotClick(i)}
              aria-label={"Go to slide " + (i + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
