import { V1 } from "./V1";

export const ShopByConcernsVariant = {
  v1: V1,
  default: V1, // fallback
};

export type ShopByConcernsType = keyof typeof ShopByConcernsVariant;
