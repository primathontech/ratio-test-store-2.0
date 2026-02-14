"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Props } from "../types";
import { CategoryCard } from "./CategoryCard";
import { MobileCategoryCard } from "./MobileCategoryCard";

export const V1 = ({ settings }: Props) => {
  const {
    title = "Shop by Categories",
    categories,
    showNames = true,
    className = "",
  } = settings;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Ensure categories is always an array
  const finalCategories = Array.isArray(categories) ? categories : [];

  // Early return if no categories
  if (!finalCategories || finalCategories.length === 0) {
    return null;
  }

  return (
    <section
      data-testid="shop-by-category-container"
      className={`shop-by-category ${className}`}
    >
      {/* Header Section */}
      {title && (
        <div
          data-testid="shop-by-category-header"
          className="px-6 md:px-0 md:text-center mb-[16px] md:mb-[33px]"
        >
          <h2
            data-testid="shop-by-category-title"
            className="text-[2rem] md:text-[4rem] font-normal text-primary"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
      )}

      {/* Carousel Container */}
      <div data-testid="shop-by-category-carousel-wrapper" className="w-full">
        <div
          data-testid="shop-by-category-desktop-container"
          className="relative hidden md:max-w-[90%] xl:max-w-[1140px] mx-auto md:block"
        >
          {/* Left Arrow - Absolute positioned */}
          <button
            data-testid="shop-by-category-scroll-left-button"
            onClick={scrollPrev}
            className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            aria-label="Scroll left"
          >
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 9L1 5L5 1"
                stroke="#666"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Desktop Embla Carousel Container */}
          <div
            data-testid="shop-by-category-embla-container"
            className="embla overflow-hidden h-[118px] pt-[20px]"
            ref={emblaRef}
          >
            <div
              data-testid="shop-by-category-embla-slides-container"
              className="embla__container flex gap-4 md:gap-[13px]"
            >
              {finalCategories.map((category, index) => (
                <div
                  key={category.id}
                  data-testid={`shop-by-category-desktop-slide-${category.id}`}
                  className="embla__slide flex-[0_0_auto]"
                >
                  <CategoryCard
                    category={category}
                    showNames={showNames}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow - Absolute positioned */}
          <button
            data-testid="shop-by-category-scroll-right-button"
            onClick={scrollNext}
            className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            aria-label="Scroll right"
          >
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L5 5L1 9"
                stroke="#666"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Hexagon Grid */}
        <div
          data-testid="shop-by-category-mobile-container"
          className="md:hidden"
        >
          <div
            data-testid="shop-by-category-mobile-scroll-container"
            className="flex gap-[14px] hide-scrollbar overflow-x-auto"
          >
            {finalCategories.map((category, index) => (
              <div
                key={category.id}
                data-testid={`shop-by-category-mobile-slide-${category.id}`}
                className="flex-shrink-0 first:ml-[21px] md:first:ml-0 last:mr-[21px] md:last::mr-0"
              >
                <MobileCategoryCard
                  category={category}
                  showNames={showNames}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
