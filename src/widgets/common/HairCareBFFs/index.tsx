"use client";

import React from "react";
import { HairCareBFFsVariants } from "./variants";
import { HairCareBFFsProps } from "./types";

/**
 * HairCareBFFs Widget
 *
 * Tabbed product carousel section titled "Hair Care BFFs".
 * Dark background with BBLUNT watermark. Category tabs at top
 * switch between product carousels below. Each card shows product
 * image, category badge, title, subtitle, star rating, price,
 * and Add to Cart button.
 */
export function HairCareBFFs({
  data,
  settings,
  className,
  locale,
}: HairCareBFFsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    HairCareBFFsVariants[variant as keyof typeof HairCareBFFsVariants];

  if (!VariantComponent) {
    console.warn(`HairCareBFFs variant "${variant}" not found, using default`);
    const DefaultComponent = HairCareBFFsVariants.default;
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
