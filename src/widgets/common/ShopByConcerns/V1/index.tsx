"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useCallback, useState, useEffect } from "react";
import { Box } from "@/ui/atomic";
import { ShopByConcernsProps } from "../types";

export function V1({ settings, className }: ShopByConcernsProps) {
  const { heading, items: rawItems, arrowIconSrc } = settings;
  // Ensure items is always an array
  const items = Array.isArray(rawItems) ? rawItems : [];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  // Handle wheel scroll for horizontal scrolling only when needed and default vertical scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheelScroll = (e: WheelEvent) => {
      // Only handle horizontal scrolling if the container can scroll horizontally
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const canScrollHorizontally = scrollWidth > clientWidth;

      // If we can't scroll horizontally, let the page scroll normally
      if (!canScrollHorizontally) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && e.deltaX !== 0) {
        e.preventDefault();
        container.scrollBy({
          left: e.deltaX,
          behavior: "auto",
        });
      }
    };

    container.addEventListener("wheel", handleWheelScroll, { passive: false });
    return () => container.removeEventListener("wheel", handleWheelScroll);
  }, []);

  const checkScrollability = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      // Can scroll left if not at the beginning
      setCanScrollLeft(scrollLeft > 0);

      // Can scroll right if not at the end (with small tolerance for rounding)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  }, []);

  // Check scrollability on mount and when items change
  useEffect(() => {
    checkScrollability();
  }, [items, checkScrollability]);

  // Check scrollability on window resize
  useEffect(() => {
    const handleResize = () => {
      checkScrollability();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkScrollability]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Box
      data-testid="shop-by-concerns-container"
      className={`w-full bg-white pb-[24px] pt-[44px] md:py-[56px] relative z-10 ${className}`}
    >
      <div
        data-testid="shop-by-concerns-inner-container"
        className="max-w-[1440px] mx-auto pl-6 md:px-6 lg:px-8 items-start md:items-center"
      >
        {heading && (
          <h2
            data-testid="shop-by-concerns-heading"
            className="text-start  md:text-center md:mb-0 text-[20px] md:text-[40px] font-normal text-[#1D1D1D]"
            style={{ fontFamily: "Gotham, sans-serif" }}
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        )}

        <div
          data-testid="shop-by-concerns-content-wrapper"
          className="relative mt-4 md:mt-[30px]"
        >
          {/* all cards container - Mobile: 328px, gap 8px | Desktop: 1144px, gap 24px */}
          <div
            data-testid="shop-by-concerns-cards-container"
            className="relative mx-auto md:max-w-[96%] xl:max-w-[1144px]"
          >
            <div
              data-testid="shop-by-concerns-scroll-container"
              ref={scrollContainerRef}
              className="flex gap-[8px] md:gap-6 md:rounded-[4px] overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onScroll={checkScrollability}
            >
              {items.map((item, index) => {
                const target = item.target || "_self";

                return (
                  <Link
                    key={item.id || index}
                    href={item.href}
                    target={target}
                    data-testid={`shop-by-concerns-card-${item.id || index}`}
                    className={`group relative flex-shrink-0 w-[133px] md:w-[217.53px] h-[153px] md:h-[250.24px] overflow-hidden rounded-[4px] md:rounded-[6.54px] hover:opacity-90 transition-all duration-300 ${index === items.length - 1 ? "mr-3" : ""}`}
                    style={{
                      background:
                        "linear-gradient(134deg, rgba(0, 0, 0, 1) 0%, rgba(87, 87, 87, 1) 100%)",
                    }}
                  >
                    {/* Image Container - Mobile: x:37, y:31, w:96, h:122 | Desktop: x:60.52, y:50.7, w:157.02, h:199.54 */}
                    <div
                      data-testid={`shop-by-concerns-card-image-container-${item.id || index}`}
                      className="absolute inset-0 overflow-hidden"
                    >
                      <div
                        data-testid={`shop-by-concerns-card-image-wrapper-${item.id || index}`}
                        className="absolute left-[37px] top-[31px] w-[96px] h-[122px] md:left-[60.52px] md:top-[50.7px] md:w-[157.02px] md:h-[199.54px]"
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.alt || item.title}
                          fill
                          className="object-cover object-left-bottom transition-transform duration-300 "
                          sizes="(max-width: 768px) 133px, 217.53px"
                          priority={index < 2}
                          quality={85}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      </div>
                    </div>

                    {/* Title - Mobile: 16px from left/top, 16px font | Desktop: 24.17px left, 24.61px top, 24px font */}
                    {item.title && (
                      <p
                        data-testid={`shop-by-concerns-card-title-${item.id || index}`}
                        className="absolute text-white font-bold z-10 left-4 top-4 md:left-[24.17px] md:top-[24.61px] text-[16px] md:text-[24px] leading-[1.2em] h-[38px] md:h-[58px] md:max-w-[125px] max-w-[68px] "
                        style={{ fontFamily: "Gotham" }}
                      >
                        {item.title}
                      </p>
                    )}

                    {/* Arrow Button - Mobile: 32px × 32px, 16px from left, 105px from top, blur 10px, radius 2px | Desktop: 52.34px × 52.34px, 26.17px from left/bottom, blur 16.36px */}
                    <div
                      data-testid={`shop-by-concerns-card-arrow-container-${item.id || index}`}
                      className="absolute z-10 left-4 top-[105px]  md:left-[26.17px] md:bottom-[26.17px] md:top-auto w-[32px] h-[32px] md:w-[52.34px] md:h-[52.34px]"
                    >
                      <div
                        data-testid={`shop-by-concerns-card-arrow-button-${item.id || index}`}
                        className="w-full h-full bg-[rgba(82,82,82,0.7)] backdrop-blur-[10px] md:backdrop-blur-[16.36px] rounded-[2px] md:rounded flex items-center justify-center group-hover:bg-[rgba(82,82,82,0.9)] transition-colors duration-300 "
                      >
                        {arrowIconSrc ? (
                          <Image
                            src={arrowIconSrc}
                            alt=""
                            width={18}
                            height={16}
                            className="w-[10px] h-[8.75px] md:w-[16.36px] md:h-[14.31px]"
                            aria-hidden="true"
                            unoptimized
                          />
                        ) : (
                          <svg
                            className="text-white w-[10px] h-[8.75px] md:w-[16.36px] md:h-[14.31px]"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            viewBox="0 0 10 8.75"
                          >
                            <path
                              d="M5 3.5L8.5 7L5 10.5"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="md:stroke-[1.6px]"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {/* Left Arrow Button - Desktop Only - positioned outside left */}
            {canScrollLeft && (
              <button
                data-testid="shop-by-concerns-scroll-left-button"
                onClick={scrollLeft}
                className="hidden md:flex absolute z-20 w-[24px] h-[24px] items-center justify-center transition-all duration-300 -left-12 top-1/2 -translate-y-1/2"
                aria-label="Scroll left"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M15 17L10 12L15 7"
                    stroke="#A3A3A3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {/* Right Arrow Button - Desktop Only - positioned outside right */}
            {canScrollRight && (
              <button
                data-testid="shop-by-concerns-scroll-right-button"
                onClick={scrollRight}
                className="hidden md:flex absolute z-20 w-[24px] h-[24px] items-center justify-center transition-all duration-300 -right-12 top-1/2 -translate-y-1/2"
                aria-label="Scroll right"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M9 17L14 12L9 7"
                    stroke="#A3A3A3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
}
