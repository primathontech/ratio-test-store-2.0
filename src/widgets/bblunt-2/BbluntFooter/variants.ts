import React from "react";
import { FooterProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all Footer variants
 */
export const FooterVariants: Record<string, React.FC<FooterProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type FooterVariantType = keyof typeof FooterVariants;
