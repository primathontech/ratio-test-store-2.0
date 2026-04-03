"use client";

import React, { memo, useRef, useEffect } from "react";
import Image from "next/image";
import { TestimonialsProps, TestimonialItem } from "../types";

/* ------------------------------------------------------------------ */
/*  Star SVG icon (gold fill via currentColor)                         */
/* ------------------------------------------------------------------ */

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="13"
    viewBox="0 0 14 13"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6.84211 10.4479L11.0705 13L9.94842 8.19L13.6842 4.95368L8.76474 4.53632L6.84211 0L4.91947 4.53632L0 4.95368L3.73579 8.19L2.61368 13L6.84211 10.4479Z"
      fill="currentColor"
    />
  </svg>
);

const StarRating = ({ count }: { count: number }) => (
  <div
    className="flex items-center gap-[2px]"
    style={{ color: "rgb(255, 192, 2)" }}
    role="img"
    aria-label={`${count} star rating`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <StarIcon key={i} />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Decorative quote mark                                              */
/* ------------------------------------------------------------------ */

const QuoteMark = () => (
  <span
    className="absolute bottom-[12px] right-[16px] text-[80px] leading-[1] pointer-events-none select-none"
    style={{
      color: "rgba(255, 255, 255, 0.08)",
      fontFamily: "Georgia, serif",
    }}
    aria-hidden="true"
  >
    &ldquo;
  </span>
);

/* ------------------------------------------------------------------ */
/*  Single testimonial card                                            */
/* ------------------------------------------------------------------ */

const TestimonialCard = memo(function TestimonialCard({
  item,
  cardBackground,
}: {
  item: TestimonialItem;
  cardBackground: string;
}) {
  return (
    <div className="flex flex-col text-left">
      {/* Dark card body */}
      <div
        className="relative flex flex-col px-[24px] pt-[24px] pb-[24px]"
        style={{
          backgroundColor: cardBackground,
          borderRadius: "3px 3px 3px 0px",
        }}
      >
        {/* Star rating */}
        <div className="pt-[44px] pb-[0px]">
          <StarRating count={item.stars} />
        </div>

        {/* Heading */}
        <span className="block mt-[12px] text-[18px] leading-[28.8px] font-[600] text-[#ffffff] font-[Gotham,sans-serif]">
          {item.heading}
        </span>

        {/* Review text */}
        <div className="mt-[8px] mb-[26px] text-[14px] leading-[22.4px] font-[400] text-[#ffffff] font-[Gotham,sans-serif]">
          <p className="m-0">{item.reviewText}</p>
        </div>

        {/* Decorative quote */}
        <QuoteMark />
      </div>

      {/* Author row — sits below card */}
      <div className="flex items-center pt-[8px] ml-[18px]">
        <div className="w-[60px] h-[60px] shrink-0 overflow-hidden rounded-[5px] -mt-[30px]">
          <Image
            src={item.avatarSrc}
            alt={item.authorName}
            width={100}
            height={100}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="ml-[12px] text-[14px] leading-[22.4px] font-[600] text-[#1d1d1d] font-[Gotham,sans-serif] m-0">
          {item.authorName}
        </p>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Main V1 component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings }: TestimonialsProps) {
  const headingRegular = settings?.headingRegular ?? "What our";
  const headingBold = settings?.headingBold ?? "customers are saying?";
  const cardBackground = settings?.cardBackground ?? "rgb(29, 29, 29)";
  const testimonials = settings?.testimonials ?? [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

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
      className="w-full pb-[56px] pt-0"
      aria-label="Customer testimonials"
    >
      <div className="mx-auto max-w-[1400px] px-[16px] md:px-[50px]">
        {/* Section heading */}
        <div className="mb-[30px] text-center testimonials-animate-on-scroll">
          <h2 className="text-[24px] md:text-[28px] leading-[30px] md:leading-[34px] font-[400] text-[#1d1d1d] font-[Gotham,sans-serif] m-0">
            {headingRegular}{" "}
            <strong className="font-[700]">{headingBold}</strong>
          </h2>
        </div>

        {/* Carousel — CSS scroll-snap */}
        <div
          ref={scrollRef}
          className="testimonials-carousel flex overflow-x-auto gap-[16px] md:gap-[22px] pb-[8px] scroll-smooth hide-scrollbar testimonials-animate-on-scroll"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="testimonials-slide shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <TestimonialCard item={item} cardBackground={cardBackground} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
