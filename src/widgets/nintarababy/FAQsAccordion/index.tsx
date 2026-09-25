import React from "react";
import { FAQsAccordionProps } from "./types";
import { FAQsAccordionVariants } from "./variants";

/**
 * FAQsAccordion Widget
 *
 * FAQ accordion section cloned from nintarababy.in product page.
 * Renders the appropriate variant based on settings.
 */
export function FAQsAccordion({
  data,
  settings,
  className,
  locale,
}: FAQsAccordionProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    FAQsAccordionVariants[variant as keyof typeof FAQsAccordionVariants];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      "FAQsAccordion variant " + variant + " not found, using default"
    );
    const DefaultComponent = FAQsAccordionVariants.default;
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
