"use client";

import React, { memo } from "react";
import { HeaderProps } from "../types";

/**
 * Header V1 Component
 *
 * Initial variant implementation.
 */
export const V1 = memo(function V1({
  data,
  settings,
  className,
  locale,
}: HeaderProps) {
  return (
    <div className={className}>
      {/* Your widget UI goes here */}
      <p>Header Widget — V1</p>
    </div>
  );
});

export { V1 as default };
