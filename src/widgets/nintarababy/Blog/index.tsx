"use client";

import React from "react";
import { BlogProps } from "./types";
import { BlogVariants } from "./variants";

/**
 * Blog Widget
 *
 * "We're Here For You!" blog section cloned from nintarababy.in.
 * Desktop: 1 large featured card left + 2 smaller stacked right.
 * Mobile: horizontal scroll-snap slider with dot pagination.
 */
export function Blog({ data, settings, className, locale }: BlogProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent = BlogVariants[variant as keyof typeof BlogVariants];

  if (!VariantComponent) {
    console.warn(`Blog variant "${variant}" not found, using default`);
    const DefaultComponent = BlogVariants.default;
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
