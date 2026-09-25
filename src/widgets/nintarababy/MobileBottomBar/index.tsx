import React from "react";
import { MobileBottomBarProps } from "./types";
import { MobileBottomBarVariants } from "./variants";

/**
 * MobileBottomBar Widget
 *
 * Fixed bottom navigation bar on mobile with Home, Products, About links.
 */
export function MobileBottomBar({
  data,
  settings,
  className,
  locale,
}: MobileBottomBarProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    MobileBottomBarVariants[variant as keyof typeof MobileBottomBarVariants];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      `MobileBottomBar variant "${variant}" not found, using default`
    );
    const DefaultComponent = MobileBottomBarVariants.default;
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
