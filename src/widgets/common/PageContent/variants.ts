import React from "react";
import { PageContentProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all PageContent variants
 */
export const PageContentVariants: Record<string, React.FC<PageContentProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type PageContentVariantType = keyof typeof PageContentVariants;
