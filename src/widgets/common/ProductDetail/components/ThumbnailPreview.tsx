"use client";

import Image from "next/image";
import { forwardRef } from "react";

import { ProductImage } from "../types";
import { isVideo } from "../utils/galleryHelpers";

export interface ThumbnailPreviewProps {
  image: ProductImage;
  isActive: boolean;
  onClick: () => void;
  size?: number | string;
  radius?: number;
  activeBorderColor?: string;
  activeBorderWidth?: number;
  className?: string;
  /**
   * False until `useProgressiveImageLoading` decides this slot is up next.
   * When false + `showLoadingPlaceholder` is true, an animate-pulse skeleton
   * is rendered in place of the thumbnail.
   */
  isVisible?: boolean;
  showLoadingPlaceholder?: boolean;
}

/**
 * Single clickable thumbnail in the desktop strip. Renders the video poster
 * (`thumbnail_url`) when the entry is a VIDEO so we never feed an `.mp4` to
 * `next/image`.
 *
 * Reveal animation: when `isVisible` flips true, the button plays a 300ms
 * spin-in (rotate from −45° to 0° while fading in). Until then a same-sized
 * gray pulsing placeholder takes its place.
 */
export const ThumbnailPreview = forwardRef<
  HTMLButtonElement,
  ThumbnailPreviewProps
>(function ThumbnailPreview(
  {
    image,
    isActive,
    onClick,
    size = 80,
    radius = 4,
    activeBorderColor = "#000000",
    activeBorderWidth = 4,
    className = "",
    isVisible = true,
    showLoadingPlaceholder = false,
  },
  ref
) {
  const imageSrc = !isVideo(image) ? image?.url : image?.thumbnail_url || "";
  if (!imageSrc) {
    return null;
  }

  // Pre-reveal placeholder — same footprint as the real thumbnail so the
  // strip doesn't shift when each slot pops in.
  if (!isVisible && showLoadingPlaceholder) {
    return (
      <div
        className={`relative overflow-hidden flex-shrink-0 animate-pulse bg-gray-200 ${className}`}
        style={{
          width: typeof size === "number" ? `${size}px` : size,
          aspectRatio: "1/1",
          borderRadius: `${radius}px`,
          border: `${activeBorderWidth}px solid transparent`,
        }}
      />
    );
  }

  if (!isVisible) {
    return null;
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`thumbnail-preview-spin relative overflow-hidden hover:opacity-80 flex-shrink-0 focus:outline-none ${className}`}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        aspectRatio: "1/1",
        borderRadius: `${radius}px`,
        border: isActive
          ? `${activeBorderWidth}px solid ${activeBorderColor}`
          : `0px solid transparent`,
        transition: "opacity 0.3s ease-in-out, transform 1s ease-out",
        animation: "thumbnail-spin-in 0.3s ease-out reverse",
      }}
      aria-label={`View ${image.altText || "product image"}`}
      aria-current={isActive ? "true" : "false"}
    >
      <Image
        src={imageSrc}
        alt={image.altText || "Product thumbnail"}
        fill
        className="object-cover"
        sizes={typeof size === "number" ? `${size}px` : size}
        loading="lazy"
        quality={75}
      />
      {/* Keyframes are scoped to the button via a CSS-class match on the
          parent so the rule only declares once per render — adjacent
          thumbnails share the same animation. */}
      <style>{`
        @keyframes thumbnail-spin-in {
          from { transform: rotate(-45deg); opacity: 0; }
          to   { transform: rotate(0deg);   opacity: 1; }
        }
      `}</style>
    </button>
  );
});
