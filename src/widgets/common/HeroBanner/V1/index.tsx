"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroBannerProps } from "../types";

/**
 * HeroBanner V1
 *
 * Full-width responsive hero banner for promotional/landing pages.
 * Uses two separate Next.js Image components for responsive art direction:
 * - Desktop image (>=768px): ~2.72:1 aspect ratio (1440x529 natural)
 * - Mobile image (<768px): 1:1 aspect ratio (1200x1200 natural)
 *
 * All text content (headline, promo code, CTA button) is baked into the
 * banner images. No HTML text overlays are rendered.
 */
export const V1 = memo(function HeroBannerV1({
  settings,
  className,
}: HeroBannerProps) {
  const desktopImage =
    settings?.desktopImage || "/HeroBanner/images/hero-desktop.jpg";
  const mobileImage =
    settings?.mobileImage || "/HeroBanner/images/hero-mobile.jpg";
  const alt = settings?.alt || "Promotional Hero Banner";
  const href = settings?.href;
  const desktopWidth = settings?.desktopWidth || 1440;
  const desktopHeight = settings?.desktopHeight || 529;
  const mobileWidth = settings?.mobileWidth || 1200;
  const mobileHeight = settings?.mobileHeight || 1200;
  const paddingBottom = settings?.paddingBottom ?? 7;

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

  const sectionStyle = paddingBottom
    ? { paddingBottom: `${paddingBottom}px` }
    : undefined;

  if (href) {
    return (
      <section
        className={`w-full overflow-hidden ${className || ""}`}
        style={sectionStyle}
      >
        <Link href={href} className="block w-full">
          {bannerContent}
        </Link>
      </section>
    );
  }

  return (
    <section
      className={`w-full overflow-hidden ${className || ""}`}
      style={sectionStyle}
    >
      {bannerContent}
    </section>
  );
});
