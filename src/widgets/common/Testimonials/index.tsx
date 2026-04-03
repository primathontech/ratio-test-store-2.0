"use client";

import React from "react";
import { TestimonialsProps } from "./types";
import { TestimonialsVariants } from "./variants";

/**
 * Testimonials Widget
 *
 * Customer testimonials carousel with dark cards, star ratings,
 * and author avatars. CSS scroll-snap carousel: 3 cards on desktop,
 * 2 on tablet, 1 on mobile with peek.
 */
export function Testimonials({
  data,
  settings,
  className,
  locale,
}: TestimonialsProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    TestimonialsVariants[variant as keyof typeof TestimonialsVariants];

  if (!VariantComponent) {
    console.warn(`Testimonials variant "${variant}" not found, using default`);
    const DefaultComponent = TestimonialsVariants.default;
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
