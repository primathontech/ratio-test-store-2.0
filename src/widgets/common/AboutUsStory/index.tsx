"use client";

import React from "react";
import { AboutUsStoryProps } from "./types";
import { AboutUsStoryVariants } from "./variants";

/**
 * AboutUsStory Widget
 *
 * Four centered heading + ornamental SVG divider + paragraph blocks.
 * Used on the About Us page to tell the brand story.
 */
export function AboutUsStory({
  data,
  settings,
  className,
  locale,
}: AboutUsStoryProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    AboutUsStoryVariants[variant as keyof typeof AboutUsStoryVariants];

  if (!VariantComponent) {
    console.warn(`AboutUsStory variant "${variant}" not found, using default`);
    const DefaultComponent = AboutUsStoryVariants.default;
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
