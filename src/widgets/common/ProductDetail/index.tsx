"use client";

import React from "react";
import { ProductDetailProps } from "./types";
import { ProductDetailVariants } from "./variants";

/**
 * ProductDetail Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function ProductDetail({
  data,
  settings,
  className,
  locale,
}: ProductDetailProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductDetailVariants[variant as keyof typeof ProductDetailVariants];

  if (!VariantComponent) {
    console.warn(`ProductDetail variant "${variant}" not found, using default`);
    const DefaultComponent = ProductDetailVariants.default;
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
