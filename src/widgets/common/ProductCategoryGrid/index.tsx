"use client";

import React from "react";
import { ProductCategoryGridVariants } from "./variants";
import { ProductCategoryGridProps } from "./types";

/**
 * ProductCategoryGrid Widget
 *
 * Reusable product grid with a category title banner and 4-column (desktop)
 * / 2-column (mobile) product card grid. Used across 12 category sections
 * on the Shine Squad Weekly Offer page.
 */
export function ProductCategoryGrid({
  data,
  settings,
  className,
  locale,
}: ProductCategoryGridProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductCategoryGridVariants[
      variant as keyof typeof ProductCategoryGridVariants
    ];

  if (!VariantComponent) {
    console.warn(
      `ProductCategoryGrid variant "${variant}" not found, using default`
    );
    const DefaultComponent = ProductCategoryGridVariants.default;
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
