import React from "react";
import { CollectionGridProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CollectionGrid variants
 */
export const CollectionGridVariants: Record<
  string,
  React.FC<CollectionGridProps>
> = {
  v1: V1,
  default: V1,
};

export type CollectionGridVariantType = keyof typeof CollectionGridVariants;
