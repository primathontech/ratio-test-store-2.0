"use client";

import React from "react";
import { ProductInfoProps } from "./types";
import { ProductInfoVariants } from "./variants";

/**
 * ProductInfo Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function ProductInfo({
  data,
  settings,
  className,
  locale,
}: ProductInfoProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductInfoVariants[variant as keyof typeof ProductInfoVariants];

  if (!VariantComponent) {
    console.warn(`ProductInfo variant "${variant}" not found, using default`);
    const DefaultComponent = ProductInfoVariants.default;
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
