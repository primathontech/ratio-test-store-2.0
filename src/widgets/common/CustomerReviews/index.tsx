"use client";

import React from "react";
import { CustomerReviewsProps } from "./types";
import { CustomerReviewsVariants } from "./variants";

/**
 * CustomerReviews Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function CustomerReviews({
  data,
  settings,
  className,
  locale,
}: CustomerReviewsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CustomerReviewsVariants[variant as keyof typeof CustomerReviewsVariants];

  if (!VariantComponent) {
    console.warn(
      `CustomerReviews variant "${variant}" not found, using default`
    );
    const DefaultComponent = CustomerReviewsVariants.default;
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
