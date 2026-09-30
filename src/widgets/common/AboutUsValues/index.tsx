"use client";

import React from "react";
import { AboutUsValuesProps } from "./types";
import { AboutUsValuesVariants } from "./variants";

/**
 * AboutUsValues Widget
 *
 * Two-column icon grid displaying brand values.
 * Each item has an SVG icon, bold heading, and description text.
 * Used on the About Us page below the story section.
 */
export function AboutUsValues({
  data,
  settings,
  className,
  locale,
}: AboutUsValuesProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    AboutUsValuesVariants[variant as keyof typeof AboutUsValuesVariants];

  if (!VariantComponent) {
    console.warn(`AboutUsValues variant "${variant}" not found, using default`);
    const DefaultComponent = AboutUsValuesVariants.default;
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
