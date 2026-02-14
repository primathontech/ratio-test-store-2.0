import React from "react";
import { Variants } from "./variants";
import { Props, Settings } from "./types";

export const defaultSettings: Settings = {
  variant: "v1",
  testimonials: [],

  // Required theme properties
  headingStyles: {
    fontSize: {
      desktop: "32px",
      mobile: "24px",
    },
    color: "#000000",
  },
  subheadingStyles: {
    fontSize: {
      desktop: "18px",
      mobile: "16px",
    },
    color: "#666666",
  },

  // Core behavior
  interval: 5000,
  autoplay: true,
  loop: true,
  pauseOnHover: true,
  swipeable: true,
  maxTestimonials: 10,

  // Layout & sizing
  width: "container",
  slidesPerView: 3,
  mobileSlidesPerView: 1,
  spacing: 16,

  // Navigation arrows
  showArrows: true,
  arrowShape: "circle",
  arrowBackgroundColor: "#fff",
  arrowActiveBackgroundColor: "#fff",
  arrowHoverBackgroundColor: "#000",

  // Indicators
  showIndicators: true,
  indicatorPosition: "bottom-center",
  indicatorOffset: 10,
  isShowFocusRing: false,
  gapBeetweenDots: "2px",

  // Accessibility
  ariaLabel: "Customer testimonials carousel",
};

export function Testimonials({
  data,
  settings = defaultSettings,
  className,
  locale,
}: Props) {
  const variant = settings.variant || "v1";
  const VariantComponent = Variants[variant as keyof typeof Variants];

  if (!VariantComponent) {
    const DefaultComponent = Variants.default;

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
