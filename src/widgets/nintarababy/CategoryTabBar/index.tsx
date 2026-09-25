"use client";

import React from "react";
import { CategoryTabBarProps } from "./types";
import { CategoryTabBarVariants } from "./variants";

/**
 * CategoryTabBar Widget
 *
 * Horizontal pill strip for collection category navigation.
 * Desktop: centered row of 6 pills, gap 10px, 16px/500 Figtree.
 * Mobile: left-aligned, horizontal scroll, hidden scrollbar, 14px font.
 * Active pill: 2px gold border + black text (determined by activeHandle).
 * Pills are <a> tags — full page navigation to collection URLs.
 */
export function CategoryTabBar({
  data,
  settings,
  className,
  locale,
}: CategoryTabBarProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CategoryTabBarVariants[variant as keyof typeof CategoryTabBarVariants];

  if (!VariantComponent) {
    const DefaultComponent = CategoryTabBarVariants.default;
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
