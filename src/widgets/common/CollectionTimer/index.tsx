"use client";

import React from "react";
import { CollectionTimerVariants } from "./variants";
import { CollectionTimerProps } from "./types";

/**
 * CollectionTimer Widget
 *
 * Full-width urgency strip with a "Hurry Up!" headline, sale label, and a
 * live countdown to a configured end date. Renders nothing when no
 * `endDateString` is supplied or `visible` is set to false.
 */
export function CollectionTimer({
  data,
  settings,
  className,
  locale,
}: CollectionTimerProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    CollectionTimerVariants[variant as keyof typeof CollectionTimerVariants];

  if (!VariantComponent) {
    const DefaultComponent = CollectionTimerVariants.default;
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

export default CollectionTimer;
