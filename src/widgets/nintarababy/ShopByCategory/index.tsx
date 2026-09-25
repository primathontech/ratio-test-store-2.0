import React from "react";
import { ShopByCategoryProps } from "./types";
import { ShopByCategoryVariants } from "./variants";

/**
 * ShopByCategory Widget
 *
 * Category card grid cloned from nintarababy.in.
 * Renders the appropriate variant based on settings.
 */
export function ShopByCategory({
  data,
  settings,
  className,
  locale,
}: ShopByCategoryProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ShopByCategoryVariants[variant as keyof typeof ShopByCategoryVariants];

  if (!VariantComponent) {
    console.warn(
      `ShopByCategory variant "${variant}" not found, using default`
    );
    const DefaultComponent = ShopByCategoryVariants.default;
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
