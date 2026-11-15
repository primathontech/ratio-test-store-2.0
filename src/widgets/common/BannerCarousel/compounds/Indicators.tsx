import Image from "next/image";
import Link from "next/link";
import React from "react";

import { IBannerCarouselItem } from "../types";
import { SimpleIndicators } from "./SimpleIndicators";

/**
 * Resolve the visual kind for a slide (same rules as the V1 render path).
 * Explicit `type` is respected when it agrees with the filled URLs; falls
 * back to URL-presence inference when `type` is missing or mismatched.
 */
function resolveSlideKind(item: IBannerCarouselItem): "video" | "image" {
  const declared = (item.type ?? "").toString().toUpperCase();
  const hasVideo = Boolean(item.desktopVideo || item.mobileVideo);
  const hasImage = Boolean(item.desktopImage || item.mobileImage);
  if (declared === "VIDEO") {
    return hasVideo || !hasImage ? "video" : "image";
  }
  if (declared === "IMAGE") {
    return hasImage || !hasVideo ? "image" : "video";
  }
  return hasVideo ? "video" : "image";
}

/**
 * Thumbnail URL used inside the indicator preview.
 *  - For video slides, prefer `posterSrc` (a still image) — falls back to any
 *    image field, then to the video URL itself, then to legacy mobile/desktopSrc.
 *  - For image slides, prefer mobile then desktop then legacy.
 * Returns `null` when no usable URL exists — caller must skip rendering
 * `<Image>` in that case to avoid the empty-src warning from next/image.
 */
function resolveIndicatorThumb(
  item: IBannerCarouselItem,
  kind: "video" | "image"
): string | null {
  if (kind === "video") {
    return (
      item.posterSrc ||
      item.mobileImage ||
      item.desktopImage ||
      item.mobileVideo ||
      item.desktopVideo ||
      item.mobileSrc ||
      item.desktopSrc ||
      null
    );
  }
  return (
    item.mobileImage ||
    item.desktopImage ||
    item.mobileSrc ||
    item.desktopSrc ||
    null
  );
}

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
      className="absolute -bottom-[21.5px] left-1/2 transform -translate-x-1/2 md:left-auto md:right-[140px] md:bottom-[24px] md:transform-none flex items-center gap-[15px] z-[10]"
    >
      {items.map((item, index) => {
        const isActive = index === currentIndex;
        const kind = resolveSlideKind(item);
        const thumbUrl = resolveIndicatorThumb(item, kind);
        // For the indicator thumbnail we use a still image whenever possible.
        // Only fall back to inline <video> if the slide is a video AND no
        // poster/image is available (legacy data path).
        const useVideoThumb =
          kind === "video" && thumbUrl
            ? !item.posterSrc && !item.mobileImage && !item.desktopImage
            : false;

        // Shared pill styling for both the link (active) and button (inactive)
        // renderings so the visuals stay identical.
        const pillClassName = `
          relative overflow-hidden rounded-md flex items-center border-[2.5px] border-white
          ${isActive ? "bg-black text-white" : "bg-black/70 text-white"}
        `;
        const pillStyle = {
          width: isActive ? "auto" : "24px",
          transition: "width 1.2s ease-out",
        };

        // Matches bblunt.com: the ACTIVE (expanded) indicator is a link that
        // redirects to the slide's page, while INACTIVE indicators switch the
        // carousel to that slide.
        const canRedirect = isActive && Boolean(item.href) && item.href !== "#";

        const pillInner = (
          <>
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
                className={`relative h-[40px] md:h-[51px] border-2 md:border-[2.5px] border-black rounded-md overflow-hidden transition-[width] duration-[1200ms] ease-out ${isActive ? "w-[40px] md:w-[51px]" : "w-[20px]"}`}
              >
                {thumbUrl ? (
                  useVideoThumb ? (
                    // eslint-disable-next-line no-restricted-syntax
                    <video
                      src={thumbUrl}
                      className="object-cover w-full h-full rounded-sm"
                      muted
                      autoPlay
                      preload="none"
                    />
                  ) : (
                    <Image
                      src={thumbUrl}
                      alt={item.alt || `Slide ${index + 1}`}
                      fill
                      loading="lazy"
                      className="object-cover rounded-sm"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-black/40 rounded-sm" />
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
                  <div className="text-[8.75px] md:text-[15.3px] font-bold line-clamp-1">
                    {item.indicatorHeading}
                  </div>
                </div>

                {/* Arrow */}
                <div
                  data-testid={`banner-carousel-indicator-arrow-${index}`}
                  className="ml-2 w-[23px] flex justify-center items-center rounded-md bg-white/15"
                >
                  <Image
                    src="/icons/hero-carousel-right-arrow.svg"
                    alt="next arrow"
                    width={8}
                    height={5}
                    loading="lazy"
                    className="object-fill w-2 h-[5px]"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </>
        );

        // Active + has destination → redirect link (matches live site).
        if (canRedirect) {
          return (
            <Link
              key={index}
              href={item.href as string}
              target={item.target || "_self"}
              data-testid={`banner-carousel-indicator-${index}`}
              className={pillClassName}
              style={pillStyle}
              aria-label={`Go to ${item.indicatorHeading}`}
            >
              {pillInner}
            </Link>
          );
        }

        // Inactive (or no destination) → switch the carousel to this slide.
        return (
          <button
            key={index}
            type="button"
            data-testid={`banner-carousel-indicator-${index}`}
            onClick={() => onIndicatorClick(index)}
            className={pillClassName}
            style={pillStyle}
            aria-label={`Go to slide ${index + 1}: ${item.indicatorHeading}`}
          >
            {pillInner}
          </button>
        );
      })}
    </div>
  );
};
