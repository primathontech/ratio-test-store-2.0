import React from "react";
import { ProductDetailTabSectionVariant } from "./variants";
import { ProductDetailTabSectionProps } from "./types";

/**
 * Main ProductDetailTabSection Component
 * Renders the appropriate variant based on settings
 */
// Default settings
const defaultSettings = {
  variant: "v1",
};

export function ProductDetailTabSection({
  data,
  settings = defaultSettings,
  className,
  locale,
}: ProductDetailTabSectionProps) {
  const variant = settings.variant || "v1";
  const VariantComponent =
    ProductDetailTabSectionVariant[
      variant as keyof typeof ProductDetailTabSectionVariant
    ];

  if (!VariantComponent) {
    console.warn(
      `ProductDetailTabSection variant "${variant}" not found, using default`
    );
    const DefaultComponent = ProductDetailTabSectionVariant.default;
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
