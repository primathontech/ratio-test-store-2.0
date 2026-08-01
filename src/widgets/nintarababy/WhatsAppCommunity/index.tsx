import React from "react";
import { WhatsAppCommunityProps } from "./types";
import { WhatsAppCommunityVariants } from "./variants";

/**
 * WhatsAppCommunity Widget
 *
 * WhatsApp community banner section cloned from nintarababy.in product page.
 * Renders the appropriate variant based on settings.
 */
export function WhatsAppCommunity({
  data,
  settings,
  className,
  locale,
}: WhatsAppCommunityProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    WhatsAppCommunityVariants[
      variant as keyof typeof WhatsAppCommunityVariants
    ];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      "WhatsAppCommunity variant " + variant + " not found, using default"
    );
    const DefaultComponent = WhatsAppCommunityVariants.default;
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
