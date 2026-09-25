import React from "react";
import { CollectionHeaderProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all CollectionHeader variants
 */
export const CollectionHeaderVariants: Record<
  string,
  React.FC<CollectionHeaderProps>
> = {
  v1: V1,
  default: V1,
};

export type CollectionHeaderVariantType = keyof typeof CollectionHeaderVariants;
