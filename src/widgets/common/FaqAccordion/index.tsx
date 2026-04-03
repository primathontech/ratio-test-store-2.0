"use client";

import React from "react";
import { FaqAccordionProps } from "./types";
import { FaqAccordionVariants } from "./variants";

/**
 * FaqAccordion Widget
 *
 * Collection-page FAQ section with a heading and expandable accordion items.
 * Only one item can be open at a time.
 */
export function FaqAccordion({
  data,
  settings,
  className,
  locale,
}: FaqAccordionProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    FaqAccordionVariants[variant as keyof typeof FaqAccordionVariants];

  if (!VariantComponent) {
    console.warn(`FaqAccordion variant "${variant}" not found, using default`);
    const DefaultComponent = FaqAccordionVariants.default;
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
