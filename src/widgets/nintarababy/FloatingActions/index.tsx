import React from "react";
import { FloatingActionsProps } from "./types";
import { FloatingActionsVariants } from "./variants";

/**
 * FloatingActions Widget
 *
 * WhatsApp button + scroll-to-top, fixed bottom-right on all pages.
 */
export function FloatingActions({
  data,
  settings,
  className,
  locale,
}: FloatingActionsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    FloatingActionsVariants[variant as keyof typeof FloatingActionsVariants];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      `FloatingActions variant "${variant}" not found, using default`
    );
    const DefaultComponent = FloatingActionsVariants.default;
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
