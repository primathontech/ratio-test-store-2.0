"use client";

import React from "react";
import { LazyLoadShimmerProps } from "./types";
import { LazyLoadShimmerVariants } from "./variants";

/**
 * LazyLoadShimmer Widget
 *
 * Mirrors the bblunt.com "lazyload-shimmer--home" placeholder shown
 * after the eagerly-rendered carousels. Renders a 4-block skeleton
 * (products, reels, newsletter, testimonials) and self-hides via
 * IntersectionObserver so the real sections rendered below take over
 * once the user scrolls near it.
 */
export function LazyLoadShimmer({
  data,
  settings,
  className,
  locale,
}: LazyLoadShimmerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    LazyLoadShimmerVariants[variant as keyof typeof LazyLoadShimmerVariants];

  if (!VariantComponent) {
    console.warn(
      `LazyLoadShimmer variant "${variant}" not found, using default`
    );
    const DefaultComponent = LazyLoadShimmerVariants.default;
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
