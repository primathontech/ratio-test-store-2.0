import React from "react";
import { ProductGalleryProps } from "./types";
import { V1 } from "./V1";

/**
 * Registry for all ProductGallery variants
 */
export const ProductGalleryVariants: Record<string, React.FC<ProductGalleryProps>> = {
  v1: V1,
  default: V1, // fallback variant
};

export type ProductGalleryVariantType = keyof typeof ProductGalleryVariants;
