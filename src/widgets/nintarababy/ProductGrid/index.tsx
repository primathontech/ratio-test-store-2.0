"use client";

import React from "react";
import { ProductGridProps } from "./types";
import { ProductGridVariants } from "./variants";

/**
 * ProductGrid Widget
 *
 * Collection page product grid cloned from nintarababy.in.
 * 4-column desktop, 2-column mobile product card grid with
 * image hover swap, star ratings, prices, badges, and ATC buttons.
 */
export function ProductGrid({
  data,
  settings,
  className,
  locale,
}: ProductGridProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductGridVariants[variant as keyof typeof ProductGridVariants];

  if (!VariantComponent) {
    const DefaultComponent = ProductGridVariants.default;
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
