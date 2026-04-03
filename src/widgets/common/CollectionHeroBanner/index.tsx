"use client";

import React from "react";
import { CollectionHeroBannerVariants } from "./variants";
import { CollectionHeroBannerProps } from "./types";

/**
 * CollectionHeroBanner Widget
 *
 * Full-width responsive hero banner for collection pages.
 * Renders the appropriate variant based on settings.
 */
export function CollectionHeroBanner({
  data,
  settings,
  className,
  locale,
}: CollectionHeroBannerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CollectionHeroBannerVariants[
      variant as keyof typeof CollectionHeroBannerVariants
    ];

  if (!VariantComponent) {
    console.warn(
      `CollectionHeroBanner variant "${variant}" not found, using default`
    );
    const DefaultComponent = CollectionHeroBannerVariants.default;
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
