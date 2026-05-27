import SearchV1 from "./V1";

export const SearchVariants = {
  v1: SearchV1,
  default: SearchV1,
};

export type SearchVariantType = keyof typeof SearchVariants;
