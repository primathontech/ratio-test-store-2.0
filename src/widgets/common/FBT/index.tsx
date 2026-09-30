"use client";

import React from "react";
import { FBTProps } from "./types";
import { FBTVariants } from "./variants";

/**
 * FBT (Frequently Bought Together) Widget
 *
 * Wraps the external Product-Bundler SDK on the PDP. The SDK injects its
 * own DOM into `#fbt-container-shopify` and emits cart events that we
 * bridge into `@shopkit/cart`'s `addItems`. Widget is presentational —
 * all data fetching happens inside the SDK driven by the PDP's product id.
 */
export function FBT({ data, settings, className, locale }: FBTProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent = FBTVariants[variant as keyof typeof FBTVariants];

  if (!VariantComponent) {
    console.warn(`FBT variant "${variant}" not found, using default`);
    const DefaultComponent = FBTVariants.default;
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

export default FBT;
