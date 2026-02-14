import React from "react";
import { Variants } from "./variants";
import { Props, Settings } from "./types";

export const defaultSettings: Settings = {
  variant: "v1",
  width: "full",
  backgroundColor: "#000000",
  fontColor: "#ffffff",
  fontColorMobile: "#ffffff",
  heightMobile: "40px",
  heightDesktop: "48px",
  fontSizeMobile: "14px",
  fontSizeDesktop: "16px",
  texts: [],
  separator: "dot",
  mode: "marquee",
  marqueeSpeed: "30s",
  pauseOnHover: true,
  ariaLabel: "Announcement banner",
  showCloseButton: false,
  // action button defaults
  showActionButton: false,
  actionButtonText: "Shop Now",
  actionButtonPosition: "right",
  actionButtonHeight: "32px",
  actionButtonWidth: "auto",
  actionButtonBorderRadius: "4px",
  actionButtonBorderColor: "transparent",
  actionButtonTextColor: "#ffffff",
  actionButtonBackgroundColor: "#007bff",

  // V2-specific defaults
  enableSlider: false, // V1 default, V2 will override
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplayInterval: 5000,
  infinite: true,
  showNavigationArrows: true,
  navigationPosition: "inside",
  navigationIconStyle: "chevron",
  showNavigationOnHover: false,
  enableDragScroll: true,
  dragSensitivity: 50,
  navigationArrowColor: "#ffffff",
  navigationArrowBackgroundColor: "rgba(0,0,0,0.5)",
  navigationArrowSize: "32px",
};

export function AnnouncementBar({
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
