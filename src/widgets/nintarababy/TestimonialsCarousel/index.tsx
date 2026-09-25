import React from "react";
import { TestimonialsCarouselProps } from "./types";
import { TestimonialsCarouselVariants } from "./variants";

/**
 * TestimonialsCarousel Widget
 *
 * Testimonials section cloned from nintarababy.in product page.
 * Peach background, CSS grid scroll-snap carousel with gold arrow buttons.
 * 4-col desktop, 3-col tablet, 2-col small tablet, 80% peek mobile.
 */
export function TestimonialsCarousel({
  data,
  settings,
  className,
  locale,
}: TestimonialsCarouselProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    TestimonialsCarouselVariants[
      variant as keyof typeof TestimonialsCarouselVariants
    ];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      "TestimonialsCarousel variant " + variant + " not found, using default"
    );
    const DefaultComponent = TestimonialsCarouselVariants.default;
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
