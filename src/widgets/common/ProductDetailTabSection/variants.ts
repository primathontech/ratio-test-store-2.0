import { V1 } from "./V1";

export const ProductDetailTabSectionVariant = {
  v1: V1,
  default: V1, // fallback
};

export type ProductDetailTabSectionVariantType =
  keyof typeof ProductDetailTabSectionVariant;
