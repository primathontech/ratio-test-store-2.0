"use client";

import React from "react";
import { PageContentProps } from "./types";
import { PageContentVariants } from "./variants";

/**
 * PageContent Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function PageContent({
  data,
  settings,
  className,
  locale,
}: PageContentProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    PageContentVariants[variant as keyof typeof PageContentVariants];

  if (!VariantComponent) {
    console.warn(`PageContent variant "${variant}" not found, using default`);
    const DefaultComponent = PageContentVariants.default;
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
