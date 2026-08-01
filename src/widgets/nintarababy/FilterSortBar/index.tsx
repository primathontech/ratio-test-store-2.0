"use client";

import React from "react";
import { FilterSortBarProps } from "./types";
import { FilterSortBarVariants } from "./variants";

/**
 * FilterSortBar Widget
 *
 * Toolbar with Filter button (left) and Sort By dropdown (right).
 * Desktop: 1px solid #01464f borders on both buttons, 4px radius, 140px min-width.
 * Mobile: no borders, full-width flex, sort dropdown = bottom sheet from bottom.
 * Filter button shows funnel SVG icon + "Filter" text.
 * Sort button shows "Sort By" text + chevron SVG that rotates 180deg when open.
 * Sort dropdown: desktop = 250px positioned dropdown; mobile = full-width bottom sheet.
 */
export function FilterSortBar({
  data,
  settings,
  className,
  locale,
}: FilterSortBarProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    FilterSortBarVariants[variant as keyof typeof FilterSortBarVariants];

  if (!VariantComponent) {
    const DefaultComponent = FilterSortBarVariants.default;
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
