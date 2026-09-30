"use client";

import React from "react";
import { CollectionHeadingVariants } from "./variants";
import { CollectionHeadingProps } from "./types";

/**
 * CollectionHeading Widget
 *
 * Displays the collection title (e.g. "Shampoo") with a bottom border divider.
 * Left-aligned on mobile/tablet, centered on desktop.
 * Renders the appropriate variant based on settings.
 */
export function CollectionHeading({
  data,
  settings,
  className,
  locale,
}: CollectionHeadingProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CollectionHeadingVariants[
      variant as keyof typeof CollectionHeadingVariants
    ];

  if (!VariantComponent) {
    console.warn(
      `CollectionHeading variant "${variant}" not found, using default`
    );
    const DefaultComponent = CollectionHeadingVariants.default;
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
