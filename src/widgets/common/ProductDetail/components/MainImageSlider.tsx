"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { NavigationArrow } from "./NavigationArrow";
import { SelectionBox } from "./SelectionBox";
import { ProductImage, ProductLabel, TNavigationArrowPosition } from "../types";
import {
  getAnimationClass,
  getExpandIconPositionStyle,
  isVideo,
} from "../utils/galleryHelpers";

interface MainImageSliderProps {
  images: ProductImage[];
  currentIndex: number;
  onSlideChange: (index: number) => void;
  onThumbnailClick: (index: number) => void;
  onImageClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;

  mainImageRadius: number;
  autoPlay: boolean;
  autoPlayAnimation: string;

  showNavigationArrows: boolean;
  navigationArrowSize: number;
  navigationArrowBgColor: string;
  navigationArrowIconColor: string;
  navigationArrowShape: "circle" | "square" | "rounded";
  navigationArrowLeftIcon?: string;
  navigationArrowRightIcon?: string;
  navigationArrowLeftPosition?: TNavigationArrowPosition;
  navigationArrowRightPosition?: TNavigationArrowPosition;
  onPrevious: () => void;
  onNext: () => void;

  showExpandIcon?: boolean;
  expandIconSize?: number;
  expandIconBgColor?: string;
  expandIconColor?: string;
  expandIconPosition?: string;
  expandIconSrc?: string;
  onExpandClick: () => void;

  enableHoverPreview: boolean;
  showSelectionBox: boolean;
  isHoverPreviewVisible: boolean;
  mousePosition: { x: number; y: number };
  containerDimensions: { width: number; height: number };
  hoverPreviewSize: number;
  selectionBoxBorderColor: string;
  selectionBoxBorderWidth: number;
  selectionBoxBackgroundOpacity: number;
  onHoverPreviewDisable?: () => void;
  onHoverPreviewEnable?: () => void;

  containerRef: React.RefObject<HTMLDivElement>;
  sliderRef: (node: HTMLDivElement | null) => void;

  isSliderReady: boolean;

  productLabel?: ProductLabel | null;
  children?: React.ReactNode;
}

const MOBILE_BREAKPOINT = 768;
const MIN_MOBILE_IMAGE_SIZE = 270;
const MOBILE_HORIZONTAL_PADDING = 90;
const MOBILE_GAP = 8;
const NEXT_PEEK_PERCENT = 0.45;

/**
 * Main product image area — embla slide track + product label badge +
 * expand-icon + desktop navigation arrows + mobile pagination dots.
 *
 * The slider DOM node is supplied by the parent via `sliderRef` (a ref
 * callback that initialises embla on mount).
 */
