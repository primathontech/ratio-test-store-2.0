"use client";

import React, { memo } from "react";
import { RatioFormProps } from "../types";

export const V1 = memo(function V1({ settings, className }: RatioFormProps) {
  const formId = settings?.formId?.trim();

  if (!formId) {
    return null;
  }

  return (
    <div
      className={className}
      data-ratio-form={formId}
      data-testid="ratio-form"
    />
  );
});

export { V1 as default };
