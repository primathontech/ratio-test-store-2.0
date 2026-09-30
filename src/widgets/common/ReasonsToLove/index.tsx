"use client";

import React from "react";
import { ReasonsToLoveProps } from "./types";
import { ReasonsToLoveVariants } from "./variants";

/**
 * ReasonsToLove Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function ReasonsToLove({
  data,
  settings,
  className,
  locale,
}: ReasonsToLoveProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ReasonsToLoveVariants[variant as keyof typeof ReasonsToLoveVariants];

  if (!VariantComponent) {
    console.warn(`ReasonsToLove variant "${variant}" not found, using default`);
    const DefaultComponent = ReasonsToLoveVariants.default;
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
