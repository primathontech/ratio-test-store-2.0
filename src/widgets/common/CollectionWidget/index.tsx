"use client";

import React from "react";
import { CollectionWidgetProps } from "./types";
import { CollectionWidgetVariants } from "./variants";

/**
 * CollectionWidget Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function CollectionWidget({
  data,
  settings,
  className,
  locale,
}: CollectionWidgetProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CollectionWidgetVariants[variant as keyof typeof CollectionWidgetVariants];

  if (!VariantComponent) {
    console.warn(`CollectionWidget variant "${variant}" not found, using default`);
    const DefaultComponent = CollectionWidgetVariants.default;
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
