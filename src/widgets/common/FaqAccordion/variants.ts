import { V1 } from "./V1";

export const FaqAccordionVariants = {
  v1: V1,
  default: V1,
};

export type FaqAccordionVariantType = keyof typeof FaqAccordionVariants;
