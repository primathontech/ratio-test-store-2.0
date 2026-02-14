"use client";

import React from "react";
import { HeaderVariants } from "./variants";
import { HeaderProps } from "./types";

/**
 * Main Header Component
 * Renders the appropriate variant based on settings
 */
// Default settings
const defaultSettings = {
  variant: "v1",
  isFixed: false,
  height: 70,
  logoWidth: 140,
  showCartIcon: true,
  showLanguageSwitcher: false,
};

export function Header({
  data,
  settings = defaultSettings,
  className,
  locale,
}: HeaderProps) {
  const variant = settings.variant || "v1";
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
