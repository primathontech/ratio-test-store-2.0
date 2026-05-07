import React from "react";
import { Props } from "./types";
import { Variants } from "./variants";

export const SEOMetadata: React.FC<Props> = (props) => {
  const { settings } = props;
  const variant = settings?.variant || "default";
  const VariantComponent = Variants[variant] || Variants.default;

  return <VariantComponent {...props} />;
};

export * from "./types";
