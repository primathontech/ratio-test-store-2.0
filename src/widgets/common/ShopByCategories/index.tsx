"use client";

import React from "react";
import { ShopByCategoriesVariants } from "./variants";
import { ShopByCategoriesProps } from "./types";

/**
 * ShopByCategories Widget
 *
 * Horizontal row of category tiles linking to collection pages.
 * Desktop (>=992px): 5 tiles visible, labels hidden, nav buttons hidden.
 * Mobile (<992px): 4.25 tiles visible with horizontal scroll, labels visible below images.
 */
export function ShopByCategories({
  data,
  settings,
  className,
  locale,
}: ShopByCategoriesProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ShopByCategoriesVariants[variant as keyof typeof ShopByCategoriesVariants];

  if (!VariantComponent) {
    console.warn(
      `ShopByCategories variant "${variant}" not found, using default`
    );
    const DefaultComponent = ShopByCategoriesVariants.default;
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
