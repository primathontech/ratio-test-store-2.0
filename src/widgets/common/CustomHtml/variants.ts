import React from "react";
import { CustomHtmlProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CustomHtml variants
 */
export const CustomHtmlVariants: Record<string, React.FC<CustomHtmlProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type CustomHtmlVariantType = keyof typeof CustomHtmlVariants;
