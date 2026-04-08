"use client";

import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroBannerCarouselProps, HeroBannerSlide } from "../types";

/* ------------------------------------------------------------------ */
/*  Inline SVG arrow icons (from source site)                          */
/* ------------------------------------------------------------------ */
const PrevArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="currentColor"
    className="w-[7px] h-[11px]"
  >
    <path d="M5.5 11L0 5.5L5.5 0L6.47625 0.97625L1.9525 5.5L6.47625 10.0238L5.5 11Z" />
  </svg>
);

const NextArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="currentColor"
    className="w-[7px] h-[11px]"
  >
    <path d="M1.5 11L7 5.5L1.5 0L0.52375 0.97625L5.0475 5.5L0.52375 10.0238L1.5 11Z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Video wrapper to satisfy CLS lint rule                             */
/* ------------------------------------------------------------------ */
function VideoSlide({
  src,
  poster,
  isActive,
  aspectRatio,
}: {
  src?: string;
  poster?: string;
  isActive: boolean;
  aspectRatio: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    if (isActive) {
      videoRef.current.play().catch(() => {
        /* autoplay blocked */
      });
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div className="relative w-full" style={{ aspectRatio }}>
      {/* eslint-disable-next-line no-restricted-syntax */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        width="100%"
        height="100%"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Default slides data                                                */
/* ------------------------------------------------------------------ */
const DEFAULT_SLIDES: HeroBannerSlide[] = [
  {
    type: "image",
    href: "/pages/shine-squad-bb30-offer",
    desktopImage: "/HeroBannerCarousel/images/slide1-desktop.webp",
    mobileImage: "/HeroBannerCarousel/images/slide1-mobile.png",
    alt: "Get 3 Freebies on orders above Rs499 - Code FREETRIO",
  },
  {
    type: "image",
    href: "/pages/flat3",
    desktopImage: "/HeroBannerCarousel/images/slide2-desktop.jpg",
    mobileImage: "/HeroBannerCarousel/images/slide2-mobile.jpg",
    alt: "Buy 3 for Rs799 - Code FLAT3",
  },
  {
    type: "image",
    href: "/pages/shine-squad-get999",
    desktopImage: "/HeroBannerCarousel/images/slide3-desktop.jpg",
    mobileImage: "/HeroBannerCarousel/images/slide3-mobile.jpg",
    alt: "Up to 95% Frizz Reduction",
  },
  {
    type: "video",
    href: "/collections/dry-hair",
    desktopVideoSrc:
      "https://bblunt.com/cdn/shop/videos/c/vp/9d41619129504abd8c80adeefe936559/9d41619129504abd8c80adeefe936559.SD-480p-1.5Mbps-64951035.mp4?v=0",
    mobileVideoSrc:
      "https://bblunt.com/cdn/shop/videos/c/vp/23170c4a114945e69f8075c035dd7bbe/23170c4a114945e69f8075c035dd7bbe.HD-1080p-7.2Mbps-64441147.mp4?v=0",
    desktopPoster: "/HeroBannerCarousel/images/slide4-poster-desktop.jpg",
    mobilePoster: "/HeroBannerCarousel/images/slide4-poster-mobile.jpg",
    alt: "BBlunt Hair Care",
  },
];

/* ------------------------------------------------------------------ */
/*  V1 Component                                                       */
/* ------------------------------------------------------------------ */
export const V1 = memo(function HeroBannerCarouselV1({
  settings,
  className,
}: HeroBannerCarouselProps) {
  const slides = settings?.slides ?? DEFAULT_SLIDES;
  const autoPlayInterval = settings?.autoPlayInterval ?? 5000;
  const loop = settings?.loop ?? true;
  const desktopWidth = settings?.desktopWidth ?? 1440;
  const desktopHeight = settings?.desktopHeight ?? 529;
  const mobileWidth = settings?.mobileWidth ?? 1200;
  const mobileHeight = settings?.mobileHeight ?? 1200;

  const desktopAspect = `${desktopWidth}/${desktopHeight}`;
  const mobileAspect = `${mobileWidth}/${mobileHeight}`;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideCount = slides.length;

  /* --- Navigation handlers --- */
  const goToSlide = useCallback(
    (index: number) => {
      if (loop) {
        setActiveIndex(((index % slideCount) + slideCount) % slideCount);
      } else {
        setActiveIndex(Math.max(0, Math.min(index, slideCount - 1)));
      }
    },
    [loop, slideCount]
  );

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  /* --- Auto-play --- */
  useEffect(() => {
    if (autoPlayInterval <= 0 || isHovered) {
      return;
    }

    timerRef.current = setTimeout(() => {
      goNext();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activeIndex, autoPlayInterval, isHovered, goNext]);

  /* --- Touch/swipe support --- */
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) {
        return;
      }
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goNext();
        } else {
          goPrev();
        }
      }
      touchStartX.current = null;
    },
    [goNext, goPrev]
  );

  /* --- Render a single slide --- */
  const renderSlide = (slide: HeroBannerSlide, index: number) => {
    const isActive = index === activeIndex;

    const slideContent =
      slide.type === "video" ? (
        <div className="relative w-full">
          {/* Desktop video */}
          <div className="hidden md:block w-full">
            <VideoSlide
              src={slide.desktopVideoSrc}
              poster={slide.desktopPoster}
              isActive={isActive}
              aspectRatio={desktopAspect}
            />
          </div>
          {/* Mobile video */}
          <div className="block md:hidden w-full">
            <VideoSlide
              src={slide.mobileVideoSrc}
              poster={slide.mobilePoster}
              isActive={isActive}
              aspectRatio={mobileAspect}
            />
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          {/* Desktop image */}
          <Image
            src={slide.desktopImage || ""}
            alt={slide.alt || ""}
            width={desktopWidth}
            height={desktopHeight}
            priority={index === 0}
            className="hidden md:block w-full h-auto object-cover"
            sizes="100vw"
          />
          {/* Mobile image */}
          <Image
            src={slide.mobileImage || ""}
            alt={slide.alt || ""}
            width={mobileWidth}
            height={mobileHeight}
            priority={index === 0}
            className="block md:hidden w-full h-auto object-cover"
            sizes="100vw"
          />
        </div>
      );

    return (
      <div
        key={index}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          pointerEvents: isActive ? "auto" : "none",
        }}
        aria-hidden={!isActive}
      >
        {slide.href ? (
          <Link href={slide.href} className="block w-full h-full">
            {slideContent}
          </Link>
        ) : (
          slideContent
        )}
      </div>
    );
  };

  const dotBg = (i: number) =>
    i === activeIndex ? "#000000" : "rgba(0, 0, 0, 0.3)";

  return (
    <section
      className={`relative w-full overflow-hidden ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Hero Banner Carousel"
    >
      {/* Slides viewport — desktop uses image aspect ratio, mobile overrides via class */}
      <div
        className="relative w-full hero-carousel-viewport"
        style={{ aspectRatio: desktopAspect }}
      >
        {slides.map((slide, i) => renderSlide(slide, i))}
      </div>

      {/* Prev/Next arrow buttons */}
      {slideCount > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-[16px] md:left-[40px] top-1/2 -translate-y-1/2 z-[2] w-[46px] h-[46px] rounded-[9999px] inline-flex items-center justify-center bg-[rgba(0,0,0,0.5)] text-[#ffffff] hover:bg-[#ffffff] hover:text-[#000000] transition-all duration-300 ease-in-out cursor-pointer"
          >
            <PrevArrowIcon />
          </button>
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-[16px] md:right-[56px] top-1/2 -translate-y-1/2 z-[2] w-[46px] h-[46px] rounded-[9999px] inline-flex items-center justify-center bg-[rgba(0,0,0,0.5)] text-[#ffffff] hover:bg-[#ffffff] hover:text-[#000000] transition-all duration-300 ease-in-out cursor-pointer"
          >
            <NextArrowIcon />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slideCount > 1 && (
        <div className="absolute bottom-[16px] md:bottom-[20px] left-0 right-0 z-[2] flex justify-center lg:justify-end lg:pr-[57px] gap-[8px] pointer-events-none">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="pointer-events-auto h-[6px] rounded-[9999px] transition-all duration-300 ease-in-out cursor-pointer border-0 p-0"
              style={{
                width: i === activeIndex ? "22px" : "6px",
                backgroundColor: dotBg(i),
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
});
