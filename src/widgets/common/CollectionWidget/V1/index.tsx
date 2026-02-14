"use client";

import React, { memo } from "react";
import { CollectionWidgetProps } from "../types";

/**
 * CollectionWidget V1 Component
 *
 * Initial variant implementation.
 */
export const V1 = memo(function V1({
  data,
  settings,
  className,
  locale,
}: CollectionWidgetProps) {
  return (
    <div className={className}>
      {/* Your widget UI goes here */}
      <p>CollectionWidget Widget — V1</p>
    </div>
  );
});

export { V1 as default };
