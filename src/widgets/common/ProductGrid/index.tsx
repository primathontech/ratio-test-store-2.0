"use client";

import React from "react";
import { ProductGridVariants } from "./variants";
import { ProductGridProps } from "./types";

/**
 * Main ProductGrid Component
 * Renders the appropriate variant based on settings
 */
// Default settings
const defaultSettings = {
  variant: "v1",
  heading: "Best seller",
  viewAllButtonText: "View all",
  redirectionLink: "/collections/bestseller",
  actionButtonText: "Add to cart",
  soldOutText: "Sold Out",
};

export function ProductGrid({
  data,
  settings = defaultSettings,
  className,
  locale,
}: ProductGridProps) {
  const variant = settings.variant || "v1";
  const VariantComponent =
    ProductGridVariants[variant as keyof typeof ProductGridVariants];

  if (!VariantComponent) {
    console.warn(`ProductGrid variant "${variant}" not found, using default`);
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
