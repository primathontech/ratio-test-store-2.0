"use client";

import React from "react";
import { RichTextProps } from "./types";
import { RichTextVariants } from "./variants";

/**
 * RichText Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function RichText({ data, settings, className, locale }: RichTextProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    RichTextVariants[variant as keyof typeof RichTextVariants];

  if (!VariantComponent) {
    console.warn(`RichText variant "${variant}" not found, using default`);
    const DefaultComponent = RichTextVariants.default;
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
