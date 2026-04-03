import React from "react";
import { FaqAccordionProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all FaqAccordion variants
 */
export const FaqAccordionVariants: Record<
  string,
  React.FC<FaqAccordionProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type FaqAccordionVariantType = keyof typeof FaqAccordionVariants;
