"use client";

import React, { memo, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { TestimonialsProps, TestimonialItem } from "../types";
import { SwipeCarousel } from "@/ui/components/SwipeCarousel";

/* ------------------------------------------------------------------ */
/*  Default carousel breakpoints                                       */
/* ------------------------------------------------------------------ */
// Mirrors the previous CSS-only layout exactly:
//   mobile (<768)        : ~1.33 cards visible (75% width — w-3/4 peek), 15px gap
//   tablet (768–1149)    : 2 cards, 22px gap   (was w-[calc((100% - 22px)/2)])
//   desktop (≥1150)      : 3 cards, 22px gap   (was w-[calc((100% - 44px)/3)])
const DEFAULT_TESTIMONIALS_BREAKPOINTS = [
  { minWidth: 0, cards: 1.4, gap: 15 },
  { minWidth: 768, cards: 2, gap: 22 },
  { minWidth: 1150, cards: 3, gap: 22 },
];

/* ------------------------------------------------------------------ */
/*  Star SVG icon                                                      */
/* ------------------------------------------------------------------ */

const StarIcon = ({
  filled,
  color,
  emptyColor,
}: {
  filled: boolean;
  color: string;
  emptyColor: string;
}) => (
  <svg
    width="16.84"
    height="16"
    style={{ color: filled ? color : emptyColor }}
    fill="currentColor"
    viewBox="0 0 14.185 13.32"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M7.09251 0L9.06504 4.68253L14.185 5.08779L10.2841 8.38701L11.4759 13.32L7.09251 10.6765L2.7091 13.32L3.90088 8.38701L0 5.08779L5.11997 4.68253L7.09251 0Z" />
  </svg>
);

const StarRating = ({
  count,
  starColor,
  starEmptyColor,
  paddingTopClass,
}: {
  count: number;
  starColor: string;
  starEmptyColor: string;
  paddingTopClass: string;
}) => (
  <div
    className={`flex gap-2.5 min-h-[55px] ${paddingTopClass}`.trim()}
    role="img"
    aria-label={`${count} out of 5 stars`}
  >
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        filled={i < count}
        color={starColor}
        emptyColor={starEmptyColor}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Decorative quote mark                                              */
/* ------------------------------------------------------------------ */

const QuoteMark = () => (
  <Image
    src="/images/testimonials/quotes-icon.svg"
    alt=""
    width={65}
    height={46}
    aria-hidden="true"
    className="hidden md:block"
  />
);

const QuoteMarkMobile = () => (
  <svg
    width="36"
    height="40"
    viewBox="0 0 36 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="md:hidden"
    style={{ color: "rgba(255, 255, 255, 0.08)" }}
  >
    <path
      d="M0 40V25.85C0 18.8775 1.2 12.9275 3.6 8C6 3.07 10 0.2175 15.6 0V7.3875C12.42 8 10.1 9.65 8.76 12.3C7.42 14.75 6.64 17.7225 6.56 21.2125H14.4V40H0ZM21.6 40V25.85C21.6 18.8775 22.8 12.9275 25.2 8C27.6 3.07 31.6 0.2175 37.2 0V7.3875C34.02 8 31.7 9.65 30.36 12.3C29.02 14.75 28.24 17.7225 28.16 21.2125H36V40H21.6Z"
      fill="currentColor"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Single testimonial card                                            */
/* ------------------------------------------------------------------ */

const TestimonialCard = memo(function TestimonialCard({
  item,
  cardBackground,
  starColor,
  starEmptyColor,
}: {
  item: TestimonialItem;
  cardBackground: string;
  starColor: string;
  starEmptyColor: string;
}) {
  return (
    <div className="relative w-full h-full">
      {/* Main card wrapper for speech bubble effect */}
      <div className="relative">
        {/* Dark card body */}
        <div
          className="relative w-full px-4 md:px-6 pt-4 md:pt-6 rounded rounded-bl-none min-h-[217px]"
          style={{ backgroundColor: cardBackground }}
        >
          {/* Title */}
          <h4 className="font-semibold text-[14px] min-[375px]:text-[16px] md:text-[18px] lg:text-[16px] leading-[22.4px] min-[375px]:leading-[25.6px] md:leading-[28.8px] lg:leading-[25.6px] mb-2 text-secondary m-0">
            {item.heading}
          </h4>

          {/* Description */}
          <p className="text-[12px] md:text-[14px] !leading-[19.2px] md:!leading-[22.4px] font-normal mb-5 md:mb-[26px] text-secondary m-0">
            {item.reviewText}
          </p>

          {/* Star rating (bottom-left) */}
          <div className="w-fit pt-px">
            <StarRating
              count={item.stars}
              starColor={starColor}
              starEmptyColor={starEmptyColor}
              paddingTopClass="pt-[4px]"
            />
          </div>

          {/* Decorative quote mark (bottom-right) */}
          <div className="absolute -z-0 bottom-4 right-4 md:bottom-6 md:right-6">
            <QuoteMarkMobile />
            <QuoteMark />
          </div>
        </div>

        {/* Speech bubble tail */}
        <div
          className="absolute -bottom-7 md:-bottom-[35px] left-0 size-9 md:size-[47px] rounded"
          style={{
            backgroundColor: cardBackground,
            clipPath: "polygon(0 0, 100% 0, 0 94%)",
          }}
        />
      </div>

      {/* Author row */}
      <div className="flex items-center gap-4 ml-[18px] pt-2">
        <div className="relative w-[60px] h-[60px] rounded-[50%] overflow-hidden flex-shrink-0">
          <Image
            src={item.avatarSrc}
            alt={item.authorName}
            fill
            className="object-cover"
            sizes="60px"
            loading="lazy"
          />
        </div>
        <h3 className="font-semibold text-[14px] leading-[22.4px] text-primary m-0">
          {item.authorName}
        </h3>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Main V1 component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings }: TestimonialsProps) {
  const heading =
    settings?.heading ?? "What our <strong>customers are saying?</strong>";
  const cardBackground = settings?.cardBackground ?? "#1D1D1D";
  const starColor = settings?.starColor ?? "#FFC300";
  const starEmptyColor = "#4A4A4A";
  const testimonials = settings?.testimonials ?? [];
  const carouselBreakpoints =
    settings?.carouselBreakpoints && settings.carouselBreakpoints.length > 0
      ? settings.carouselBreakpoints
      : DEFAULT_TESTIMONIALS_BREAKPOINTS;

  const sectionRef = useRef<HTMLElement>(null);

  /* SwipeCarousel renderItem — pulls the matching testimonial by index. */
  const renderItem = useCallback(
    (idx: number) => {
      const item = testimonials[idx];
      if (!item) {
        return null;
      }
      return (
        <TestimonialCard
          item={item}
          cardBackground={cardBackground}
          starColor={starColor}
          starEmptyColor={starEmptyColor}
        />
      );
    },
    [testimonials, cardBackground, starColor, starEmptyColor]
  );

  /* Scroll reveal animation */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      section
        .querySelectorAll(".testimonials-animate-on-scroll")
        .forEach((el) => el.classList.add("testimonials-animate-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("testimonials-animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    section
      .querySelectorAll(".testimonials-animate-on-scroll")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full pb-[24.6px] md:pb-[46.7px] xl:pb-14 pt-[25px] md:pt-14"
      aria-label="Customer testimonials"
    >
      <div className="mx-auto max-w-[1400px] pl-[15px] md:pl-[30px] pr-0 md:pr-[30px] xl:px-[50px]">
        {/* Section heading */}
        <div className="mt-[25px] md:mt-14 mb-4 md:mb-[30px] text-left md:text-center testimonials-animate-on-scroll">
          <h2
            className="text-[20px] min-[375px]:text-[22px] md:text-[24px] lg:text-[28px] leading-[24px] min-[375px]:leading-[26.4px] md:leading-[28.8px] lg:leading-[33.6px] font-normal text-black m-0 text-left md:text-center [&_strong]:block md:[&_strong]:inline [&_strong]:font-bold"
            // eslint-disable-next-line no-restricted-syntax
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        </div>

        {/* Carousel — SwipeCarousel handles breakpoint resolution +
            touch / mouse-drag swipe. No arrows, matching the original
            scroll-snap UI. */}
        <div className="testimonials-animate-on-scroll">
          <SwipeCarousel
            itemCount={testimonials.length}
            breakpoints={carouselBreakpoints}
            renderItem={renderItem}
          />
        </div>
      </div>
    </section>
  );
});
