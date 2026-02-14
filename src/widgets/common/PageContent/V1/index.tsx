"use client";

import React, { memo } from "react";
import { PageContentProps } from "../types";

/**
 * PageContent V1 Component
 *
 * Initial variant implementation.
 */
export const V1 = memo(function V1({
  data,
  settings,
  className,
  locale,
}: PageContentProps) {
  return (
    <div className={className}>
      {/* Your widget UI goes here */}
      <p>PageContent Widget — V1</p>
    </div>
  );
});

export { V1 as default };
