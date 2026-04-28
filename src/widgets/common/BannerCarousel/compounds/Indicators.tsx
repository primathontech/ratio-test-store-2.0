import Image from "next/image";
import React from "react";

import { IBannerCarouselItem, MediaContentType } from "../types";
import { SimpleIndicators } from "./SimpleIndicators";

export interface IndicatorsProps {
  items: IBannerCarouselItem[];
  currentIndex: number;
  onIndicatorClick: (index: number) => void;
  autoplayInterval?: number;
  autoplay?: boolean;
  indicatorType?: "media" | "simple";
}

export const Indicators: React.FC<IndicatorsProps> = ({
  items,
  currentIndex,
  onIndicatorClick,
  autoplayInterval = 5000,
  autoplay = true,
  indicatorType = "media",
}) => {
  if (!items || items.length <= 1) {
    return null;
  }

  // Render simple indicators if indicatorType is 'simple'
  if (indicatorType === "simple") {
    return (
      <SimpleIndicators
        items={items}
        currentIndex={currentIndex}
        onIndicatorClick={onIndicatorClick}
        autoplayInterval={autoplayInterval}
        autoplay={autoplay}
      />
    );
  }

  // Render media indicators (default behavior)
  return (
    <div
      data-testid="banner-carousel-indicators"
      className="absolute -bottom-11 left-1/2 transform -translate-x-1/2 md:left-auto md:right-56 md:bottom-[2.4rem] md:transform-none flex items-center gap-6 z-[10]"
    >
      {items.map((item, index) => {
        const isActive = index === currentIndex;

        return (
          <button
            key={index}
            data-testid={`banner-carousel-indicator-${index}`}
            onClick={() => onIndicatorClick(index)}
            className={`
              relative overflow-hidden rounded-md flex items-center border-[2.5px] border-white
              ${isActive ? "bg-black text-white" : "bg-black/70 text-white"}
            `}
            style={{
              width: isActive ? "auto" : "24px",
              transition: "width 1.2s ease-out",
            }}
            aria-label={`Go to slide ${index + 1}: ${item.indicatorHeading}`}
          >
            {/* Progress Bar — Pure CSS Animation */}
            {isActive && autoplay && (
              <div
                data-testid={`banner-carousel-indicator-progress-${index}`}
                className="absolute top-0 left-0 h-full"
                style={{
                  animation: `indicatorProgress ${autoplayInterval}ms linear forwards`,
                  background:
                    "linear-gradient(270.28deg, #3D5A20 0.26%, #000000 99.78%)",
                }}
              />
            )}

            <div
              data-testid={`banner-carousel-indicator-content-${index}`}
              className="relative z-10 flex gap-2"
            >
              {/* Thumbnail Image / Video */}
              <div
                data-testid={`banner-carousel-indicator-thumbnail-${index}`}
                className={`relative h-16 md:h-[51px] border-2 md:border-[2.5px] border-black rounded-md overflow-hidden transition-[width] duration-[1200ms] ease-out ${isActive ? "w-16 md:w-[51px]" : "w-[20px]"}`}
              >
                {item.type === MediaContentType.VIDEO ? (
                  // eslint-disable-next-line no-restricted-syntax
                  <video
                    src={item.mobileSrc}
                    className="object-cover w-full h-full rounded-sm"
                    muted
                    autoPlay
                    preload="none"
                  />
                ) : (
                  <Image
                    src={item.mobileSrc}
                    alt={item.alt || `Slide ${index + 1}`}
                    fill
                    loading="lazy"
                    className="object-cover rounded-sm"
                  />
                )}
                {/* Opacity overlay for inactive indicators */}
                {!isActive && (
                  <div
                    data-testid={`banner-carousel-indicator-overlay-${index}`}
                    className="absolute inset-0 bg-black opacity-70"
                  />
                )}
              </div>

              {/* Text (only visible when active) */}
              <div
                data-testid={`banner-carousel-indicator-text-container-${index}`}
                className="flex overflow-hidden"
                style={{
                  maxWidth: isActive ? "300px" : "0px",
                  opacity: isActive ? 1 : 0,
                  transition: "max-width 1.2s ease-out, opacity 1s ease-in-out",
                }}
              >
                <div
                  data-testid={`banner-carousel-indicator-text-${index}`}
                  className="text-left flex flex-col justify-center whitespace-nowrap"
                >
                  <div className="text-[10px] md:text-[10.2px] font-medium line-clamp-1">
                    {item.indicatorSubHeading}
                  </div>
                  <div className="text-sm md:text-[15.3px] font-bold line-clamp-1">
                    {item.indicatorHeading}
                  </div>
                </div>

                {/* Arrow */}
                <div
                  data-testid={`banner-carousel-indicator-arrow-${index}`}
                  className="ml-[8px] w-[2.3rem] flex justify-center items-center rounded-md bg-white/15"
                >
                  <Image
                    src="/icons/hero-carousel-right-arrow.svg"
                    alt="next arrow"
                    width={8}
                    height={5}
                    loading="lazy"
                    className="object-fill w-[8px] h-[5px]"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
