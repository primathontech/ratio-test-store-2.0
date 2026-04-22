"use client";

import React, { memo, useRef, useEffect } from "react";
import Image from "next/image";
import { TestimonialsProps, TestimonialItem } from "../types";

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
}: {
  count: number;
  starColor: string;
  starEmptyColor: string;
}) => (
  <div
    className="flex gap-[7px] min-h-[55px]"
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
  <svg
    width="65"
    height="52"
    viewBox="0 0 65 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="hidden md:block"
    style={{ color: "rgba(255, 255, 255, 0.08)" }}
  >
    <path
      d="M0 52V33.6C0 24.5333 1.73333 16.8 5.2 10.4C8.66667 3.73333 14.2667 0 22 0V9.6C17.6 10.4 14.4 12.5333 12.4 16C10.4 19.2 9.33333 23.0667 9.2 27.6H20V52H0ZM36 52V33.6C36 24.5333 37.7333 16.8 41.2 10.4C44.6667 3.73333 50.2667 0 58 0V9.6C53.6 10.4 50.4 12.5333 48.4 16C46.4 19.2 45.3333 23.0667 45.2 27.6H56V52H36Z"
      fill="currentColor"
    />
  </svg>
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
          className="relative w-full pl-[1.6rem] md:pl-[2.4rem] pt-[1.6rem] md:pt-[2.4rem] pr-[1.6rem] md:pr-[2.4rem] rounded-[4px] rounded-bl-none min-h-[217px]"
          style={{ backgroundColor: cardBackground }}
        >
          {/* Title */}
          <h4 className="font-[700] text-[18px] mb-[8px] text-[#ffffff] font-[Gotham,sans-serif] m-0">
            {item.heading}
          </h4>

          {/* Description */}
          <p className="text-[14px] md:text-[14px] leading-[21.5px] font-[400] mb-[2.6rem] text-[#ffffff] font-[Gotham,sans-serif] m-0">
            {item.reviewText}
          </p>

          {/* Star rating (bottom-left) */}
          <div className="w-fit">
            <StarRating
              count={item.stars}
              starColor={starColor}
              starEmptyColor={starEmptyColor}
            />
          </div>

          {/* Decorative quote mark (bottom-right) */}
          <div className="absolute -z-0 bottom-[16px] right-[16px] md:bottom-[24px] md:right-[24px]">
            <QuoteMarkMobile />
            <QuoteMark />
          </div>
        </div>

        {/* Speech bubble tail */}
        <div
          className="absolute -bottom-[28px] md:-bottom-[35px] left-0 size-[36px] md:size-[47px] rounded"
          style={{
            backgroundColor: cardBackground,
            clipPath: "polygon(0 0, 100% 0, 0 94%)",
          }}
        />
      </div>

      {/* Author row */}
      <div className="flex items-center gap-[1.6rem] ml-[18px] pt-[8px]">
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
        <h3 className="font-[600] text-[14px] text-[#1d1d1d] font-[Gotham,sans-serif] m-0">
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
  const headingRegular = settings?.headingRegular ?? "What our";
  const headingBold = settings?.headingBold ?? "customers are saying?";
  const cardBackground = settings?.cardBackground ?? "#000000";
  const starColor = settings?.starColor ?? "#FFC300";
  const starEmptyColor = "#4A4A4A";
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
      className="w-full pb-[24.6px] md:pb-[56px] pt-0"
      aria-label="Customer testimonials"
    >
      <div className="mx-auto max-w-[1400px] pl-[15px] md:pl-[30px] lg:px-[50px]">
        {/* Section heading */}
        <div className="mt-[25px] md:mt-[56px] mb-[16px] md:mb-[30px] text-left md:text-center testimonials-animate-on-scroll">
          <h2 className="text-[24px] md:text-[28px] leading-[29px] lg:leading-[40px] font-[400] text-[#000000] font-[Gotham,sans-serif] m-0 md:inline-block md:text-left lg:block lg:text-center">
            {headingRegular}{" "}
            <strong className="font-[700] block lg:inline">
              {headingBold}
            </strong>
          </h2>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="testimonials-carousel flex overflow-x-auto gap-[15px] md:gap-[22px] scroll-smooth hide-scrollbar testimonials-animate-on-scroll"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="testimonials-slide shrink-0 w-[75%] md:w-[calc((100%-22px)/2)] lg:w-[calc((100%-44px)/3)]"
              style={{ scrollSnapAlign: "start" }}
            >
              <TestimonialCard
                item={item}
                cardBackground={cardBackground}
                starColor={starColor}
                starEmptyColor={starEmptyColor}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
