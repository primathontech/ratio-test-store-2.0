"use client";

import React, { memo } from "react";
import { ProductInfoProps } from "../types";

/**
 * ProductInfo V1 Component
 *
 * Initial variant implementation.
 */
export const V1 = memo(function V1({
  data,
  settings,
  className,
  locale,
}: ProductInfoProps) {
  return (
    <div className={className}>
      {/* Your widget UI goes here */}
      <p>ProductInfo Widget — V1</p>
    </div>
  );
});

export { V1 as default };
