import React from "react";
import { LoadMorePaginationProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all LoadMorePagination variants
 */
export const LoadMorePaginationVariants: Record<
  string,
  React.FC<LoadMorePaginationProps>
> = {
  v1: V1,
  default: V1,
};

export type LoadMorePaginationVariantType =
  keyof typeof LoadMorePaginationVariants;
