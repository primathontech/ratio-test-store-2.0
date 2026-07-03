import React from "react";
import { RichTextProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all RichText variants
 */
export const RichTextVariants: Record<string, React.FC<RichTextProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type RichTextVariantType = keyof typeof RichTextVariants;
