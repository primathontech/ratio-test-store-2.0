"use client";

import React, { memo } from "react";
import Image from "next/image";
import { HowItWorksBannerProps } from "../types";

/**
 * HowItWorksBanner V1
 *
 * Pure image-based "How To Shop" instruction banner.
 * Renders two responsive images within a max-width container:
 * - Desktop (>=768px): 5692x692 natural, rendered at ~1300x158
 * - Mobile (<768px): 1500x1167 natural, steps stacked vertically
 *
 * Section spacing: 56px top margin, 22px bottom padding.
 * Container: centered, max-width 1300px.
 */
export const V1 = memo(function HowItWorksBannerV1({
  settings,
  className,
}: HowItWorksBannerProps) {
  const desktopImage =
    settings?.desktopImage || "/HowItWorksBanner/images/howtoshop-desktop.jpg";
  const mobileImage =
    settings?.mobileImage || "/HowItWorksBanner/images/howtoshop-mobile.jpg";
  const alt =
    settings?.alt ||
    "How To Shop: 1. Add favorites worth 499 to cart, 2. Apply code FREEHF at checkout, 3. Free products delivered with your order";
  const desktopWidth = settings?.desktopWidth || 5692;
  const desktopHeight = settings?.desktopHeight || 692;
  const mobileWidth = settings?.mobileWidth || 1500;
  const mobileHeight = settings?.mobileHeight || 1167;
  const containerMaxWidth = settings?.containerMaxWidth || 1300;
  const marginTop = settings?.marginTop ?? 56;
  const paddingBottom = settings?.paddingBottom ?? 22;

  return (
    <section
      className={`w-full ${className || ""}`}
      style={{
        marginTop: `${marginTop}px`,
        paddingBottom: `${paddingBottom}px`,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: `${containerMaxWidth}px` }}>
        {/* Desktop / Tablet image (>=768px) */}
        <Image
          src={desktopImage}
          alt={alt}
          width={desktopWidth}
          height={desktopHeight}
          loading="lazy"
          className="hidden md:block w-full h-auto"
          sizes={`(min-width: 1150px) ${containerMaxWidth}px, calc(100vw - 30px)`}
        />
        {/* Mobile image (<768px) */}
        <Image
          src={mobileImage}
          alt={alt}
          width={mobileWidth}
          height={mobileHeight}
          loading="lazy"
          className="block md:hidden w-full h-auto"
          sizes="100vw"
        />
      </div>
    </section>
  );
});
