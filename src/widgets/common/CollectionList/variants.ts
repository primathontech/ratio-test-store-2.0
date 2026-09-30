import React from "react";
import { CollectionListProps } from "./types";
import { V1 } from "./V1";

export const CollectionListVariants: Record<
  string,
  React.FC<CollectionListProps>
> = {
  v1: V1,
  default: V1,
};

export type CollectionListVariantType = keyof typeof CollectionListVariants;
