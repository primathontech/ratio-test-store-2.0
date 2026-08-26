"use client";

import React from "react";
import { RatioFormProps } from "./types";
import { RatioFormVariants } from "./variants";

export function RatioForm({
  data,
  settings,
  className,
  locale,
}: RatioFormProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    RatioFormVariants[variant as keyof typeof RatioFormVariants];

  if (!VariantComponent) {
    const DefaultComponent = RatioFormVariants.default;
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
