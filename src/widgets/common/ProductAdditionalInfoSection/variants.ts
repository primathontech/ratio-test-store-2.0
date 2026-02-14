import { V1 } from "./V1";

export const ProductAdditionalInfoSectionVariant = {
  v1: V1,
  default: V1, // fallback
};

export type ProductAdditionalInfoSectionType =
  keyof typeof ProductAdditionalInfoSectionVariant;
