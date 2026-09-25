import React from "react";
import { ProductMainProps } from "./types";
import { ProductMainVariants } from "./variants";
import { enrichProductMainData } from "./data-handler";

/**
 * ProductMain Widget
 *
 * Main product purchase section cloned from nintarababy.in.
 * Two-column layout: image gallery (left) + info panel (right).
 *
 * This wrapper is a Server Component: it server-side enriches the product
 * data with live rating + review count (Review Service Section 13.2)
 * before handing off to the client variant. That way the rating renders
 * with the initial HTML — no flicker, SEO-friendly.
 */
export const ProductMain = async ({
  data,
  settings,
  className,
  locale,
}: ProductMainProps) => {
  const enrichedData = await enrichProductMainData(data);

  const variant = settings?.variant || "v1";
  const VariantComponent =
    ProductMainVariants[variant as keyof typeof ProductMainVariants];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      "ProductMain variant " + variant + " not found, using default"
    );
    const DefaultComponent = ProductMainVariants.default;
    return (
      <DefaultComponent
        data={enrichedData}
        settings={settings}
        className={className}
        locale={locale}
      />
    );
  }

  return (
    <VariantComponent
      data={enrichedData}
      settings={settings}
      className={className}
      locale={locale}
    />
  );
};
