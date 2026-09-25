"use client";

import React, { memo, useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { TestimonialsProps } from "../types";
import { DEFAULT_TESTIMONIALS, type TestimonialItem } from "../types";
import "../style.css";

/**
 * Testimonials V1 Component
 *
 * CSS grid scroll-snap carousel of customer testimonials
 * cloned from nintarababy.in.
 *
 * Features:
 * - CSS grid with grid-auto-flow: column + scroll-snap
 * - Prev/Next arrow buttons (hidden on mobile)
 * - Disabled state at start/end (opacity 0.4)
 * - No hover effects on arrows (intentionally locked)
 * - Touch/swipe on mobile via native scroll
 * - Responsive: 4 cards desktop, 2 tablet, 1 mobile
 */
export const V1 = memo(function V1({
  data,
  settings,
  className,
}: TestimonialsProps) {
  const heading = settings?.heading ?? data?.heading ?? "Testimonials";
  const subtitle =
    settings?.subtitle ?? data?.subtitle ?? "Hear it from our Nintara parents";

  const testimonials: TestimonialItem[] = React.useMemo(() => {
    const st = settings?.testimonials;
    if (Array.isArray(st) && st.length > 0) {
      // Build lookup from defaults for star ratings and alt text
      const defaultByName = new Map(
        DEFAULT_TESTIMONIALS.map((t) => [t.reviewerName, t])
      );
      return st.map((flat, i) => {
        const match = defaultByName.get(flat.reviewerName);
        return {
          id: i + 1,
          reviewText: flat.reviewText,
          reviewerName: flat.reviewerName,
          starRating: match?.starRating ?? 5,
          fullStars: match?.fullStars ?? 5,
          halfStars: match?.halfStars ?? 0,
          cardImage: {
            src: flat.cardImageSrc,
            alt: match?.cardImage?.alt ?? "Testimonial review",
          },
          product: {
            name: flat.productName,
            href: flat.productHref,
            thumbnail: {
              src: flat.productThumbnailSrc,
              alt: flat.productName,
            },
          },
        } as TestimonialItem;
      });
    }
    return data?.testimonials && data.testimonials.length > 0
      ? data.testimonials
      : DEFAULT_TESTIMONIALS;
  }, [settings?.testimonials, data?.testimonials]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalDots, setTotalDots] = useState(1);

  const checkScrollPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const scrollLeft = Math.round(el.scrollLeft);
    const maxScroll = el.scrollWidth - el.clientWidth;
    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft >= maxScroll - 1);

    // Calculate active dot index
    if (maxScroll > 0) {
      const cardWidth = el.scrollWidth / el.children.length;
      const visibleCards = Math.round(el.clientWidth / cardWidth);
      const dots = Math.max(1, el.children.length - visibleCards + 1);
      setTotalDots(dots);
      const idx = Math.round((scrollLeft / maxScroll) * (dots - 1));
      setActiveIndex(idx);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    checkScrollPosition();
    el.addEventListener("scroll", checkScrollPosition, {
      passive: true,
    });
    return () => {
      el.removeEventListener("scroll", checkScrollPosition);
    };
  }, [checkScrollPosition]);

  const scrollPrev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollBy({ left: -305, behavior: "smooth" });
  }, []);

  const scrollNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollBy({ left: 305, behavior: "smooth" });
  }, []);

  const scrollToDot = useCallback(
    (dotIndex: number) => {
      const el = scrollRef.current;
      if (!el) {
        return;
      }
      const maxScroll = el.scrollWidth - el.clientWidth;
      const target =
        totalDots > 1 ? (dotIndex / (totalDots - 1)) * maxScroll : 0;
      el.scrollTo({ left: target, behavior: "smooth" });
    },
    [totalDots]
  );

  return (
    <section
      className={`nintara-tm ${className ?? ""}`}
      aria-label="Testimonials"
    >
      {/* Title block */}
      <div className="nintara-tm__title-block">
        <h3 className="nintara-tm__heading">{heading}</h3>
        <h5 className="nintara-tm__subtitle">{subtitle}</h5>
      </div>

      {/* Carousel container */}
      <div className="nintara-tm__page-width">
        <div className="nintara-tm__carousel">
          {/* Previous arrow */}
          <button
            type="button"
            className={`nintara-tm__nav-btn nintara-tm__nav-btn--prev${atStart ? " nintara-tm__nav-btn--disabled" : ""}`}
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            disabled={atStart}
          >
            {"\u2039"}
          </button>

          {/* Scroll track */}
          <div ref={scrollRef} className="nintara-tm__scroll">
            {testimonials.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>

          {/* Next arrow */}
          <button
            type="button"
            className={`nintara-tm__nav-btn nintara-tm__nav-btn--next${atEnd ? " nintara-tm__nav-btn--disabled" : ""}`}
            onClick={scrollNext}
            aria-label="Next testimonial"
            disabled={atEnd}
          >
            {"\u203A"}
          </button>
        </div>

        {/* Dot indicators */}
        <div
          className="nintara-tm__dots"
          role="tablist"
          aria-label="Testimonial pages"
        >
          {Array.from({ length: totalDots }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`nintara-tm__dot${i === activeIndex ? " nintara-tm__dot--active" : ""}`}
              onClick={() => scrollToDot(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

/**
 * Individual testimonial card
 */
const TestimonialCard = memo(function TestimonialCard({
  item,
}: {
  item: TestimonialItem;
}) {
  return (
    <div className="nintara-tm__card">
      {/* Card top image */}
      <div className="nintara-tm__card-image">
        <Image
          src={item.cardImage.src}
          alt={item.cardImage.alt || "Testimonial"}
          width={600}
          height={240}
          className="nintara-tm__card-img"
        />
      </div>

      {/* Card content */}
      <div className="nintara-tm__card-content">
        <p className="nintara-tm__review-text">{item.reviewText}</p>
        <h3 className="nintara-tm__author-name">{item.reviewerName}</h3>
        <StarRating fullStars={item.fullStars} halfStars={item.halfStars} />
      </div>

      {/* Product strip */}
      <div className="nintara-tm__product-strip">
        <a href={item.product.href} className="nintara-tm__product-link">
          <div className="nintara-tm__product-thumb">
            <Image
              src={item.product.thumbnail.src}
              alt={item.product.thumbnail.alt}
              width={55}
              height={55}
              className="nintara-tm__product-img"
            />
          </div>
          <div className="nintara-tm__product-info">
            <p className="nintara-tm__product-name">{item.product.name}</p>
          </div>
          <div className="nintara-tm__product-arrow">
            <svg
              width="15"
              height="10"
              viewBox="0 0 15 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.08 4.77L0.63 4.77"
                stroke="var(--nintara-tm-arrow-stroke)"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
              <path
                d="M9.76 0.62L13.32 4.18C13.6 4.46 13.74 4.6 13.74 4.77C13.74 4.95 13.6 5.08 13.32 5.36L9.76 8.93"
                stroke="var(--nintara-tm-arrow-stroke)"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
});

/**
 * Star rating display using star PNG images
 */
const StarRating = memo(function StarRating({
  fullStars,
  halfStars,
}: {
  fullStars: number;
  halfStars: number;
}) {
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Image
        key={`full-${i}`}
        src="/assets/nintarababy/testimonials/images/star-full.png"
        alt="Star review"
        width={17}
        height={17}
      />
    );
  }
  for (let i = 0; i < halfStars; i++) {
    stars.push(
      <Image
        key={`half-${i}`}
        src="/assets/nintarababy/testimonials/images/star-half.png"
        alt="Half star review"
        width={17}
        height={17}
      />
    );
  }
  return <div className="nintara-tm__stars">{stars}</div>;
});

export { V1 as default };
