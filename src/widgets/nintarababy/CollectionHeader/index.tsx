"use client";

import React from "react";
import { CollectionHeaderProps } from "./types";
import { CollectionHeaderVariants } from "./variants";

/**
 * CollectionHeader Widget
 *
 * Breadcrumb navigation + H1 heading + subtitle for collection pages.
 * Desktop: 37px/600 heading, 1200px container, 20px vertical padding.
 * Mobile: 18px/600 heading, 15px vertical padding.
 * Breadcrumb with SVG chevron separator, hover opacity 0.8 transition.
 */
export function CollectionHeader({
  data,
  settings,
  className,
  locale,
}: CollectionHeaderProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CollectionHeaderVariants[variant as keyof typeof CollectionHeaderVariants];

  if (!VariantComponent) {
    const DefaultComponent = CollectionHeaderVariants.default;
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
