import React from "react";
import { FAQsAccordionProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all FAQsAccordion variants
 */
export const FAQsAccordionVariants: Record<
  string,
  React.FC<FAQsAccordionProps>
> = {
  v1: V1,
  default: V1,
};

export type FAQsAccordionVariantType = keyof typeof FAQsAccordionVariants;
