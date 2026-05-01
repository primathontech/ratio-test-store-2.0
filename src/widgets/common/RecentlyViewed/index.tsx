"use client";

import React from "react";
import { RecentlyViewedProps } from "./types";
import { RecentlyViewedVariants } from "./variants";

/**
 * RecentlyViewed Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function RecentlyViewed({
  data,
  settings,
  className,
  locale,
}: RecentlyViewedProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    RecentlyViewedVariants[variant as keyof typeof RecentlyViewedVariants];

  if (!VariantComponent) {
    console.warn(
      `RecentlyViewed variant "${variant}" not found, using default`
    );
    const DefaultComponent = RecentlyViewedVariants.default;
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
