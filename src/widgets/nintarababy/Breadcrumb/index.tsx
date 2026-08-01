import React from "react";
import { BreadcrumbProps } from "./types";
import { BreadcrumbVariants } from "./variants";

/**
 * Breadcrumb Widget
 *
 * Breadcrumb navigation cloned from nintarababy.in product page.
 * Renders the appropriate variant based on settings.
 */
export function Breadcrumb({
  data,
  settings,
  className,
  locale,
}: BreadcrumbProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    BreadcrumbVariants[variant as keyof typeof BreadcrumbVariants];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn("Breadcrumb variant " + variant + " not found, using default");
    const DefaultComponent = BreadcrumbVariants.default;
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
