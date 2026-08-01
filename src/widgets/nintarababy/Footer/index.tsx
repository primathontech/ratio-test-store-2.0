"use client";

import React from "react";
import { FooterProps } from "./types";
import { FooterVariants } from "./variants";

/**
 * Footer Widget
 *
 * 5-column footer cloned from nintarababy.in.
 * Includes SEO accordion, Help links, Other Links, Contact Us,
 * newsletter signup, social icons, and category links.
 */
export function Footer({ data, settings, className, locale }: FooterProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    FooterVariants[variant as keyof typeof FooterVariants];

  if (!VariantComponent) {
    console.warn(`Footer variant "${variant}" not found, using default`);
    const DefaultComponent = FooterVariants.default;
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
