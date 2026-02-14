import React from "react";
import { Props } from "./types";
import { Variants, VariantType } from "./variants";

export const ShopByCategory: React.FC<Props> = (props) => {
  const { settings } = props;
  const { variant = "v1" } = settings;

  const VariantComponent = Variants[variant as VariantType] || Variants.default;

  return <VariantComponent {...props} />;
};

export default ShopByCategory;
