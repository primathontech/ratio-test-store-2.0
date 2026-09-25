"use client";

import React from "react";
import { AnnouncementBarProps } from "./types";
import { AnnouncementBarVariants } from "./variants";

/**
 * AnnouncementBar Widget
 *
 * Auto-rotating promotional message bar cloned from nintarababy.in.
 * Renders the appropriate variant based on settings.
 */
export function AnnouncementBar({
  data,
  settings,
  className,
  locale,
}: AnnouncementBarProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    AnnouncementBarVariants[variant as keyof typeof AnnouncementBarVariants];

  if (!VariantComponent) {
    console.warn(
      `AnnouncementBar variant "${variant}" not found, using default`
    );
    const DefaultComponent = AnnouncementBarVariants.default;
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
