"use client";

import React from "react";
import { AdditionalInformationProps } from "./types";
import { AdditionalInformationVariants } from "./variants";

/**
 * AdditionalInformation Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function AdditionalInformation({
  data,
  settings,
  className,
  locale,
}: AdditionalInformationProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    AdditionalInformationVariants[
      variant as keyof typeof AdditionalInformationVariants
    ];

  if (!VariantComponent) {
    console.warn(
      `AdditionalInformation variant "${variant}" not found, using default`
    );
    const DefaultComponent = AdditionalInformationVariants.default;
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
