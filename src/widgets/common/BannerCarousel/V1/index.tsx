"use client";

import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { ImageSlide } from "../compounds/ImageSlide";
import { Indicators } from "../compounds/Indicators";
import { VideoSlide } from "../compounds/VideoSlide";
import { MediaContentType, Props } from "../types";

export const V1: React.FC<Props> = ({ settings }) => {
  const {
    bannerCarousel = [],
    autoplayInterval = 5000,
    autoplay = true,
    loop = true,
    pauseOnHover = true,
    draggable = true,
    showIndicators = true,
    indicatorType = "media",
    mobileAspectRatio = "1/1",
    desktopAspectRatio = "182/57",
    className = "",
    style = {},
  } = settings ?? {};

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicate slides if there are only 2 items to enable proper looping
  const slides =
    bannerCarousel.length === 2 && loop
      ? [...bannerCarousel, ...bannerCarousel]
      : bannerCarousel;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    dragFree: false,
    containScroll: false,
    slidesToScroll: 1,
    align: "center",
    watchDrag: draggable && bannerCarousel.length > 1,
  });

  const onSelect = useCallback(
    (emblaApi: EmblaCarouselType) => {
      const selected = emblaApi.selectedScrollSnap();
      // Map back to original index if we duplicated slides
      const actualIndex =
        bannerCarousel.length === 2 && loop ? selected % 2 : selected;
      setSelectedIndex(actualIndex);
    },
    [bannerCarousel.length, loop]
  );

  const startAutoplay = useCallback(() => {
    if (!autoplay || !emblaApi) {
      return;
    }

    autoplayRef.current = setInterval(() => {
      if (!isHovered || !pauseOnHover) {
        emblaApi.scrollNext();
      }
    }, autoplayInterval);
  }, [autoplay, emblaApi, isHovered, pauseOnHover, autoplayInterval]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (autoplay && !isHovered) {
      startAutoplay();
    } else {
      stopAutoplay();
    }

    return stopAutoplay;
  }, [autoplay, isHovered, startAutoplay, stopAutoplay]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovered(false);
    }
  };

  // Handle indicator click with proper index mapping
  const handleIndicatorClick = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  if (!bannerCarousel || bannerCarousel.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="banner-carousel-container"
      className={`relative w-full ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        data-testid="banner-carousel-embla"
        className="embla overflow-hidden"
        ref={emblaRef}
      >
        <div
          data-testid="banner-carousel-embla-container"
          className={`embla__container flex ${bannerCarousel?.length === 1 ? "justify-center" : ""}`}
        >
          {slides.map((item, index) => {
            // Create unique key that accounts for duplicated slides
            const uniqueKey = `${item.id || index}-${index}`;

            // Map back to original index if we duplicated slides for active state
            const actualIndex =
              bannerCarousel.length === 2 && loop ? index % 2 : index;
            const isActive = actualIndex === selectedIndex;

            // Use original index for priority loading (first slide gets priority)
            const originalIndex =
              bannerCarousel.length === 2 && loop ? index % 2 : index;

            // Apply rounded corners unless it's a single image with no video
            const applyRounded =
              bannerCarousel.length > 1 ||
              bannerCarousel.some(
                (slide) => slide.type === MediaContentType.VIDEO
              );

            const slideProps = {
              item,
              index: originalIndex, // Pass original index for priority calculation
              desktopAspectRatio: desktopAspectRatio,
              mobileAspectRatio: mobileAspectRatio,
              isActive,
              indicatorType,
              applyRounded,
            };

            // Different slide widths for simple indicator type on mobile
            const mobileSlideClass =
              indicatorType === "simple"
                ? `${bannerCarousel?.length > 1 ? "flex-[0_0_81.7%] mx-2" : "flex-[0_0_100%]"}` // Show multiple slides on mobile with spacing
                : "flex-[0_0_100%]"; // Full width for media indicators

            const desktopSlideClass =
              bannerCarousel?.length > 1
                ? "md:flex-[0_0_100%] md:mx-0 min-[1150px]:flex-[0_0_88%] min-[1150px]:mx-2.5"
                : "md:flex-[0_0_100%] md:mx-0";

            const slideClassName = `embla__slide ${mobileSlideClass} ${desktopSlideClass} min-w-0`;

            if (item.type === MediaContentType.VIDEO) {
              return (
                <div
                  key={uniqueKey}
                  data-testid={`banner-carousel-slide-${index}`}
                  className={slideClassName}
                >
                  <VideoSlide {...slideProps} />
                </div>
              );
            }
            return (
              <div
                key={uniqueKey}
                data-testid={`banner-carousel-slide-${index}`}
                className={slideClassName}
              >
                <ImageSlide {...slideProps} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Navigation Arrows */}
      {bannerCarousel?.length > 1 && (
        <button
          data-testid="banner-carousel-prev-button"
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-10 top-1/2 transform -translate-y-1/2 z-10 hidden md:flex items-center justify-center size-[4.8rem] bg-black/50 hover:bg-black/70 rounded-[50%] transition-all duration-200"
          aria-label="Previous slide"
        >
          <Image
            src="/icons/hero-carousel-left-arrow.svg"
            alt="prev arrow"
            width={10}
            height={7}
            priority
            className="object-fill w-4 h-3"
            unoptimized
          />
        </button>
      )}

      {bannerCarousel?.length > 1 && (
        <button
          data-testid="banner-carousel-next-button"
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 z-10 hidden md:flex items-center justify-center size-[4.8rem] bg-black/50 hover:bg-black/70 rounded-[50%] transition-all duration-200"
          aria-label="Next slide"
        >
          <Image
            src="/icons/hero-carousel-right-arrow.svg"
            alt="next arrow"
            width={10}
            height={7}
            priority
            className="object-fill w-4 h-3"
            unoptimized
          />
        </button>
      )}

      {showIndicators && (
        <Indicators
          items={bannerCarousel}
          currentIndex={selectedIndex}
          onIndicatorClick={handleIndicatorClick}
          autoplayInterval={autoplayInterval}
          autoplay={autoplay}
          indicatorType={indicatorType}
        />
      )}
    </div>
  );
};
