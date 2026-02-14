import React from "react";
import { HomepageShineAcademySectionVariant } from "./variants";
import { HomepageShineAcademySectionProps } from "./types";

/**
 * Main HomepageShineAcademySection Component
 * Renders the appropriate variant based on settings
 */
// Default settings
const defaultSettings = {
  variant: "v1",
};

export function HomepageShineAcademySection({
  data,
  settings = defaultSettings,
  className,
  locale,
}: HomepageShineAcademySectionProps) {
  const variant = settings.variant || "v1";
  const VariantComponent =
    HomepageShineAcademySectionVariant[
      variant as keyof typeof HomepageShineAcademySectionVariant
    ];

  if (!VariantComponent) {
    console.warn(
      `HomepageShineAcademySectionVariant variant "${variant}" not found, using default`
    );
    const DefaultComponent = HomepageShineAcademySectionVariant.default;
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
