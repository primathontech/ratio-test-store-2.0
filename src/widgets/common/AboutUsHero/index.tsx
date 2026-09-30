"use client";

import React from "react";
import { AboutUsHeroProps } from "./types";
import { AboutUsHeroVariants } from "./variants";

/**
 * AboutUsHero Widget
 *
 * Full-width clickable banner image linking to a destination page.
 * Used on the About Us page as the hero section.
 */
export function AboutUsHero({
  data,
  settings,
  className,
  locale,
}: AboutUsHeroProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    AboutUsHeroVariants[variant as keyof typeof AboutUsHeroVariants];

  if (!VariantComponent) {
    console.warn(`AboutUsHero variant "${variant}" not found, using default`);
    const DefaultComponent = AboutUsHeroVariants.default;
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
