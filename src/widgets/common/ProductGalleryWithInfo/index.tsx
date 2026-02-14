import React from "react";
import { ProductGalleryWithInfoProps } from "./types";
import { ProductGalleryWithInfoV1 } from "./V1/ProductGalleryWithInfoV1";

export const defaultSettings = {
  variant: "v1" as const,
  responsive: {
    mobile: {
      stackVertically: true,
      galleryWidth: 100,
      infoWidth: 100,
      gap: 24,
    },
  },
};

export function ProductGalleryWithInfo({
  data,
  settings = defaultSettings,
  className,
  locale,
}: ProductGalleryWithInfoProps) {
  const mergedSettings = {
    ...defaultSettings,
    ...settings,
    responsive: {
      mobile: {
        ...defaultSettings.responsive.mobile,
        ...settings.responsive?.mobile,
      },
    },
  };

  const variant = mergedSettings.variant || "v1";

  // For now, we only have V1
  return (
    <ProductGalleryWithInfoV1
      data={data}
      settings={mergedSettings}
      className={className}
      locale={locale}
    />
  );
}

export default ProductGalleryWithInfo;
