"use client";

import React from "react";
import { HeroBannerCarouselVariants } from "./variants";
import { HeroBannerCarouselProps } from "./types";

/**
 * HeroBannerCarousel Widget
 *
 * Full-width hero image/video carousel with prev/next arrow navigation
 * and dot indicators. Supports image slides and video slides with
 * separate desktop/mobile sources.
 */
export function HeroBannerCarousel({
  data,
  settings,
  className,
  locale,
}: HeroBannerCarouselProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    HeroBannerCarouselVariants[
      variant as keyof typeof HeroBannerCarouselVariants
    ];

  if (!VariantComponent) {
    console.warn(
      `HeroBannerCarousel variant "${variant}" not found, using default`
    );
    const DefaultComponent = HeroBannerCarouselVariants.default;
    return (
      <DefaultComponent
        data={data}
        settings={settings}
        className={className}
        locale={locale}
      />
    );
  }

  return (
    <VariantComponent
      data={data}
      settings={settings}
      className={className}
      locale={locale}
    />
  );
}
