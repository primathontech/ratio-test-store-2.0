"use client";

import React from "react";
import { ShopByConcernsVariants } from "./variants";
import { ShopByConcernsProps } from "./types";

/**
 * ShopByConcerns Widget
 *
 * Horizontal carousel of image tiles linking to concern-based collections.
 * Desktop: 5 visible, tablet-1024: 4, tablet-768: 3, mobile-360: 2 + peek.
 */
export function ShopByConcerns({
  data,
  settings,
  className,
  locale,
}: ShopByConcernsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ShopByConcernsVariants[variant as keyof typeof ShopByConcernsVariants];

  if (!VariantComponent) {
    console.warn(
      `ShopByConcerns variant "${variant}" not found, using default`
    );
    const DefaultComponent = ShopByConcernsVariants.default;
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
