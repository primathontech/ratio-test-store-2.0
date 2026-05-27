"use client";

import React from "react";
import { ProductFAQProps } from "./types";
import { ProductFAQVariants } from "./variants";

/**
 * ProductFAQ Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function ProductFAQ({
  data,
  settings,
  className,
  locale,
}: ProductFAQProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductFAQVariants[variant as keyof typeof ProductFAQVariants];

  if (!VariantComponent) {
    console.warn(`ProductFAQ variant "${variant}" not found, using default`);
    const DefaultComponent = ProductFAQVariants.default;
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
