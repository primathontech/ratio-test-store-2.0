"use client";

import React from "react";
import { ProductCarouselVariants } from "./variants";
import { ProductCarouselProps } from "./types";

/**
 * ProductCarousel Widget
 *
 * Reusable featured-collection product carousel section.
 * White background with centered heading ("For <bold>X</bold>"),
 * horizontal product card carousel with prev/next arrow navigation,
 * and "View all N products" link at the bottom.
 *
 * Used by 11 different sections on the BBlunt homepage.
 */
export function ProductCarousel({
  data,
  settings,
  className,
  locale,
}: ProductCarouselProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductCarouselVariants[variant as keyof typeof ProductCarouselVariants];

  if (!VariantComponent) {
    console.warn(
      `ProductCarousel variant "${variant}" not found, using default`
    );
    const DefaultComponent = ProductCarouselVariants.default;
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
