"use client";

import React from "react";
import { CollectionGridProps } from "./types";
import { CollectionGridVariants } from "./variants";

/**
 * CollectionGrid Widget
 *
 * Collection page product grid with filter sidebar, sort toolbar, and pagination.
 */
export function CollectionGrid({
  data,
  settings,
  className,
  locale,
}: CollectionGridProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CollectionGridVariants[variant as keyof typeof CollectionGridVariants];

  if (!VariantComponent) {
    console.warn(
      `CollectionGrid variant "${variant}" not found, using default`
    );
    const DefaultComponent = CollectionGridVariants.default;
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
