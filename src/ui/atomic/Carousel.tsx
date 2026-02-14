"use client";

import React, { useState, useEffect, useRef, Children, ReactNode } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
} from "@radix-ui/react-icons";
import { Box, Flex, Button, ComponentVariants } from "@/ui/atomic";

export interface CarouselProps {
  children: ReactNode;
  slidesToShow?: number;
  slidesToScroll?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  infinite?: boolean;
  iconStyle?: "arrow" | "chevron" | "caret" | "circle";
  className?: string;
  containerClassName?: string;
  slideClassName?: string;
  responsive?: Array<{
    breakpoint: number;
    settings: { slidesToShow?: number; slidesToScroll?: number };
  }>;
  navigationPosition?: "inside" | "outside";
  customLeftIcon?: ReactNode;
  customRightIcon?: ReactNode;
  showNavigationIconOnHover?: boolean;
  navigationButtonVariant: ComponentVariants;
}

export function Carousel({
  children,
  slidesToShow = 1,
  slidesToScroll = 1,
  autoplay = false,
  autoplayInterval = 3000,
  showArrows = true,
  showDots = false,
  infinite = true,
  iconStyle = "arrow",
  className = "",
  containerClassName = "",
  slideClassName = "",
  responsive = [],
  navigationPosition = "outside",
  customLeftIcon,
  customRightIcon,
  showNavigationIconOnHover = false,
  navigationButtonVariant = "outline",
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesCount, setSlidesCount] = useState(0);
  const [currentSlidesToShow, setCurrentSlidesToShow] = useState(slidesToShow);
  const [currentSlidesToScroll, setCurrentSlidesToScroll] =
    useState(slidesToScroll);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hovered, setHovered] = useState(false);

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const match = responsive
        .sort((a, b) => b.breakpoint - a.breakpoint)
        .find((item) => window.innerWidth <= item.breakpoint);

      if (match) {
        setCurrentSlidesToShow(match.settings.slidesToShow || slidesToShow);
        setCurrentSlidesToScroll(
          match.settings.slidesToScroll || slidesToScroll
        );
      } else {
        setCurrentSlidesToShow(slidesToShow);
        setCurrentSlidesToScroll(slidesToScroll);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [responsive, slidesToShow, slidesToScroll]);

  useEffect(() => {
    setSlidesCount(Children.count(children));
  }, [children]);

  useEffect(() => {
    if (!autoplay) {
      return;
    }
    autoPlayRef.current = setInterval(() => nextSlide(), autoplayInterval);
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoplay, autoplayInterval, currentSlide, slidesCount]);

  const navigationIconStyle: React.CSSProperties = {
    borderRadius: "50%",
    height: "40px",
    width: "40px",
    padding: "12px",
  };

  const nextSlide = () => {
    if (isTransitioning) {
      return;
    }
    setIsTransitioning(true);
    const maxSlide = slidesCount - currentSlidesToShow;
    let next = currentSlide + currentSlidesToScroll;
    if (next > maxSlide) {
      next = infinite ? 0 : maxSlide;
    }
    setCurrentSlide(next);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) {
      return;
    }
    setIsTransitioning(true);
    const maxSlide = slidesCount - currentSlidesToShow;
    let prev = currentSlide - currentSlidesToScroll;
    if (prev < 0) {
      prev = infinite ? maxSlide : 0;
    }
    setCurrentSlide(prev);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const renderIcon = (dir: "prev" | "next") => {
    if (dir === "prev" && customLeftIcon) {
      return customLeftIcon;
    }
    if (dir === "next" && customRightIcon) {
      return customRightIcon;
    }

    switch (iconStyle) {
      case "chevron":
        return dir === "prev" ? <ChevronLeftIcon /> : <ChevronRightIcon />;
      case "caret":
        return dir === "prev" ? <CaretLeftIcon /> : <CaretRightIcon />;
      case "circle":
        return <CircleIcon />;
      case "arrow":
      default:
        return dir === "prev" ? <ArrowLeftIcon /> : <ArrowRightIcon />;
    }
  };

  const isPrevDisabled = !infinite && currentSlide === 0;
  const isNextDisabled =
    !infinite && currentSlide >= slidesCount - currentSlidesToShow;

  return (
    <Box
      className={`carousel-wrapper relative ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Flex align="center" justify="center" className="relative w-full">
        {/* Left Arrow (outside or inside) */}
        {showArrows && navigationPosition === "outside" && (
          <Button
            onClick={prevSlide}
            disabled={isPrevDisabled}
            aria-label="Previous slide"
            variant={navigationButtonVariant}
            className="bg-primary"
            style={navigationIconStyle}
          >
            {renderIcon("prev")}
          </Button>
        )}

        {/* Scrollable Container */}
        <div
          className={`carousel-container relative overflow-hidden ${containerClassName}`}
          style={{
            flex: "1 1 auto",
            position: "relative",
          }}
        >
          {/* Inside arrows */}
          {showArrows && navigationPosition === "inside" && (
            <>
              <Button
                onClick={prevSlide}
                disabled={isPrevDisabled}
                aria-label="Previous slide"
                variant={navigationButtonVariant}
                style={navigationIconStyle}
              >
                {renderIcon("prev")}
              </Button>

              <Button
                onClick={nextSlide}
                disabled={isNextDisabled}
                aria-label="Next slide"
                style={navigationIconStyle}
                variant={navigationButtonVariant}
              >
                {renderIcon("next")}
              </Button>
            </>
          )}

          {/* Slides Track */}
          <div
            ref={trackRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${(currentSlide * 100) / currentSlidesToShow}%)`,
            }}
          >
            {Children.map(children, (child) => (
              <div
                className={`carousel-slide ${slideClassName}`}
                style={{
                  flex: `0 0 calc(100% / ${currentSlidesToShow})`,
                  maxWidth: `calc(100% / ${currentSlidesToShow})`,
                  padding: "0 8px",
                }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow (outside) */}
        {showArrows && navigationPosition === "outside" && (
          <Button
            onClick={nextSlide}
            disabled={isNextDisabled}
            aria-label="Next slide"
            variant={navigationButtonVariant}
            style={navigationIconStyle}
          >
            {renderIcon("next")}
          </Button>
        )}
      </Flex>

      {/* Dots */}
      {showDots && (
        <Flex justify="center" className="mt-3 space-x-2">
          {Array.from({ length: Math.ceil(slidesCount / slidesToScroll) }).map(
            (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentSlide(i * slidesToScroll)}
                variant="primary"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor:
                    currentSlide === i * slidesToScroll ? "black" : "lightgray",
                  padding: 0,
                  border: "none",
                  cursor: "pointer",
                  margin: "8px 4px",
                }}
              />
            )
          )}
        </Flex>
      )}
    </Box>
  );
}
