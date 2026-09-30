"use client";

import React from "react";
import { StickyAddToCartProps } from "./types";
import { StickyAddToCartVariants } from "./variants";

/**
 * StickyAddToCart Widget
 *
 * Fixed bottom bar showing product thumbnail, name, price and Add to Cart button.
 * On mobile: simplified layout with "Add to cart - ₹399" button + cart icon.
 * On desktop: full layout with thumbnail, title, price, quantity, and ATC button.
 */
export function StickyAddToCart({
  data,
  settings,
  className,
  locale,
}: StickyAddToCartProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    StickyAddToCartVariants[variant as keyof typeof StickyAddToCartVariants];

  if (!VariantComponent) {
    console.warn(
      `StickyAddToCart variant "${variant}" not found, using default`
    );
    const DefaultComponent = StickyAddToCartVariants.default;
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
