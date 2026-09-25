import React from "react";
import { LovedByParentsCarouselProps } from "./types";
import { LovedByParentsCarouselVariants } from "./variants";

/**
 * LovedByParentsCarousel Widget
 *
 * Recommended products carousel cloned from nintarababy.in product page.
 * White background, CSS grid scroll-snap carousel with teal arrow buttons.
 * 4-col desktop, 2-col tablet, 1.2-peek mobile.
 */
export function LovedByParentsCarousel({
  data,
  settings,
  className,
  locale,
}: LovedByParentsCarouselProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    LovedByParentsCarouselVariants[
      variant as keyof typeof LovedByParentsCarouselVariants
    ];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      "LovedByParentsCarousel variant " + variant + " not found, using default"
    );
    const DefaultComponent = LovedByParentsCarouselVariants.default;
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
