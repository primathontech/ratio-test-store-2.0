"use client";

import React from "react";
import { RatioCustomerReviewsProps } from "./types";
import { RatioCustomerReviewsVariants } from "./variants";

export function RatioCustomerReviews({
  data,
  settings,
  className,
  locale,
}: RatioCustomerReviewsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    RatioCustomerReviewsVariants[
      variant as keyof typeof RatioCustomerReviewsVariants
    ];

  if (!VariantComponent) {
    const DefaultComponent = RatioCustomerReviewsVariants.default;
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
