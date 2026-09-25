import React from "react";
import { VideoAndBrandValuesProps } from "./types";
import { VideoAndBrandValuesVariants } from "./variants";

/**
 * VideoAndBrandValues Widget
 *
 * Split layout section with sage green (#e4edd3) background. Left column:
 * video player with play button overlay. Right column: "What We Stand For"
 * heading, mission statement, and 5 brand value bullet points.
 * Mobile (<=850px): stacks to single column, text hidden, mobile heading shown.
 */
export function VideoAndBrandValues({
  data,
  settings,
  className,
  locale,
}: VideoAndBrandValuesProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    VideoAndBrandValuesVariants[
      variant as keyof typeof VideoAndBrandValuesVariants
    ];

  if (!VariantComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      "VideoAndBrandValues variant " + variant + " not found, using default"
    );
    const DefaultComponent = VideoAndBrandValuesVariants.default;
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
