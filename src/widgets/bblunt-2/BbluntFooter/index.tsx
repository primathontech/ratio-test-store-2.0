"use client";

import React from "react";
import { FooterProps } from "./types";
import { FooterVariants } from "./variants";

/**
 * BbluntFooter Widget
 *
 * bblunt-2's own copy of the Footer widget. Forked from common/Footer so
 * core-branch changes to common/Footer never produce merge conflicts here.
 * Renders the appropriate variant based on settings.
 */
export function BbluntFooter({
  data,
  settings,
  className,
  locale,
}: FooterProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    FooterVariants[variant as keyof typeof FooterVariants];

  if (!VariantComponent) {
    console.warn(`Footer variant "${variant}" not found, using default`);
    const DefaultComponent = FooterVariants.default;
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
