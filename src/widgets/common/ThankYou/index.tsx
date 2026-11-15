"use client";

import React from "react";
import { ThankYouProps } from "./types";
import { ThankYouVariants } from "./variants";

/**
 * ThankYou Widget
 *
 * Renders the order confirmation page after a successful checkout.
 * Reads orderId/requestId/customerId from URL search params and
 * fetches order details via the order service (`@/services/order.service`).
 */
export function ThankYou({
  data,
  settings = { variant: "v1" },
  className,
  locale,
}: ThankYouProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ThankYouVariants[variant as keyof typeof ThankYouVariants];

  if (!VariantComponent) {
    console.warn(`ThankYou variant "${variant}" not found, using default`);
    const DefaultComponent = ThankYouVariants.default;
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
