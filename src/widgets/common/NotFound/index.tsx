"use client";

import React from "react";
import { NotFoundProps } from "./types";
import { NotFoundVariants } from "./variants";

export function NotFound({ data, settings, className, locale }: NotFoundProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    NotFoundVariants[variant as keyof typeof NotFoundVariants];

  if (!VariantComponent) {
    const DefaultComponent = NotFoundVariants.default;
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
