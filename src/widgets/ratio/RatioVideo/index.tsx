"use client";

import React from "react";
import { RatioVideoProps } from "./types";
import { RatioVideoVariants } from "./variants";

export function RatioVideo({
  data,
  settings,
  className,
  locale,
}: RatioVideoProps) {
  const variant = settings?.variant || "v1";
  const V =
    RatioVideoVariants[variant as keyof typeof RatioVideoVariants] ??
    RatioVideoVariants.default;
  return (
    <V data={data} settings={settings} className={className} locale={locale} />
  );
}

export default RatioVideo;
