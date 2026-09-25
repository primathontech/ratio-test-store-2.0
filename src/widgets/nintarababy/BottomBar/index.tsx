import React from "react";
import { BottomBarProps } from "./types";
import { BottomBarVariants } from "./variants";

/**
 * BottomBar Widget
 *
 * Minimal copyright bar cloned from nintarababy.in.
 * Renders the appropriate variant based on settings.
 */
export function BottomBar({
  data,
  settings,
  className,
  locale,
}: BottomBarProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    BottomBarVariants[variant as keyof typeof BottomBarVariants];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(`BottomBar variant "${variant}" not found, using default`);
    const DefaultComponent = BottomBarVariants.default;
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
