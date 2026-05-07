import React from "react";
import { FeaturedCollectionGridVariants } from "./variants";
import { FeaturedCollectionGridProps } from "./types";

/**
 * FeaturedCollectionGrid Widget
 *
 * Reusable product grid with a category title banner and 4-column (desktop)
 * / 2-column (mobile) product card grid. Fetches live data via
 * DATA_SOURCE_TYPES.COLLECTION.
 */
export function FeaturedCollectionGrid({
  data,
  settings,
  className,
  locale,
}: FeaturedCollectionGridProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    FeaturedCollectionGridVariants[
      variant as keyof typeof FeaturedCollectionGridVariants
    ];

  if (!VariantComponent) {
    console.warn(
      `FeaturedCollectionGrid variant "${variant}" not found, using default`
    );
    const DefaultComponent = FeaturedCollectionGridVariants.default;
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
