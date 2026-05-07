import React from "react";
import { FeaturedCollectionGridProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all FeaturedCollectionGrid variants
 */
export const FeaturedCollectionGridVariants: Record<
  string,
  React.FC<FeaturedCollectionGridProps>
> = {
  v1: V1,
  default: V1,
};

export type FeaturedCollectionGridVariantType =
  keyof typeof FeaturedCollectionGridVariants;
