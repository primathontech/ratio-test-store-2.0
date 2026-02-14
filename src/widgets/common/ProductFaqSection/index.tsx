import React from "react";
import { ProductFaqSectionVariant } from "./variants";
import { ProductFaqSectionProps } from "./types";

/**
 * Main ProductFaqSectionVariant Component
 * Renders the appropriate variant based on settings
 */
// Default settings
const defaultSettings = {
  variant: "v1",
  sectionTitle: "FAQ",
};

export function ProductFaqSection({
  data,
  settings = defaultSettings,
  className,
  locale,
}: ProductFaqSectionProps) {
  const variant = settings.variant || "v1";
  const VariantComponent =
    ProductFaqSectionVariant[variant as keyof typeof ProductFaqSectionVariant];

  if (!VariantComponent) {
    console.warn(
      `ProductFaqSectionVariant variant "${variant}" not found, using default`
    );
    const DefaultComponent = ProductFaqSectionVariant.default;
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
