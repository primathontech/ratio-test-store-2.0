import React from "react";
import { BlogProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all Blog variants
 */
export const BlogVariants: Record<string, React.FC<BlogProps>> = {
  v1: V1,
  default: V1,
};

export type BlogVariantType = keyof typeof BlogVariants;
