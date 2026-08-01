"use client";

import React from "react";
import { CollectionBannerProps } from "./types";
import { CollectionBannerVariants } from "./variants";

/**
 * CollectionBanner Widget
 *
 * Full-width responsive banner image for collection pages.
 * Desktop: wide landscape banner (1600x349px).
 * Mobile: cropped portrait banner with 3:2 aspect ratio.
 * Category labels (Sleep, Feeding, Bath) are painted into the images.
 */
export function CollectionBanner({
  data,
  settings,
  className,
  locale,
}: CollectionBannerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CollectionBannerVariants[variant as keyof typeof CollectionBannerVariants];

  if (!VariantComponent) {
    const DefaultComponent = CollectionBannerVariants.default;
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
