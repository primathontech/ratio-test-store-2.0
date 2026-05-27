"use client";

import { Props, Settings } from "./types";
import { Variants } from "./variants";

export const defaultSettings: Settings = {
  variant: "v1",
  bannerCarousel: [],
  autoplayInterval: 5000,
  autoplay: true,
  loop: true,
  pauseOnHover: true,
  draggable: true,
  showIndicators: true,
  mobileAspectRatio: "1/1",
  desktopAspectRatio: "182/57",
};

export function BannerCarousel({
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

export default BannerCarousel;
