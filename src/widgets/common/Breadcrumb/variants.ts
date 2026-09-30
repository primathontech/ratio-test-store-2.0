import React from "react";
import { BreadcrumbProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all Breadcrumb variants
 */
export const BreadcrumbVariants: Record<string, React.FC<BreadcrumbProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type BreadcrumbVariantType = keyof typeof BreadcrumbVariants;
