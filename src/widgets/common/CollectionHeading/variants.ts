import React from "react";
import { CollectionHeadingProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CollectionHeading variants
 */
export const CollectionHeadingVariants: Record<
  string,
  React.FC<CollectionHeadingProps>
> = {
  v1: V1,
  default: V1, // fallback variant
};

export type CollectionHeadingVariantType =
  keyof typeof CollectionHeadingVariants;
