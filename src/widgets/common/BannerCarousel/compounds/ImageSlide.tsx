import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IBannerCarouselItem } from "../types";

export interface ImageSlideProps {
  item: IBannerCarouselItem;
  index: number;
  desktopAspectRatio?: string | number;
  mobileAspectRatio?: string | number;
  isActive?: boolean;
  indicatorType?: "media" | "simple";
  applyRounded?: boolean;
}

export const ImageSlide: React.FC<ImageSlideProps> = ({
  item,
  index,
  desktopAspectRatio = "182/57",
  isActive = false,
  indicatorType = "media",
  applyRounded = true,
}) => {
  const { mobileSrc, desktopSrc, href, alt, target = "_self" } = item;
  // Apply scale effect only on mobile when indicatorType is "simple"
  const shouldApplyMobileScale = indicatorType === "simple";
  const mobileScaleClass = shouldApplyMobileScale
    ? `transition-transform duration-300 ease-in-out ${isActive ? "scale-100" : "scale-y-[82%]"}`
    : "";

  const content = (
    <>
      {/* Mobile Image */}
      <div
        data-testid={`banner-carousel-mobile-image-${index}`}
        className={`w-full md:hidden ${mobileScaleClass}`}
      >
        <Image
          src={mobileSrc}
          alt={alt || `Banner ${index + 1}`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
          priority={index === 0}
          loading={index >= 1 ? "lazy" : undefined}
        />
      </div>

      {/* Desktop Image */}
      <div
        data-testid={`banner-carousel-desktop-image-${index}`}
        className={`w-full relative hidden md:block overflow-hidden ${applyRounded ? "rounded-none lg:rounded-[10px]" : ""}`}
        style={{ aspectRatio: desktopAspectRatio }}
      >
        <Image
          src={desktopSrc}
          alt={alt || `Banner ${index + 1}`}
          fill
          className="object-cover !h-auto"
          priority={index === 0}
          loading={index >= 1 ? "lazy" : undefined}
        />
      </div>
    </>
  );

  if (!href || href === "#") {
    return (
      <div
        data-testid={`banner-carousel-slide-${index}`}
        className="block relative w-full h-full"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      data-testid={`banner-carousel-slide-${index}`}
      href={href}
      target={target}
      className="block relative w-full h-full"
    >
      {content}
    </Link>
  );
};
