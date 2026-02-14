import React from "react";
import { ProductAdditionalInfoSectionVariant } from "./variants";
import { ProductAdditionalInfoSectionProps } from "./types";

/**
 * Main ProductAdditionalInfoSection Component
 * Renders the appropriate variant based on settings
 */
// Default settings
const defaultSettings = {
  variant: "v1",
  sectionTitle: "Additional Information",
};

export function ProductAdditionalInfoSection({
  data,
  settings = defaultSettings,
  className,
  locale,
}: ProductAdditionalInfoSectionProps) {
  const variant = settings.variant || "v1";
  const VariantComponent =
    ProductAdditionalInfoSectionVariant[
      variant as keyof typeof ProductAdditionalInfoSectionVariant
    ];

  if (!VariantComponent) {
    console.warn(
      `ProductAdditionalInfoSectionVariant variant "${variant}" not found, using default`
    );
    const DefaultComponent = ProductAdditionalInfoSectionVariant.default;
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
