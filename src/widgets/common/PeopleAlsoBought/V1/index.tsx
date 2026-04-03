"use client";

import React, { memo, useState, useCallback, useEffect } from "react";
import { PeopleAlsoBoughtProps } from "../types";
import { ProductCard } from "@/ui/components/ProductCard";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

const ChevronLeftIcon = () => (
  <svg
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.5 11L0 5.5L5.5 0L6.47625 0.97625L1.9525 5.5L6.47625 10.0238L5.5 11Z"
      fill="currentColor"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5 11L7 5.5L1.5 0L0.52375 0.97625L5.0475 5.5L0.52375 10.0238L1.5 11Z"
      fill="currentColor"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings }: PeopleAlsoBoughtProps) {
  const heading = settings?.heading || "People Also Bought";
  const products = settings?.products || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(5);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1440) {
        setVisibleCards(5);
      } else if (w >= 1024) {
        setVisibleCards(3);
      } else if (w >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleCards);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= maxIndex;

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="pab-section w-full py-[32px]"
      style={{ backgroundColor: "#ffffff" }}
      aria-label={heading}
    >
      {/* Heading */}
      <div className="px-[16px] lg:px-[72px]">
        <h3
          className="text-[20px] lg:text-[24px] mb-[24px]"
          style={{
            color: "#1d1d1d",
            fontFamily: "Gotham, sans-serif",
            fontWeight: 700,
          }}
        >
          {heading}
        </h3>
      </div>

      {/* Slider viewport */}
      <div className="pab-slider-viewport overflow-hidden">
        <div
          className="flex items-stretch"
          style={{
            gap: "var(--pab-gap)",
            paddingLeft: "var(--pab-pad)",
            paddingRight: "var(--pab-pad)",
            transform: `translate3d(calc(-${currentIndex} * (calc((100% - var(--pab-pad) * 2 - (var(--pab-cards) - 1) * var(--pab-gap)) / var(--pab-cards)) + var(--pab-gap))), 0px, 0px)`,
            transition: "transform 0.5s ease",
          }}
        >
          {products.map((product, idx) => (
            <div key={idx} className="pab-slide flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center gap-[8px] px-[16px] lg:px-[72px] mt-[16px]">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isPrevDisabled}
          className="flex items-center justify-center w-[40px] h-[40px] border cursor-pointer"
          style={{
            borderRadius: "50%",
            borderColor: "rgba(29,29,29,0.12)",
            backgroundColor: "#ffffff",
            opacity: isPrevDisabled ? 0.4 : 1,
            transition: "0.4s",
          }}
          aria-label="Previous products"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isNextDisabled}
          className="flex items-center justify-center w-[40px] h-[40px] border cursor-pointer"
          style={{
            borderRadius: "50%",
            borderColor: "rgba(29,29,29,0.12)",
            backgroundColor: "#ffffff",
            opacity: isNextDisabled ? 0.4 : 1,
            transition: "0.4s",
          }}
          aria-label="Next products"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
});
