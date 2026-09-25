"use client";

import React from "react";
import { ProductBundleProps } from "./types";
import { ProductBundleVariants } from "./variants";

export function ProductBundle({
  data,
  settings,
  className,
  locale,
}: ProductBundleProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductBundleVariants[variant as keyof typeof ProductBundleVariants] ||
    ProductBundleVariants.default;

  return (
    <VariantComponent
      data={data}
      settings={settings}
      className={className}
      locale={locale}
    />
  );
}

export type {
  ProductBundleProps,
  ProductBundleData,
  ProductBundleSettings,
} from "./types";
export type { ProductBundleVariantType } from "./variants";
