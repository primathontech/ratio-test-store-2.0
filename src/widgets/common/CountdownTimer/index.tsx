"use client";

import React from "react";
import { CountdownTimerVariants } from "./variants";
import { CountdownTimerProps } from "./types";

/**
 * CountdownTimer Widget
 *
 * Displays a configurable countdown timer with "Hurry Up!" heading,
 * decorative SVG lines, sub-heading, and four circular countdown units
 * (Days, Hours, Minutes, Seconds). Accepts a target date via settings.
 */
export function CountdownTimer({
  data,
  settings,
  className,
  locale,
}: CountdownTimerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CountdownTimerVariants[variant as keyof typeof CountdownTimerVariants];

  if (!VariantComponent) {
    console.warn(
      `CountdownTimer variant "${variant}" not found, using default`
    );
    const DefaultComponent = CountdownTimerVariants.default;
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
