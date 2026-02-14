import { V1 } from "./v1";

export const ReviewSectionVariants = {
  v1: V1,
  default: V1, // fallback
};

export type ReviewSectionVariantType = keyof typeof ReviewSectionVariants;
