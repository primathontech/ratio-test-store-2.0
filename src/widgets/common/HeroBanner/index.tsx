"use client";

import React from "react";
import { HeroBannerVariants } from "./variants";
import { HeroBannerProps } from "./types";

/**
 * HeroBanner Widget
 *
 * Full-width responsive hero banner with separate desktop and mobile images.
 * All text/CTAs are baked into the banner images (no HTML overlay).
 * Renders the appropriate variant based on settings.
 */
export function HeroBanner({
  data,
  settings,
  className,
  locale,
}: HeroBannerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    HeroBannerVariants[variant as keyof typeof HeroBannerVariants];

  if (!VariantComponent) {
    console.warn(`HeroBanner variant "${variant}" not found, using default`);
    const DefaultComponent = HeroBannerVariants.default;
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
