import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IBannerCarouselItem } from "../types";

export interface ImageSlideProps {
  item: IBannerCarouselItem;
  index: number;
  desktopAspectRatio?: string | number;
  mobileAspectRatio?: string | number;
  isActive?: boolean;
  indicatorType?: "media" | "simple";
}

export const ImageSlide: React.FC<ImageSlideProps> = ({
  item,
  index,
  desktopAspectRatio = "155/57",
  mobileAspectRatio = "1/1",
  isActive = false,
  indicatorType = "media",
}) => {
  const { mobileSrc, desktopSrc, href, alt, target = "_self" } = item;

  // Apply scale effect only on mobile when indicatorType is "simple"
  const shouldApplyMobileScale = indicatorType === "simple";
  const mobileScaleClass = shouldApplyMobileScale
    ? `transition-transform duration-300 ease-in-out ${isActive ? "scale-100" : "scale-y-[82%]"}`
    : "";

  return (
    <Link
      data-testid={`banner-carousel-slide-${index}`}
      href={href}
      target={target}
      className="block relative w-full h-full"
    >
      {/* Mobile Image */}
      <div
        data-testid={`banner-carousel-mobile-image-${index}`}
        className={`w-full relative md:hidden ${mobileScaleClass}`}
        style={{ aspectRatio: mobileAspectRatio }}
      >
        <Image
          src={mobileSrc}
          alt={alt || `Banner ${index + 1}`}
          fill
          className="object-cover rounded-[4px]"
          priority={index === 0}
        />
      </div>

      {/* Desktop Image */}
      <div
        data-testid={`banner-carousel-desktop-image-${index}`}
        className="w-full relative hidden md:block"
        style={{ aspectRatio: desktopAspectRatio }}
      >
        <Image
          src={desktopSrc}
          alt={alt || `Banner ${index + 1}`}
          fill
          className="object-cover rounded-lg"
          priority={index === 0}
        />
      </div>
    </Link>
  );
};
