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
  const mobileAspectRatio = settings?.mobileAspectRatio || "1500 / 1167";
  const desktopAspectRatio = settings?.desktopAspectRatio || "5692 / 692";

  const toCssRatio = (ratio: string) => ratio.replace("/", " / ");
  const desktopStyle: React.CSSProperties = {
    aspectRatio: toCssRatio(desktopAspectRatio),
    height: "auto",
  };
  const mobileStyle: React.CSSProperties = {
    aspectRatio: toCssRatio(mobileAspectRatio),
    height: "auto",
  };

  return (
    <section
      className={`w-full mx-auto md:max-w-[1360px] lg:max-w-[1400px] ${className || ""}`}
    >
      <div className="px-4 md:px-7 xl2:px-12">
        {/* Desktop / Tablet image (>=768px) — sized via CSS aspect-ratio. */}
        <Image
          src={desktopImage}
          alt={alt}
          width={5692}
          height={692}
          loading="lazy"
          className="hidden md:block w-full"
          sizes="(min-width: 1150px) 1300px, calc(100vw - 30px)"
          style={desktopStyle}
        />
        {/* Mobile image (<768px) */}
        <Image
          src={mobileImage}
          alt={alt}
          width={1500}
          height={1167}
          loading="lazy"
          className="block md:hidden w-full"
          sizes="100vw"
          style={mobileStyle}
        />
      </div>
    </section>
  );
});
