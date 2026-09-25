"use client";

import React from "react";
import { LoadMorePaginationProps } from "./types";
import { LoadMorePaginationVariants } from "./variants";

/**
 * LoadMorePagination Widget
 *
 * Centered "Load More" pill button with outline style.
 * Border via ::after pseudo-element: 2px solid #01464f.
 * Sweep-to-right hover: ::before scales from scaleX(0) to scaleX(1) over 0.5s ease-out.
 * Text transitions from #01464f to #ffffff on hover (0.3s).
 * Loading state: text opacity->0, CSS border spinner appears.
 * Scroll reveal: translateY(2rem)->0 + opacity, 600ms cubic-bezier(0,0,0.3,1).
 */
export function LoadMorePagination({
  data,
  settings,
  className,
  locale,
}: LoadMorePaginationProps) {
  const variant = settings?.variant || "v1";
  const VariantComponent =
    LoadMorePaginationVariants[
      variant as keyof typeof LoadMorePaginationVariants
    ];

  if (!VariantComponent) {
    const DefaultComponent = LoadMorePaginationVariants.default;
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
