"use client";

import React from "react";
import { RatioVideoProps } from "./types";
import { RatioVideoVariants } from "./variants";

/**
 * RatioVideo Widget
 *
 * Wraps an external Video-Widget SDK that renders a grid/carousel of
 * shoppable videos on the home page (no product context) or PDP
 * (filtered to the current product). The SDK injects its own DOM into
 * `#video-app-container` and dispatches `video-widget:add-to-cart`
 * events that we bridge into `@shopkit/cart`'s `addItems`.
 */
export function RatioVideo({ data, settings, className, locale }: RatioVideoProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    RatioVideoVariants[variant as keyof typeof RatioVideoVariants];

  if (!VariantComponent) {
    console.warn(`RatioVideo variant "${variant}" not found, using default`);
    const DefaultComponent = RatioVideoVariants.default;
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

export default RatioVideo;
