import React from "react";
import { TestimonialsProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all Testimonials variants
 */
export const TestimonialsVariants: Record<
  string,
  React.FC<TestimonialsProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type TestimonialsVariantType = keyof typeof TestimonialsVariants;
