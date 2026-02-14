import { V1 } from "./V1";
import { V2 } from "./V2";

export const ProductGridVariants = {
  v1: V1,
  v2: V2,
  default: V1, // fallback
};

export type ProductGridVariantType = keyof typeof ProductGridVariants;
