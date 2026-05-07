"use client";

import React from "react";
import { CartDrawerVariants } from "./variants";
import { CartDrawerProps } from "./types";

/**
 * Main CartDrawer Widget
 *
 * Renders the appropriate variant based on settings.
 * Uses cart logic from @shopkit/cart.
 */
const defaultSettings = {
  variant: "v1",
  showShippingInfo: false,
  currencySymbol: "₹",
  checkoutText: "Checkout",
};

export function CartDrawer({
  data,
  settings = defaultSettings,
  className,
  locale,
}: CartDrawerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CartDrawerVariants[variant as keyof typeof CartDrawerVariants];

  if (!VariantComponent) {
    console.warn(`CartDrawer variant "${variant}" not found, using default`);
    const DefaultComponent = CartDrawerVariants.default;
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
