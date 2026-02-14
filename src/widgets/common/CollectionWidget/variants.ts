import React from "react";
import { CollectionWidgetProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CollectionWidget variants
 */
export const CollectionWidgetVariants: Record<string, React.FC<CollectionWidgetProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type CollectionWidgetVariantType = keyof typeof CollectionWidgetVariants;
