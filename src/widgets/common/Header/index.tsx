"use client";

import React from "react";
import { HeaderProps } from "./types";
import { HeaderVariants } from "./variants";

/**
 * Header Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function Header({ data, settings, className, locale }: HeaderProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    HeaderVariants[variant as keyof typeof HeaderVariants];

  if (!VariantComponent) {
    console.warn(`Header variant "${variant}" not found, using default`);
    const DefaultComponent = HeaderVariants.default;
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
