import React from "react";
import { ReasonToLoveSectionVariant } from "./variants";
import { ReasonToLoveSectionProps } from "./types";

/**
 * Main ReasonToLoveSection Component
 * Renders the appropriate variant based on settings
 */
// Default settings
const defaultSettings = {
  variant: "v1",
  sectionTitle: "Reason To Love",
};

export function ReasonToLoveSection({
  data,
  settings = defaultSettings,
  className,
  locale,
}: ReasonToLoveSectionProps) {
  const variant = settings.variant || "v1";
  const VariantComponent =
    ReasonToLoveSectionVariant[
      variant as keyof typeof ReasonToLoveSectionVariant
    ];

  if (!VariantComponent) {
    console.warn(
      `ReasonToLoveSectionVariant variant "${variant}" not found, using default`
    );
    const DefaultComponent = ReasonToLoveSectionVariant.default;
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
