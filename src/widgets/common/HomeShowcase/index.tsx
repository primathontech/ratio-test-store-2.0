import React from "react";
import { HomeShowcaseProps } from "./types";
import { HomeShowcaseVariants } from "./variants";

/**
 * HomeShowcase Widget
 *
 * A generic, merchant-agnostic store home: hero → trust badges → featured
 * products → shop-by-collection. All content is fetched from the configured
 * merchant's own catalog, so it works for any merchant id without code changes.
 */
export function HomeShowcase(props: HomeShowcaseProps) {
  const variant = props.settings?.variant || "v1";
  const VariantComponent =
    HomeShowcaseVariants[variant as keyof typeof HomeShowcaseVariants] ||
    HomeShowcaseVariants.default;
  return <VariantComponent {...props} />;
}

export default HomeShowcase;
