"use client";

import React from "react";
import { VideoAppProps } from "./types";
import { VideoAppVariants } from "./variants";

/**
 * VideoApp Widget
 *
 * Wraps an external Video-Widget SDK that renders a grid/carousel of
 * shoppable videos on the home page (no product context) or PDP
 * (filtered to the current product). The SDK injects its own DOM into
 * `#video-app-container` and dispatches `video-widget:add-to-cart`
 * events that we bridge into `@shopkit/cart`'s `addItems`.
 */
export function VideoApp({ data, settings, className, locale }: VideoAppProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    VideoAppVariants[variant as keyof typeof VideoAppVariants];

  if (!VariantComponent) {
    console.warn(`VideoApp variant "${variant}" not found, using default`);
    const DefaultComponent = VideoAppVariants.default;
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

export default VideoApp;
