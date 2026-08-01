import React from "react";
import { HowToUseInstructionsProps } from "./types";
import { HowToUseInstructionsVariants } from "./variants";

/**
 * HowToUseInstructions Widget
 *
 * Two-column "How to Use" instruction section cloned from nintarababy.in
 * product page. Sage green card with lifestyle image and 6 step bullets.
 * Desktop: CSS Grid 2-col (1fr 1fr), Mobile: single column, image on top.
 */
export function HowToUseInstructions({
  data,
  settings,
  className,
  locale,
}: HowToUseInstructionsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    HowToUseInstructionsVariants[
      variant as keyof typeof HowToUseInstructionsVariants
    ];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      "HowToUseInstructions variant " + variant + " not found, using default"
    );
    const DefaultComponent = HowToUseInstructionsVariants.default;
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
