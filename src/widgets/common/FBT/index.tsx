"use client";

import React from "react";
import { FBTProps } from "./types";
import { Variants } from "./variants";

export const defaultSettings: FBTProps["settings"] = { variant: "v1" };

export function FBT({
  data,
  settings = defaultSettings,
  className,
  locale,
}: FBTProps) {
  // eslint-disable-next-line no-console
  const variant = settings?.variant || "v1";
  const V = Variants[variant as keyof typeof Variants] ?? Variants.default;
  return (
    <V data={data} settings={settings} className={className} locale={locale} />
  );
}

export default FBT;