export const MainImageSlider: React.FC<MainImageSliderProps> = ({
  images,
  currentIndex,
  onSlideChange,
  onThumbnailClick,
  onImageClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  mainImageRadius,
  autoPlay,
  autoPlayAnimation,
  showNavigationArrows,
  navigationArrowSize,
  navigationArrowBgColor,
  navigationArrowIconColor,
  navigationArrowShape,
  navigationArrowLeftIcon,
  navigationArrowRightIcon,
  navigationArrowLeftPosition,
  navigationArrowRightPosition,
  onPrevious,
  onNext,
  showExpandIcon,
  expandIconSize = 28,
  expandIconBgColor = "#ccc",
  expandIconColor = "#000000",
  expandIconPosition = "bottom-right",
  expandIconSrc,
  onExpandClick,
  enableHoverPreview,
  showSelectionBox,
  isHoverPreviewVisible,
  mousePosition,
  containerDimensions,
  hoverPreviewSize,
  selectionBoxBorderColor,
  selectionBoxBorderWidth,
  selectionBoxBackgroundOpacity,
  containerRef,
  sliderRef,
  isSliderReady,
  onHoverPreviewDisable,
  onHoverPreviewEnable,
  productLabel,
  children,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState(MIN_MOBILE_IMAGE_SIZE);
  const videoRefs = useRef<{ [key: string | number]: HTMLVideoElement | null }>(
    {}
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
      if (width < MOBILE_BREAKPOINT) {
        setContainerWidth(
          Math.max(MIN_MOBILE_IMAGE_SIZE, width - MOBILE_HORIZONTAL_PADDING)
        );
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MOBILE_IMAGE_SIZE = isMobile ? containerWidth : MIN_MOBILE_IMAGE_SIZE;
  const MOBILE_VIDEO_WIDTH = isMobile ? containerWidth : MIN_MOBILE_IMAGE_SIZE;
  const maxMobileWidth = Math.max(MOBILE_IMAGE_SIZE, MOBILE_VIDEO_WIDTH);
  const viewportWidth = isMobile
    ? images.length > 1
      ? maxMobileWidth * (1 + NEXT_PEEK_PERCENT) + MOBILE_GAP
      : maxMobileWidth
    : undefined;

  const animationClass = getAnimationClass(autoPlay, autoPlayAnimation);
  const isLeftDisabled = currentIndex === 0;
  const isRightDisabled = currentIndex === images.length - 1;

  // Pause every video, then play the one that's now current (if any).
  useEffect(() => {
    Object.values(videoRefs.current).forEach((v) => v?.pause());
    const currentMedia = images[currentIndex];
    if (currentMedia && isVideo(currentMedia)) {
      const mediaId = currentMedia.id || currentIndex;
      videoRefs.current[mediaId]?.play().catch(() => {
        // Ignore autoplay rejections (browser policy)
      });
    }
  }, [currentIndex, images]);

  const currentMedia = images[currentIndex];
  const isCurrentVideo = currentMedia ? isVideo(currentMedia) : false;

  // Disable hover-preview while a video is in view — magnifying a poster
  // looks strange and the cursor is over a `<video>` with its own controls.
  const handleMouseEnter = isCurrentVideo ? undefined : onMouseEnter;
  const handleMouseLeave = isCurrentVideo
    ? () => onHoverPreviewDisable?.()
    : onMouseLeave;
  const handleMouseMove = isCurrentVideo ? undefined : onMouseMove;

  useEffect(() => {
    if (isCurrentVideo && enableHoverPreview) {
      onHoverPreviewDisable?.();
    }
  }, [isCurrentVideo, enableHoverPreview, onHoverPreviewDisable]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Skeleton placeholder until embla initialises */}
      {!isSliderReady && (
        <div
          className={`bg-gray-200 animate-pulse ${
            isMobile ? "" : "w-full aspect-square"
          }`}
          style={
            isMobile
              ? {
                  borderRadius: "0",
                  width: `${MOBILE_IMAGE_SIZE}px`,
                  height: `${MOBILE_IMAGE_SIZE}px`,
                }
              : { borderRadius: `${mainImageRadius}px` }
          }
        />
      )}

      {/* Product label ribbon — top-left, with right-edge inward cut.
          Note: kept at z-30 (above the embla wrapper's `z-0` stacking
          context) so the ribbon stays visible AFTER the slider initialises
          and embla's opacity transition finishes — without an explicit
          stacking context on the embla wrapper, the slide images can
          paint above a z-20 ribbon. */}
      {productLabel && (
        <div
          className="absolute z-[30] font-[500] text-white pointer-events-none"
          style={{
            fontSize: "12px",
            ...(isMobile
              ? { top: "22px", left: "8px" }
              : isCurrentVideo
                ? {
                    top: "calc(50% - 180.5px)",
                    left: "calc(50% - 321px)",
                  }
                : { top: "33px", left: "6px" }),
          }}
        >
          <div className="relative inline-block">
            <div
              className={`pl-[8px] ${
                isMobile
                  ? "text-[12px] leading-none py-[3px] px-0"
                  : "text-[14px] px-1 pr-[12px]"
              }`}
              style={{
                backgroundColor: productLabel.background || "#82c341",
                paddingRight: "12px",
                clipPath:
                  "polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%)",
                borderTopLeftRadius: "4px",
                borderBottomLeftRadius: "4px",
              }}
            >
              {productLabel.label}
            </div>
          </div>
        </div>
      )}

      {/* Embla slide track — `relative z-0` so the wrapper has its own
          stacking context that always sits below the ribbon's z-30. Without
          this, when the opacity transition completes (1.0 → no stacking
          context), slide images can paint above the ribbon and "remove" it. */}
      <div
        className={`embla overflow-hidden transition-opacity duration-200 relative z-0 ${animationClass} ${
          isSliderReady ? "opacity-100" : "opacity-0"
        }`}
        style={
          isMobile
            ? { borderRadius: "0" }
            : { borderRadius: `${mainImageRadius}px` }
        }
      >
        <div
          className="embla__viewport overflow-hidden relative"
          ref={sliderRef}
          style={{
            ...(isMobile
              ? {
                  width: viewportWidth ? `${viewportWidth}px` : undefined,
                  height: isCurrentVideo ? "188px" : `${MOBILE_IMAGE_SIZE}px`,
                  touchAction: "pan-y pinch-zoom",
                  WebkitOverflowScrolling: "touch",
                  transition: "height 0.3s ease-in-out",
                }
              : isCurrentVideo
                ? { height: "361px" }
                : {}),
            willChange: "scroll-position",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div
            className="embla__container flex gap-6 md:gap-0"
            style={{
              ...(isMobile ? { gap: `${MOBILE_GAP}px` } : {}),
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
            }}
          >
            {images.map((image, index) => {
              const isVideoItem = isVideo(image);
              const mediaId = image.id || index;

              return (
                <div
                  key={mediaId}
                  className={`embla__slide relative cursor-pointer ${
                    isMobile
                      ? "flex-[0_0_auto]"
                      : isVideoItem
                        ? "flex-[0_0_100%] min-w-0 flex items-center justify-center"
                        : "w-full aspect-square flex-[0_0_100%] min-w-0"
                  }`}
                  style={{
                    ...(isMobile
                      ? {
                          width: `${maxMobileWidth}px`,
                          height: isVideoItem
                            ? "188px"
                            : `${MOBILE_IMAGE_SIZE}px`,
                          borderRadius: "0",
                          overflow: "hidden",
                          flexShrink: 0,
                          transform: "translateZ(0)",
                          WebkitTransform: "translateZ(0)",
                        }
                      : isVideoItem
                        ? {
                            width: "642px",
                            height: "361px",
                            margin: "0 auto",
                            overflow: "hidden",
                          }
                        : {}),
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                  onClick={onImageClick}
                  role="button"
                  tabIndex={0}
                  aria-label={
                    isVideoItem ? "Click to zoom video" : "Click to zoom image"
                  }
                >
                  {isVideoItem ? (
                    // Show poster on non-current slides; the actual <video> is
                    // rendered outside the slide track for fullscreen support.
                    index !== currentIndex && image.thumbnail_url ? (
                      <Image
                        src={image.thumbnail_url}
                        alt={image.altText || "Video thumbnail"}
                        fill
                        className="object-cover"
                        sizes={
                          isMobile
                            ? `${maxMobileWidth}px`
                            : "(max-width: 768px) 100vw, 50vw"
                        }
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        quality={index === 0 ? 90 : 75}
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-black"
                        style={
                          isMobile
                            ? {
                                width: `${maxMobileWidth}px`,
                                height: "188px",
                              }
                            : { width: "642px", height: "361px" }
                        }
                      />
                    )
                  ) : (
                    <div
                      style={
                        isMobile
                          ? {
                              position: "relative",
                              height: "100%",
                              width: "calc(100% - 10px)",
                              marginLeft: "10px",
                              overflow: "hidden",
                            }
                          : {
                              position: "relative",
                              width: "100%",
                              height: "100%",
                            }
                      }
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || "Product image"}
                        fill
                        className="object-cover"
                        sizes={isMobile ? `${maxMobileWidth}px` : "642px"}
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        quality={index === 0 ? 90 : 75}
                      />
                    </div>
                  )}

                  {/* Hover-preview marker — image slides only */}
                  {enableHoverPreview && showSelectionBox && !isVideoItem && (
                    <SelectionBox
                      isVisible={isHoverPreviewVisible}
                      mousePosition={mousePosition}
                      containerRef={containerRef}
                      containerDimensions={containerDimensions}
                      sizeMultiplier={hoverPreviewSize}
                      borderColor={selectionBoxBorderColor}
                      borderWidth={selectionBoxBorderWidth}
                      backgroundOpacity={selectionBoxBackgroundOpacity}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Video elements live outside the slide track so fullscreen and
              autoplay work without the parent transforming them. */}
          {images.map((image, index) => {
            const isVideoItem = isVideo(image);
            const mediaId = image.id || index;
            const isCurrentSlide = index === currentIndex;

            if (!isVideoItem) {
              return null;
            }

            return (
              // eslint-disable-next-line jsx-a11y/media-has-caption, no-restricted-syntax
              <video
                key={`video-${mediaId}`}
                ref={(el) => {
                  videoRefs.current[mediaId] = el;
                }}
                src={image.url}
                poster={image.thumbnail_url || undefined}
                className="object-cover"
                width={isMobile ? 334 : 642}
                height={isMobile ? 188 : 361}
                style={{
                  position: "absolute",
                  top: 0,
                  left: isMobile ? 0 : "50%",
                  transform: isMobile ? "none" : "translateX(-50%)",
                  aspectRatio: "16/9",
                  width: isMobile ? "334px" : "642px",
                  height: isMobile ? "188px" : "361px",
                  maxWidth: "100%",
                  display: isCurrentSlide ? "block" : "none",
                  zIndex: 1,
                  backgroundColor: "transparent",
                }}
                muted
                loop
                playsInline
                preload={index === 0 ? "auto" : "metadata"}
                autoPlay={isCurrentSlide && index === 0}
                controls
                aria-label={image.altText || "Product video"}
                onLoadedData={() => {
                  if (isCurrentSlide && index === 0) {
                    videoRefs.current[mediaId]?.play().catch(() => {
                      /* Ignore autoplay rejections */
                    });
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {children}

      {/* Optional fullscreen-trigger icon */}
      {showExpandIcon && isSliderReady && (
        <button
          onClick={onExpandClick}
          className="absolute z-20 flex items-center justify-center"
          style={{
            width: `${expandIconSize}px`,
            height: `${expandIconSize}px`,
            backgroundColor: expandIconBgColor,
            color: expandIconColor,
            borderRadius: "50%",
            ...getExpandIconPositionStyle(expandIconPosition),
          }}
          aria-label="Open zoom/lightbox"
        >
          {expandIconSrc ? (
            <Image
              src={expandIconSrc}
              alt="Expand"
              width={expandIconSize}
              height={expandIconSize}
              className="w-full h-full object-contain"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4h6M4 4v6M20 20h-6M20 20v-6"
              />
            </svg>
          )}
        </button>
      )}

      {/* Desktop navigation arrows (hidden on small screens — mobile uses
          the thumbnail dots row below). */}
      {showNavigationArrows && isSliderReady && images.length > 1 && (
        <div className="hidden lg:block">
          <div
            className="absolute z-10"
            style={{
              left: navigationArrowLeftPosition?.left || "10px",
              right: navigationArrowLeftPosition?.right,
              top: navigationArrowLeftPosition?.top || "50%",
              bottom: navigationArrowLeftPosition?.bottom,
              transform:
                navigationArrowLeftPosition?.top || !navigationArrowLeftPosition
                  ? "translateY(-50%)"
                  : undefined,
            }}
          >
            <NavigationArrow
              direction="left"
              onClick={onPrevious}
              enableHoverPreview={enableHoverPreview}
              size={navigationArrowSize}
              bgColor={navigationArrowBgColor}
              iconColor={navigationArrowIconColor}
              shape={navigationArrowShape}
              customIcon={navigationArrowLeftIcon}
              disabled={isLeftDisabled}
              onMouseEnter={onHoverPreviewDisable}
              onMouseLeave={onHoverPreviewEnable}
            />
          </div>
          <div
            className="absolute z-10"
            style={{
              left: navigationArrowRightPosition?.left,
              right: navigationArrowRightPosition?.right || "-5px",
              top: navigationArrowRightPosition?.top || "50%",
              bottom: navigationArrowRightPosition?.bottom,
              transform:
                navigationArrowRightPosition?.top ||
                !navigationArrowRightPosition
                  ? "translateY(-50%)"
                  : undefined,
            }}
          >
            <NavigationArrow
              direction="right"
              onClick={onNext}
              enableHoverPreview={enableHoverPreview}
              size={navigationArrowSize}
              bgColor={navigationArrowBgColor}
              iconColor={navigationArrowIconColor}
              shape={navigationArrowShape}
              customIcon={navigationArrowRightIcon}
              disabled={isRightDisabled}
              onMouseEnter={onHoverPreviewDisable}
              onMouseLeave={onHoverPreviewEnable}
            />
          </div>
        </div>
      )}

      {/* Mobile pagination row — small bars (active = wide black, idle = small grey) */}
      {isMobile && images.length > 1 && (
        <div className="py-[10px] flex items-center justify-center gap-2">
          {images.map((image, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={image.id || index}
                type="button"
                onClick={() => {
                  onThumbnailClick(index);
                  onSlideChange(index);
                }}
                aria-label={`View image ${index + 1}`}
                aria-pressed={isActive}
                className="focus:outline-none"
              >
                <span
                  className={`block transition-colors duration-150 ${
                    isActive
                      ? "bg-black h-[4px] w-[12px] rounded-sm"
                      : "bg-gray-300 h-[4px] w-[4px] rounded-sm"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
