"use client";

import React from "react";
import { FeaturedCollectionCarouselVariants } from "./variants";
import { FeaturedCollectionCarouselProps } from "./types";

/**
 * FeaturedCollectionCarousel Widget
 *
 * Reusable featured-collection product carousel section.
 * White background with centered heading ("For <bold>X</bold>"),
 * horizontal product card carousel with prev/next arrow navigation,
 * and "View all N products" link at the bottom.
 *
 * Fetches live data via DATA_SOURCE_TYPES.COLLECTION.
 */
export function FeaturedCollectionCarousel({
  data,
  settings,
  className,
  locale,
}: FeaturedCollectionCarouselProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    FeaturedCollectionCarouselVariants[
      variant as keyof typeof FeaturedCollectionCarouselVariants
    ];

  if (!VariantComponent) {
    console.warn(
      `FeaturedCollectionCarousel variant "${variant}" not found, using default`
    );
    const DefaultComponent = FeaturedCollectionCarouselVariants.default;
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
