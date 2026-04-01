"use client";

import React from "react";
import { ProductTabsProps } from "./types";
import { ProductTabsVariants } from "./variants";

/**
 * ProductTabs Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function ProductTabs({
  data,
  settings,
  className,
  locale,
}: ProductTabsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductTabsVariants[variant as keyof typeof ProductTabsVariants];

  if (!VariantComponent) {
    console.warn(`ProductTabs variant "${variant}" not found, using default`);
    const DefaultComponent = ProductTabsVariants.default;
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
