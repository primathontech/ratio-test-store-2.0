import React from "react";
import { WelcomeProps } from "./types";
import { WelcomeVariants } from "./variants";

/**
 * Welcome Widget
 *
 * Brand introduction section with background image, logo,
 * mission statement, and certification badges.
 * Cloned from nintarababy.in Welcome / About section.
 */
export function Welcome({ data, settings, className, locale }: WelcomeProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    WelcomeVariants[variant as keyof typeof WelcomeVariants];

  if (!VariantComponent) {
    console.warn(`Welcome variant "${variant}" not found, using default`);
    const DefaultComponent = WelcomeVariants.default;
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
