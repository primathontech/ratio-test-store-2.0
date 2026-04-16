"use client";

import React from "react";
import Image from "next/image";
import { HeroBannerSlide } from "../types";

/* ── Inline arrow icon ── */
const ArrowRightIcon = () => (
  <svg
    width="8"
    height="12"
    viewBox="0 0 8 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1.5 11L6.5 6L1.5 1"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface IndicatorsProps {
  slides: HeroBannerSlide[];
  currentIndex: number;
  onIndicatorClick: (index: number) => void;
  autoPlayInterval?: number;
  autoPlay?: boolean;
}

export const Indicators: React.FC<IndicatorsProps> = ({
  slides,
  currentIndex,
  onIndicatorClick,
  autoPlayInterval = 5000,
  autoPlay = true,
}) => {
  if (!slides || slides.length <= 1) {
    return null;
  }

  return (
    <div className="absolute -bottom-[25px] left-1/2 -translate-x-1/2 md:left-auto md:right-[56px] md:bottom-[2.4rem] md:translate-x-0 flex items-center gap-[10px] z-[15]">
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        const thumbnailSrc = slide.mobileImage || slide.mobilePoster || "";

        return (
          <button
            key={index}
            onClick={() => !isActive && onIndicatorClick(index)}
            className="relative overflow-hidden flex items-center text-white h-[40px] lg:h-[50px]"
            style={{
              minWidth: isActive ? "168px" : "20.8px",
              width: isActive ? "auto" : "20.8px",
              transition: "width 1.2s ease-out, min-width 1.2s ease-out",
              backgroundColor: isActive ? "#000000" : "#000000B2",
              borderRadius: "4px",
              border: "2px solid #fff",
            }}
            aria-label={`Go to slide ${index + 1}: ${slide.indicatorHeading || slide.alt || ""}`}
          >
            {/* Progress Bar */}
            {isActive && (
              <div
                key={`progress-${currentIndex}`}
                className="absolute top-0 left-0 h-full"
                style={{
                  animation: autoPlay
                    ? `indicatorProgress ${autoPlayInterval}ms linear forwards`
                    : undefined,
                  background:
                    "linear-gradient(270.28deg, #3D5A20 0.26%, #000000 99.78%)",
                }}
              />
            )}

            <div className="relative z-10 flex items-center h-full w-full">
              {/* Thumbnail (only visible when active) */}
              {isActive && (
                <div
                  className="relative h-full overflow-hidden shrink-0"
                  style={{
                    width: "47px",
                    borderRadius: "2px",
                  }}
                >
                  {slide.type === "video" ? (
                    /* eslint-disable-next-line no-restricted-syntax */
                    <video
                      src={slide.mobileVideoSrc}
                      className="object-cover w-full h-full"
                      muted
                      autoPlay
                      preload="none"
                    />
                  ) : (
                    <Image
                      src={thumbnailSrc}
                      alt={slide.alt || `Slide ${index + 1}`}
                      fill
                      loading="lazy"
                      className="object-cover"
                    />
                  )}
                </div>
              )}

              {/* Text + Arrow (visible when active) */}
              <div
                className="relative flex items-center justify-between overflow-hidden pl-[8px] z-[20] flex-1"
                style={{
                  maxWidth: isActive ? "300px" : "0px",
                  opacity: isActive ? 1 : 0,
                  transition: "max-width 1.2s ease-out, opacity 1s ease-in-out",
                }}
              >
                <div className="text-left flex flex-col justify-center pr-[8px] min-w-0 text-[8px] lg:text-[10px]">
                  <div
                    style={{
                      fontWeight: 400,
                      color: "#fff",
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {slide.indicatorSubHeading}
                  </div>
                  <div
                    className="text-[10px] lg:text-[15px]"
                    style={{
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.1,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {slide.indicatorHeading}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center pr-[8px]">
                  <ArrowRightIcon />
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
