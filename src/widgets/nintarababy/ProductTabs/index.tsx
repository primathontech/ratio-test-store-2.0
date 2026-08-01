import React from "react";
import { ProductTabsProps } from "./types";
import { ProductTabsVariants } from "./variants";

/**
 * ProductTabs Widget
 *
 * Tabbed product information section cloned from nintarababy.in product page.
 * 3 tabs: Product Details, Description, Delivery & Returns.
 * Desktop: tabbed card with gold border. Mobile: accordion layout.
 */
export function ProductTabs({
  data,
  settings,
  className,
  locale,
}: ProductTabsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductTabsVariants[variant as keyof typeof ProductTabsVariants];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      "ProductTabs variant " + variant + " not found, using default"
    );
    const DefaultComponent = ProductTabsVariants.default;
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
