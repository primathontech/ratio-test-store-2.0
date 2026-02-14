"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import EmblaCarousel, { EmblaOptionsType } from "embla-carousel";
import { Props } from "../types";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@radix-ui/react-icons";
import { AnnouncementText } from "../compounds/AnnouncementText";
import { ActionButton } from "../compounds/ActionButton";
import { CloseButton } from "../compounds/CloseButton";
import { generateResponsiveStyles } from "../compounds/utils";

export const V2 = ({ settings }: Props) => {
  const {
    width = "full",
    backgroundColor = "#279989",
    fontColor = "#ffffff",
    fontColorMobile = "#ffffff",
    heightMobile = "40px",
    heightDesktop = "48px",
    fontSizeMobile = "14px",
    fontSizeDesktop = "16px",
    texts = [],
    ariaLabel = "Announcement banner",
    showCloseButton = false,
    enableSlider = true,
    slidesToShow = 1,
    slidesToScroll = 1,
    autoplay = true,
    autoplayInterval = 5000,
    infinite = true,
    showNavigationArrows = true,
    navigationPosition = "inside",
    navigationIconStyle = "chevron",
    showNavigationOnHover = false,
    enableDragScroll = true,
    navigationArrowColor = "#ffffff",
    navigationArrowBackgroundColor = "rgba(0,0,0,0.5)",
    navigationArrowSize = "32px",
    showActionButton = false,
    actionButtonText = "Shop Now",
    actionButtonHref,
    actionButtonTarget = "_self",
    actionButtonPosition = "right",
    actionButtonHeight,
    actionButtonWidth,
    actionButtonBorderRadius,
    actionButtonBorderColor,
    actionButtonTextColor,
    actionButtonBackgroundColor,
  } = settings;

  const [isVisible, setIsVisible] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const emblaRef = useRef<HTMLDivElement>(null);
  const emblaApi = useRef<ReturnType<typeof EmblaCarousel> | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Embla Carousel
  useEffect(() => {
    if (!emblaRef.current || !enableSlider) return;

    const options: EmblaOptionsType = {
      loop: infinite,
      align: "center",
      slidesToScroll,
      ...(enableDragScroll ? {} : { watchDrag: false }),
    };

    emblaApi.current = EmblaCarousel(emblaRef.current, options);

    const updateNavigation = () => {
      if (!emblaApi.current) return;
      setCanScrollPrev(emblaApi.current.canScrollPrev());
      setCanScrollNext(emblaApi.current.canScrollNext());
    };

    emblaApi.current.on("select", updateNavigation);
    updateNavigation();

    return () => emblaApi.current?.destroy();
  }, [enableSlider, infinite, slidesToScroll, enableDragScroll]);

  // Navigation functions
  const scrollPrev = useCallback(() => emblaApi.current?.scrollPrev(), []);
  const scrollNext = useCallback(() => emblaApi.current?.scrollNext(), []);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || !emblaApi.current || texts.length <= 1) return;

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        if (emblaApi.current?.canScrollNext()) {
          emblaApi.current.scrollNext();
        } else if (infinite) {
          emblaApi.current?.scrollTo(0);
        }
      }, autoplayInterval);
    };

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };

    startAutoplay();
    const emblaNode = emblaRef.current;
    emblaNode?.addEventListener("pointerenter", stopAutoplay);
    emblaNode?.addEventListener("pointerleave", startAutoplay);

    return () => {
      stopAutoplay();
      emblaNode?.removeEventListener("pointerenter", stopAutoplay);
      emblaNode?.removeEventListener("pointerleave", startAutoplay);
    };
  }, [autoplay, autoplayInterval, infinite, texts.length]);

  // Early return if no content
  if (!texts?.length || !isVisible || !enableSlider) return null;

  // Icon renderer
  const renderIcon = (dir: "prev" | "next") => {
    const icons = {
      arrow: dir === "prev" ? ArrowLeftIcon : ArrowRightIcon,
      caret: dir === "prev" ? CaretLeftIcon : CaretRightIcon,
      chevron: dir === "prev" ? ChevronLeftIcon : ChevronRightIcon,
    };
    const IconComponent = icons[navigationIconStyle] || icons.chevron;
    return <IconComponent stroke={fontColor} />;
  };

  // Generate responsive styles
  const responsiveStyles = generateResponsiveStyles({
    heightMobile,
    heightDesktop,
    fontSizeMobile,
    fontSizeDesktop,
    fontColor,
    fontColorMobile,
  });

  const isPrevDisabled = !infinite && !canScrollPrev;
  const isNextDisabled = !infinite && !canScrollNext;

  return (
    <div
      data-testid="announcement-bar-container"
      className="relative"
      style={{ backgroundColor }}
    >
      <style>{responsiveStyles}</style>

      <div
        data-testid="announcement-bar-wrapper"
        className={`
          announcement-bar flex items-center mx-auto px-[3px] max-w-[1240px] overflow-hidden relative
          ${width === "full" ? "w-screen" : width === "container" ? "w-full" : ""}
          ${showActionButton && actionButtonPosition === "right" ? "justify-between" : "justify-center"}
          ${showNavigationOnHover ? "group" : ""}
        `}
        role="banner"
        aria-label={ariaLabel}
        style={width !== "full" && width !== "container" ? { width } : {}}
        onMouseEnter={() => {
          if (showNavigationOnHover) {
            document.querySelectorAll(".nav-arrow").forEach((arrow) => {
              (arrow as HTMLElement).style.opacity = "1";
            });
          }
        }}
        onMouseLeave={() => {
          if (showNavigationOnHover) {
            document.querySelectorAll(".nav-arrow").forEach((arrow) => {
              (arrow as HTMLElement).style.opacity = "0";
            });
          }
        }}
      >
        {/* Carousel Container */}
        <div
          data-testid="announcement-bar-carousel-container"
          className="w-full flex md:gap-2 items-center overflow-hidden relative"
        >
          {/* Navigation Arrows */}
          {showNavigationArrows && texts.length > 1 && (
            <button
              className={`
                    nav-arrow hidden md:flex items-center justify-center
                    rounded-full border-none transition-opacity duration-200
                    ${isPrevDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}
                    ${showNavigationOnHover ? "opacity-0" : "opacity-100"}
                  `}
              onClick={scrollPrev}
              disabled={isPrevDisabled}
              aria-label="Previous announcement"
              style={{
                width: navigationArrowSize,
                height: navigationArrowSize,
                backgroundColor: navigationArrowBackgroundColor,
                color: navigationArrowColor,
              }}
            >
              {renderIcon("prev")}
            </button>
          )}

          {/* Embla Viewport */}
          <div
            data-testid="announcement-bar-embla-viewport"
            ref={emblaRef}
            className={`overflow-hidden flex-1 ${enableDragScroll ? "cursor-grab" : "cursor-default"}`}
          >
            <div
              data-testid="announcement-bar-slides-container"
              className="flex"
            >
              {texts.map((text, idx) => (
                <div
                  key={text.id || idx}
                  data-testid={`announcement-bar-slide-${text.id || idx}`}
                  className="flex items-center justify-center min-w-0"
                  style={{ flex: `0 0 ${100 / slidesToShow}%` }}
                >
                  <AnnouncementText text={text} showUnderline={false} />
                </div>
              ))}
            </div>
          </div>

          {showNavigationArrows && texts.length > 1 && (
            <button
              className={`
                    nav-arrow hidden md:flex items-center justify-center
                    rounded-full border-none transition-opacity duration-200
                    ${isNextDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}
                    ${showNavigationOnHover ? "opacity-0" : "opacity-100"}
                  `}
              onClick={scrollNext}
              disabled={isNextDisabled}
              aria-label="Next announcement"
              style={{
                width: navigationArrowSize,
                height: navigationArrowSize,
                backgroundColor: navigationArrowBackgroundColor,
                color: navigationArrowColor,
              }}
            >
              {renderIcon("next")}
            </button>
          )}
        </div>

        {/* Action Button */}
        {showActionButton && (
          <ActionButton
            text={actionButtonText}
            href={actionButtonHref}
            target={actionButtonTarget}
            position={actionButtonPosition}
            height={actionButtonHeight}
            width={actionButtonWidth}
            borderRadius={actionButtonBorderRadius}
            borderColor={actionButtonBorderColor}
            textColor={actionButtonTextColor}
            backgroundColor={actionButtonBackgroundColor}
          />
        )}
      </div>

      {/* Close Button */}
      {showCloseButton && <CloseButton onClose={() => setIsVisible(false)} />}
    </div>
  );
};
