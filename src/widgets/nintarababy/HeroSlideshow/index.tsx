"use client";

import React from "react";
import { HeroSlideshowProps } from "./types";
import { HeroSlideshowVariants } from "./variants";

/**
 * HeroSlideshow Widget
 *
 * Full-width auto-playing image slideshow cloned from nintarababy.in.
 * Uses CSS scroll-snap for native smooth transitions with infinite loop.
 * 4 slides with dot indicators showing progress animation.
 */
export function HeroSlideshow({
  data,
  settings,
  className,
  locale,
}: HeroSlideshowProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    HeroSlideshowVariants[variant as keyof typeof HeroSlideshowVariants];

  if (!VariantComponent) {
    console.warn(`HeroSlideshow variant "${variant}" not found, using default`);
    const DefaultComponent = HeroSlideshowVariants.default;
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
