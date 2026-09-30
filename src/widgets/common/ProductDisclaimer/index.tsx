"use client";

import React from "react";
import { ProductDisclaimerProps } from "./types";
import { ProductDisclaimerVariants } from "./variants";

/**
 * ProductDisclaimer Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function ProductDisclaimer({
  data,
  settings,
  className,
  locale,
}: ProductDisclaimerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductDisclaimerVariants[
      variant as keyof typeof ProductDisclaimerVariants
    ];

  if (!VariantComponent) {
    console.warn(
      `ProductDisclaimer variant "${variant}" not found, using default`
    );
    const DefaultComponent = ProductDisclaimerVariants.default;
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
