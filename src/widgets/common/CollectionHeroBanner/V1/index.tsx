"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CollectionHeroBannerProps } from "../types";

/**
 * CollectionHeroBanner V1
 *
 * Full-width responsive hero banner for collection pages.
 * Uses a <picture>-like approach with two separate Next.js Image components:
 * - Desktop image (>=768px): ~3.2:1 aspect ratio (1300x406 natural)
 * - Mobile image (<768px): ~1.88:1 aspect ratio (360x191 natural)
 *
 * All text content (headline, CTA button) is baked into the banner images.
 * No HTML text overlays are needed.
 */
export const V1 = memo(function CollectionHeroBannerV1({
  settings,
  className,
}: CollectionHeroBannerProps) {
  const desktopImage =
    settings?.desktopImage || "/images/collections/shampoo-hero-desktop.jpg";
  const mobileImage =
    settings?.mobileImage || "/images/collections/shampoo-hero-mobile.jpg";
  const alt = settings?.alt || "Collection Hero Banner";
  const href = settings?.href;
  const desktopWidth = settings?.desktopWidth || 1300;
  const desktopHeight = settings?.desktopHeight || 406;
  const mobileWidth = settings?.mobileWidth || 360;
  const mobileHeight = settings?.mobileHeight || 191;

  const bannerContent = (
    <>
      {/* Desktop / Tablet image (>=768px) */}
      <Image
        src={desktopImage}
        alt={alt}
        width={desktopWidth}
        height={desktopHeight}
        priority
        className="hidden md:block w-full h-auto object-cover"
        sizes="100vw"
      />
      {/* Mobile image (<768px) */}
      <Image
        src={mobileImage}
        alt={alt}
        width={mobileWidth}
        height={mobileHeight}
        priority
        className="block md:hidden w-full h-auto object-cover"
        sizes="100vw"
      />
    </>
  );

  if (href) {
    return (
      <section className={`w-full overflow-hidden ${className || ""}`}>
        <Link href={href} className="block w-full">
          {bannerContent}
        </Link>
      </section>
    );
  }

  return (
    <section className={`w-full overflow-hidden ${className || ""}`}>
      {bannerContent}
    </section>
  );
});
