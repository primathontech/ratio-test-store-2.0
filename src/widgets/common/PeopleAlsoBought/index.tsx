"use client";

import React from "react";
import { PeopleAlsoBoughtProps } from "./types";
import { PeopleAlsoBoughtVariants } from "./variants";

/**
 * PeopleAlsoBought Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function PeopleAlsoBought({
  data,
  settings,
  className,
  locale,
}: PeopleAlsoBoughtProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    PeopleAlsoBoughtVariants[variant as keyof typeof PeopleAlsoBoughtVariants];

  if (!VariantComponent) {
    console.warn(
      `PeopleAlsoBought variant "${variant}" not found, using default`
    );
    const DefaultComponent = PeopleAlsoBoughtVariants.default;
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
