"use client";

import React from "react";
import { ProductGalleryProps } from "./types";
import { ProductGalleryVariants } from "./variants";

/**
 * ProductGallery Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function ProductGallery({
  data,
  settings,
  className,
  locale,
}: ProductGalleryProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductGalleryVariants[variant as keyof typeof ProductGalleryVariants];

  if (!VariantComponent) {
    console.warn(`ProductGallery variant "${variant}" not found, using default`);
    const DefaultComponent = ProductGalleryVariants.default;
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
