"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { Props } from "../types";
import { ArrowButton } from "../compounds/ArrowButton";
import { TestimonialCardWrapper } from "../compounds/card-variants";
import { generateHeadingStyles } from "../compounds/utils";
import { IndicatorDot } from "../../HeroCarousel/compounds/IndicatorDot";

export const V1 = ({ settings }: Props) => {
  const {
    interval = 5000,
    testimonials,
    pauseOnHover = true,
    autoplay = true,
    loop = true,
    showArrows = true,
    showIndicators = true,
    swipeable = true,
    maxTestimonials = 10,
    width = "container",
    slidesPerView = 3,
    mobileSlidesPerView = 1,
    spacing = 16,
    ariaLabel = "Customer testimonials carousel",
    className,
    style,
    containerProps,
    indicatorPosition = "bottom-center",
    indicatorOffset = -24,
    indicatorWidth,
    indicatorActiveWidth,
    indicatorHeight,
    indicatorActiveColor,
    indicatorInactiveColor,
    indicatorActiveBorderColor,
    indicatorInactiveBorderColor,
    indicatorBorderWidth,
    indicatorBorderRadius,
    indicatorTransitionDuration,
    arrowShape = "circle",
    arrowSize,
    arrowOffsetX,
    arrowOffsetY,
    heading,
    subheading,
    headingStyles,
    subheadingStyles,
    testimonialBackgroundColor,
    cardVariant,
    cardStyleConfig,
    backgroundSrc,
    isShowFocusRing,
    gapBeetweenDots,
    arrowBackgroundColor,
    arrowActiveBackgroundColor,
    arrowHoverBackgroundColor,
  } = settings;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [currentSlidesPerView, setCurrentSlidesPerView] = useState(3);

  // Detect viewport and set slides per view
  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCurrentSlidesPerView(mobileSlidesPerView);
        setIsMobile(width < 768);
      } else if (width >= 768 && width < 1150) {
        setCurrentSlidesPerView(2);
      } else {
        setCurrentSlidesPerView(slidesPerView);
      }
    };

    updateSlidesPerView();

    window.addEventListener("resize", updateSlidesPerView);

    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  // Limit testimonials based on maxTestimonials setting
  const limitedTestimonials = testimonials.slice(0, maxTestimonials);

  // Setup embla carousel with autoplay plugin
  const autoplayPlugin = Autoplay({
    delay: interval,
    stopOnInteraction: pauseOnHover,
    stopOnMouseEnter: pauseOnHover,
  });

  // Use 1 for slidesToScroll when using decimal slides per view (like 1.3)
  const scrollAmount =
    currentSlidesPerView % 1 !== 0 ? 1 : currentSlidesPerView;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align: "start",
      slidesToScroll: scrollAmount,
      dragFree: false,
      containScroll: "trimSnaps",
      skipSnaps: false,
      dragThreshold: swipeable ? 10 : 1000,
    },
    autoplay ? [autoplayPlugin] : []
  );

  // Handle slide selection changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    const selectedIndex = emblaApi.selectedScrollSnap();
    const totalSlides = limitedTestimonials.length;
    const perView = currentSlidesPerView;
    const maxIndicatorIndex = Math.ceil(totalSlides / perView) - 1;

    // Calculate the indicator index based on selected snap
    let indicatorIndex = Math.floor(selectedIndex);

    // Ensure we don't exceed the maximum indicator index
    if (indicatorIndex > maxIndicatorIndex) {
      indicatorIndex = maxIndicatorIndex;
    }

    setCurrentSlide(indicatorIndex);

    // Update navigation state when loop is disabled
    if (!loop) {
      setIsAtStart(!emblaApi.canScrollPrev());
      setIsAtEnd(!emblaApi.canScrollNext());
    }
  }, [emblaApi, limitedTestimonials.length, currentSlidesPerView, loop]);

  // Initialize embla event listeners
  useEffect(() => {
    if (!emblaApi) return;

    onSelect(); // Set initial state
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Custom navigation functions to move by groups
  const navigatePrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const navigateNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  // Navigate to a specific group when indicator is clicked
  const navigateToGroup = useCallback(
    (groupIndex: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(groupIndex);
    },
    [emblaApi]
  );

  // Handle autoplay pause/resume on hover
  useEffect(() => {
    if (!emblaApi || !autoplay) return;

    const autoplayInstance = emblaApi.plugins().autoplay;
    if (!autoplayInstance) return;

    if (isHovered && pauseOnHover) {
      autoplayInstance.stop();
    } else if (!isHovered && pauseOnHover) {
      autoplayInstance.play();
    }
  }, [emblaApi, isHovered, pauseOnHover, autoplay]);

  // Early return if no testimonials
  if (!limitedTestimonials || limitedTestimonials.length === 0) {
    return null;
  }

  // Calculate container styles
  const containerStyle: React.CSSProperties = {
    width: width === "container" ? "100%" : width === "full" ? "100vw" : width,
    ...style,
  };

  // Generate the styles
  const headingAndSubHeadingStyles = generateHeadingStyles({
    headingFontSizeMobile: headingStyles?.fontSize?.mobile,
    headingFontSizeDesktop: headingStyles?.fontSize?.desktop,
    headingColor: headingStyles?.color,
    subheadingFontSizeMobile: subheadingStyles?.fontSize?.mobile,
    subheadingFontSizeDesktop: subheadingStyles?.fontSize?.desktop,
    subheadingColor: subheadingStyles?.color,
  });

  // Calculate total number of slides for indicators
  const totalSlides = Math.ceil(
    limitedTestimonials.length / currentSlidesPerView
  );

  const finalSpacing = isMobile ? 16 : spacing;

  return (
    <div
      data-testid="testimonials-container"
      className={`relative select-none ${width === "full" ? "w-screen" : "w-full"} ${className || ""} md:px-12 xl:px-40`}
      style={containerStyle}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      aria-label={ariaLabel}
      {...containerProps}
    >
      {/* Section Background Image */}
      {backgroundSrc && (
        <div
          data-testid="testimonials-background-image"
          className="absolute inset-0 z-[-10] size-full"
        >
          <Image
            src={backgroundSrc}
            alt="testimonial background"
            width={1440}
            height={387}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Section Heading */}
      {(heading || subheading) && (
        <>
          <style>{headingAndSubHeadingStyles}</style>
          <div
            data-testid="testimonials-heading-container"
            className="px-6 md:px-0 md:text-center mb-10 lg:mb-[56px]"
          >
            {heading && (
              <h2
                data-testid="testimonials-heading"
                className="section-heading"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}
            {subheading && (
              <p
                data-testid="testimonials-subheading"
                className="section-subheading mb-2"
              >
                {subheading}
              </p>
            )}
          </div>
        </>
      )}

      {/* Testimonials Slider */}
      <div
        data-testid="testimonials-slider-container"
        className="md:flex md:items-center md:gap-[2.6rem] relative w-full"
      >
        {/* Outside Previous Button */}
        {showArrows && limitedTestimonials.length > currentSlidesPerView && (
          <button
            data-testid="testimonials-prev-button"
            onClick={navigatePrev}
            disabled={!loop && isAtStart}
            aria-label="Previous testimonial"
            className={`hidden md:flex justify-center items-center flex-shrink-0 size-[24px] text-white transition-all duration-300 ${
              !loop && isAtStart
                ? "opacity-0 cursor-default pointer-events-none"
                : "opacity-100 cursor-pointer"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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

        {/* Carousel Container */}
        <div
          data-testid="testimonials-embla-container"
          ref={emblaRef}
          className="embla overflow-hidden"
        >
          <div
            data-testid="testimonials-embla-slides-container"
            className="embla__container flex"
            style={{ gap: `${finalSpacing}px` }}
          >
            {limitedTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id || index}
                data-testid={`testimonials-slide-${testimonial.id || index}`}
                className="embla__slide first:ml-[15px] md:first:ml-0 last:mr-[15px] last:md:mr-0"
                style={{
                  flex: `0 0 calc(${100 / currentSlidesPerView}% - ${(finalSpacing * (currentSlidesPerView - 1)) / currentSlidesPerView}px)`,
                  minWidth: 0,
                }}
              >
                <TestimonialCardWrapper
                  testimonial={testimonial}
                  variant={cardVariant}
                  styleConfig={cardStyleConfig}
                  backgroundColor={testimonialBackgroundColor || "#e6f0fa"}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Outside Next Button */}
        {showArrows && limitedTestimonials.length > currentSlidesPerView && (
          <button
            data-testid="testimonials-next-button"
            onClick={navigateNext}
            disabled={!loop && isAtEnd}
            aria-label="Next testimonial"
            className={`hidden md:flex justify-center items-center flex-shrink-0 size-[24px] text-white transition-all duration-300 ${
              !loop && isAtEnd
                ? "opacity-0 cursor-default pointer-events-none"
                : "opacity-100 cursor-pointer"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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

      {/* Slide Indicators */}
      {showIndicators && totalSlides > 1 && (
        <div
          data-testid="testimonials-indicators-container"
          className={`md:hidden w-full justify-center flex mt-6 gap-4`}
        >
          {[...Array(totalSlides)].map((_, index) => (
            <IndicatorDot
              key={index}
              isActive={index === currentSlide}
              onClick={() => navigateToGroup(index)}
              index={index}
              width={indicatorWidth}
              activeWidth={indicatorActiveWidth}
              height={indicatorHeight}
              activeColor={indicatorActiveColor}
              inactiveColor={indicatorInactiveColor}
              activeBorderColor={indicatorActiveBorderColor}
              inactiveBorderColor={indicatorInactiveBorderColor}
              borderWidth={indicatorBorderWidth}
              borderRadius={indicatorBorderRadius}
              transitionDuration={indicatorTransitionDuration}
              isShowFocusRing={isShowFocusRing}
            />
          ))}
        </div>
      )}
    </div>
  );
};
