import React from "react";
import { ShopByConcernsVariant } from "./variants";
import { ShopByConcernsProps } from "./types";

/**
 * Main ShopByConcerns Component
 * Renders the appropriate variant based on settings
 */
// Default settings
const defaultSettings = {
  variant: "v1",
  items: [],
};

export function ShopByConcerns({
  data,
  settings = defaultSettings,
  className,
  locale,
}: ShopByConcernsProps) {
  const variant = settings.variant || "v1";
  const VariantComponent =
    ShopByConcernsVariant[variant as keyof typeof ShopByConcernsVariant];

  if (!VariantComponent) {
    console.warn(
      `ShopByConcernsVariant variant "${variant}" not found, using default`
    );
    const DefaultComponent = ShopByConcernsVariant.default;
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
