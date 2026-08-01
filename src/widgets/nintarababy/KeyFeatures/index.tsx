import React from "react";
import { KeyFeaturesProps } from "./types";
import { KeyFeaturesVariants } from "./variants";

/**
 * KeyFeatures Widget
 *
 * 4-column icon+label feature grid cloned from nintarababy.in product page.
 * Renders the appropriate variant based on settings.
 */
export function KeyFeatures({
  data,
  settings,
  className,
  locale,
}: KeyFeaturesProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    KeyFeaturesVariants[variant as keyof typeof KeyFeaturesVariants];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      "KeyFeatures variant " + variant + " not found, using default"
    );
    const DefaultComponent = KeyFeaturesVariants.default;
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
