"use client";

import React from "react";
import { DeleteAccountProps } from "./types";
import { DeleteAccountVariants } from "./variants";

/**
 * DeleteAccount Widget
 *
 * Renders the appropriate variant based on settings.
 */
export function DeleteAccount({
  data,
  settings,
  className,
  locale,
}: DeleteAccountProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    DeleteAccountVariants[variant as keyof typeof DeleteAccountVariants];

  if (!VariantComponent) {
    console.warn(`DeleteAccount variant "${variant}" not found, using default`);
    const DefaultComponent = DeleteAccountVariants.default;
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
