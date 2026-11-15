"use client";

import React from "react";
import { SalePageBannerVariants } from "./variants";
import type { SalePageBannerProps } from "./types";

export function SalePageBanner({
  data,
  settings,
  className,
  locale,
}: SalePageBannerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    SalePageBannerVariants[variant as keyof typeof SalePageBannerVariants] ||
    SalePageBannerVariants.default;

  return (
    <VariantComponent
      data={data}
      settings={settings}
      className={className}
      locale={locale}
    />
  );
}

export default SalePageBanner;
