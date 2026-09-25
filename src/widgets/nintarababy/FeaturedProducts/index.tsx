"use client";

import React from "react";
import { FeaturedProductsProps } from "./types";
import { FeaturedProductsVariants } from "./variants";

/**
 * FeaturedProducts Widget
 *
 * Product grid section cloned from nintarababy.in.
 * 4 product cards with ratings, prices, and Add to Cart buttons.
 */
export function FeaturedProducts({
  data,
  settings,
  className,
  locale,
}: FeaturedProductsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    FeaturedProductsVariants[variant as keyof typeof FeaturedProductsVariants];

  if (!VariantComponent) {
    console.warn(
      `FeaturedProducts variant "${variant}" not found, using default`
    );
    const DefaultComponent = FeaturedProductsVariants.default;
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
