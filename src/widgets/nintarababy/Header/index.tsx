"use client";

import React from "react";
import { NintaraHeaderProps } from "./types";
import { NintaraHeaderVariants } from "./variants";

/**
 * NintaraHeader Widget
 *
 * Sticky header with two rows cloned from nintarababy.in.
 * Desktop: search + logo + icons (row 1), navigation bar (row 2).
 * Mobile: hamburger + search + logo + cart with slide-in drawer.
 */
export function Header({
  data,
  settings,
  className,
  locale,
}: NintaraHeaderProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    NintaraHeaderVariants[variant as keyof typeof NintaraHeaderVariants];

  if (!VariantComponent) {
    console.warn(`NintaraHeader variant "${variant}" not found, using default`);
    const DefaultComponent = NintaraHeaderVariants.default;
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
