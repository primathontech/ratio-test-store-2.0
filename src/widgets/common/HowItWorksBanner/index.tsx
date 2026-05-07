"use client";

import React from "react";
import { HowItWorksBannerVariants } from "./variants";
import { HowItWorksBannerProps } from "./types";

/**
 * HowItWorksBanner Widget
 *
 * Image-based "How To Shop" instruction banner showing 3 steps.
 * Uses two images for responsive art direction:
 * - Desktop/tablet (>=768px): horizontal layout with steps side-by-side
 * - Mobile (<768px): vertical layout with steps stacked
 *
 * All content (heading, step numbers, text, T&C bar) is baked into images.
 */
export function HowItWorksBanner({
  data,
  settings,
  className,
  locale,
}: HowItWorksBannerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    HowItWorksBannerVariants[variant as keyof typeof HowItWorksBannerVariants];

  if (!VariantComponent) {
    console.warn(
      `HowItWorksBanner variant "${variant}" not found, using default`
    );
    const DefaultComponent = HowItWorksBannerVariants.default;
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
