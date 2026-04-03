"use client";

import React from "react";
import { ShineAcademyBannerProps } from "./types";
import { ShineAcademyBannerVariants } from "./variants";

/**
 * ShineAcademyBanner Widget
 *
 * BBlunt Shine Academy brand story section with logo, tagline,
 * and a mosaic photo collage. Fade-in on scroll animation.
 */
export function ShineAcademyBanner({
  data,
  settings,
  className,
  locale,
}: ShineAcademyBannerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ShineAcademyBannerVariants[
      variant as keyof typeof ShineAcademyBannerVariants
    ];

  if (!VariantComponent) {
    console.warn(
      `ShineAcademyBanner variant "${variant}" not found, using default`
    );
    const DefaultComponent = ShineAcademyBannerVariants.default;
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
