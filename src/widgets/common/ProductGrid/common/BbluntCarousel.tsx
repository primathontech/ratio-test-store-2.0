"use client";

import React, {
  useState,
  useEffect,
  useRef,
  Children,
  ReactNode,
  useCallback,
} from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
} from "@radix-ui/react-icons";

export interface BbluntCarouselProps {
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
  navigationButtonVariant?: string;
  smoothScroll?: boolean;
  arrowClassNames?: string;
}

export function BbluntCarousel({
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
  smoothScroll,
  arrowClassNames,
}: BbluntCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesCount, setSlidesCount] = useState(0);
  const [currentSlidesToShow, setCurrentSlidesToShow] = useState(slidesToShow);
  const [currentSlidesToScroll, setCurrentSlidesToScroll] =
    useState(slidesToScroll);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef(0);
  const dragStartRef = useRef(0);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setCurrentSlidesToShow(slidesToShow);
      setCurrentSlidesToScroll(slidesToScroll);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [slidesToShow, slidesToScroll]);

  useEffect(() => {
    setSlidesCount(Children.count(children));
  }, [children]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) {
      return;
    }
    const maxSlide = Math.max(0, slidesCount - currentSlidesToShow);
    const isAtEnd = currentSlide >= maxSlide;

    if (!infinite && isAtEnd) {
      return;
    }

    setIsTransitioning(true);

    // Use slidesToScroll for consistent scrolling behavior
    let next = currentSlide + currentSlidesToScroll;
    if (next > maxSlide) {
      next = infinite ? 0 : maxSlide;
    }
    setCurrentSlide(next);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [
    isTransitioning,
    slidesCount,
    currentSlidesToShow,
    currentSlide,
    infinite,
    currentSlidesToScroll,
  ]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) {
      return;
    }
    const isAtStart = currentSlide === 0;

    if (!infinite && isAtStart) {
      return;
    }

    setIsTransitioning(true);

    // Use slidesToScroll for consistent scrolling behavior
    const maxSlide = Math.max(0, slidesCount - currentSlidesToShow);
    let prev = currentSlide - currentSlidesToScroll;
    if (prev < 0) {
      prev = infinite ? maxSlide : 0;
    }
    setCurrentSlide(prev);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [
    isTransitioning,
    slidesCount,
    currentSlidesToShow,
    currentSlide,
    infinite,
    currentSlidesToScroll,
  ]);

  useEffect(() => {
    if (!autoplay || isDragging) {
      return;
    }
    autoPlayRef.current = setInterval(() => nextSlide(), autoplayInterval);
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoplay, autoplayInterval, nextSlide, isDragging]);

  // Touch handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!smoothScroll) {
      return;
    }
    touchStartRef.current = e.touches[0].clientX;
    setIsDragging(true);
    setHasMoved(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!smoothScroll || !isDragging) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const distance = Math.abs(touchStartRef.current - currentTouch);

    if (distance > 5) {
      setHasMoved(true);
    }

    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    if (!smoothScroll || !isDragging) {
      return;
    }

    if (hasMoved) {
      const distance = touchStartRef.current - touchEnd;
      const minSwipeDistance = 50;

      if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    setIsDragging(false);
    setHasMoved(false);
    setTouchEnd(0);
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!smoothScroll) {
      return;
    }

    // Allow dragging on cards - only prevent on actual interactive elements
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "INPUT" ||
      target.tagName === "SELECT" ||
      target.tagName === "TEXTAREA" ||
      target.closest(
        "button:not(.carousel-slide button), input, select, textarea"
      )
    ) {
      return;
    }

    // Prevent text selection during drag
    e.preventDefault();
    dragStartRef.current = e.clientX;
    setIsDragging(true);
    setHasMoved(false);
  };

  // Global mouse event handlers
  useEffect(() => {
    if (!isDragging || !smoothScroll) {
      return;
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const distance = Math.abs(dragStartRef.current - e.clientX);

      if (distance > 5) {
        setHasMoved(true);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      const distance = dragStartRef.current - e.clientX;
      const minDragDistance = 50;

      if (hasMoved && Math.abs(distance) > minDragDistance) {
        if (distance > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }

      setIsDragging(false);
      setHasMoved(false);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, smoothScroll, nextSlide, prevSlide, hasMoved]);

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

  const maxSlide = Math.max(0, slidesCount - currentSlidesToShow);
  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide >= maxSlide;
  const bothButtonsDisabled = isPrevDisabled && isNextDisabled;

  return (
    <div
      data-testid="bblunt-carousel-wrapper"
      className={`carousel-wrapper relative ${className} ${
        bothButtonsDisabled ? "carousel-no-navigation" : ""
      }`}
    >
      <div
        data-testid="bblunt-carousel-container"
        className="flex items-center justify-center relative w-full md:gap-10"
      >
        {/* Outside Previous Button */}
        {showArrows && navigationPosition === "outside" && (
          <button
            data-testid="bblunt-carousel-prev-button-outside"
            onClick={prevSlide}
            disabled={isPrevDisabled}
            aria-label="Previous slide"
            className={`flex justify-center items-center flex-shrink-0 size-[24px] transition-all duration-300 ${
              isPrevDisabled
                ? "opacity-0 cursor-default pointer-events-none"
                : "opacity-100 cursor-pointer"
            } ${arrowClassNames}`}
          >
            {renderIcon("prev")}
          </button>
        )}

        {/* Scrollable Container */}
        <div
          data-testid="bblunt-carousel-scrollable-container"
          ref={containerRef}
          className={`carousel-container relative overflow-hidden ${containerClassName}`}
          style={{
            flex: "1 1 auto",
            position: "relative",
            touchAction: "pan-y pinch-zoom",
            WebkitOverflowScrolling: "touch",
            cursor:
              smoothScroll && !isDragging
                ? "grab"
                : smoothScroll && isDragging && hasMoved
                  ? "grabbing"
                  : "default",
            userSelect: hasMoved ? "none" : "auto",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {/* Inside arrows */}
          {showArrows && navigationPosition === "inside" && (
            <>
              <button
                data-testid="bblunt-carousel-prev-button-inside"
                onClick={prevSlide}
                disabled={isPrevDisabled}
                aria-label="Previous slide"
                className={`flex justify-center items-center absolute top-1/2 left-14 opacity-0 group-hover:opacity-100 group-hover:left-8 z-[10] h-[46px] w-[46px] rounded-full p-3 -translate-y-1/2 text-white transition-all duration-300 ${
                  isPrevDisabled
                    ? "cursor-default bg-white/20"
                    : "cursor-pointer bg-black hover:bg-white hover:text-black"
                }`}
              >
                {renderIcon("prev")}
              </button>

              <button
                data-testid="bblunt-carousel-next-button-inside"
                onClick={nextSlide}
                disabled={isNextDisabled}
                aria-label="Next slide"
                className={`flex justify-center items-center absolute top-1/2 right-14 opacity-0 group-hover:opacity-100 group-hover:right-8 z-[10] h-[46px] w-[46px] rounded-full p-3 -translate-y-1/2 text-white transition-all duration-300 ${
                  isNextDisabled
                    ? "cursor-default bg-white/20"
                    : "cursor-pointer bg-black hover:bg-white hover:text-black"
                }`}
              >
                {renderIcon("next")}
              </button>
            </>
          )}

          {/* Slides Track */}
          <div
            data-testid="bblunt-carousel-slides-track"
            ref={trackRef}
            className={`flex items-stretch transition-transform ${smoothScroll ? "duration-500 ease-in-out" : "duration-300 ease-in-out"}`}
            style={{
              transform: `translateX(-${(currentSlide * 100) / currentSlidesToShow}%)`,
            }}
          >
            {Children.map(children, (child, index) => (
              <div
                key={index}
                data-testid={`bblunt-carousel-slide-${index}`}
                className={`carousel-slide first:ml-[10px] first:md:ml-0 last:mr-[10px] last:md:mr-0 px-[6px] md:px-0 ${slideClassName}`}
                style={{
                  flex: `0 0 calc(100% / ${currentSlidesToShow})`,
                  maxWidth: `calc(100% / ${currentSlidesToShow})`,
                  pointerEvents: hasMoved ? "none" : "auto",
                }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>

        {/* Outside Next Button */}
        {showArrows && navigationPosition === "outside" && (
          <button
            data-testid="bblunt-carousel-next-button-outside"
            onClick={nextSlide}
            disabled={isNextDisabled}
            aria-label="Next slide"
            className={`flex justify-center items-center flex-shrink-0 size-[24px] transition-all duration-300 ${
              isNextDisabled
                ? "opacity-0 cursor-default pointer-events-none"
                : "opacity-100 cursor-pointer"
            } ${arrowClassNames}`}
          >
            {renderIcon("next")}
          </button>
        )}
      </div>

      {/* Dots */}
      {showDots && (
        <div
          data-testid="bblunt-carousel-dots-container"
          className="flex justify-center mt-6 gap-x-3"
        >
          {(() => {
            const maxSlide = Math.max(0, slidesCount - currentSlidesToShow);
            const dotsCount =
              maxSlide === 0
                ? 1
                : Math.ceil((maxSlide + 1) / currentSlidesToScroll);

            return Array.from({ length: dotsCount }).map((_, i) => {
              const slideIndex = i * currentSlidesToScroll;
              const targetSlide = Math.min(slideIndex, maxSlide);
              const isActive =
                currentSlide >= slideIndex &&
                currentSlide < slideIndex + currentSlidesToScroll;

              return (
                <button
                  key={i}
                  data-testid={`bblunt-carousel-dot-${i}`}
                  onClick={() => setCurrentSlide(targetSlide)}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  className={isActive ? "ring-1 ring-black ring-offset-4" : ""}
                  style={{
                    width: isActive ? "4px" : "6px",
                    height: isActive ? "4px" : "6px",
                    borderRadius: "50%",
                    backgroundColor: isActive ? "black" : "lightgray",
                    padding: 0,
                    border: "none",
                    cursor: "pointer",
                    margin: "8px 4px",
                  }}
                />
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
