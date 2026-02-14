"use client";

import React, { memo } from "react";
import { ProductGalleryProps } from "../types";

/**
 * ProductGallery V1 Component
 *
 * Initial variant implementation.
 */
export const V1 = memo(function V1({
  data,
  settings,
  className,
  locale,
}: ProductGalleryProps) {
  return (
    <div className={className}>
      {/* Your widget UI goes here */}
      <p>ProductGallery Widget — V1</p>
    </div>
  );
});

export { V1 as default };
