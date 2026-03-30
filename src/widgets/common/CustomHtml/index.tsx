"use client";

import React from "react";
import { CustomHtmlProps } from "./types";
import { CustomHtmlVariants } from "./variants";

/**
 * CustomHtml Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function CustomHtml({
  data,
  settings,
  className,
  locale,
}: CustomHtmlProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CustomHtmlVariants[variant as keyof typeof CustomHtmlVariants];

  if (!VariantComponent) {
    console.warn(`CustomHtml variant "${variant}" not found, using default`);
    const DefaultComponent = CustomHtmlVariants.default;
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
