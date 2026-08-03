import { V1 } from "./V1";

export const Variants = { v1: V1, default: V1 };

export type VariantType = keyof typeof Variants;
