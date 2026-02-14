"use client";

import React from "react";
import { ThankYouProps } from "./types";
import { ThankYouVariants } from "./variants";

export const ThankYou: React.FC<ThankYouProps> = (props) => {
  const { settings = {}, ...restProps } = props;
  const variant = settings.variant || "v1";

  const VariantComponent =
    ThankYouVariants[variant as keyof typeof ThankYouVariants] ||
    ThankYouVariants.default;

  return <VariantComponent {...restProps} settings={settings} />;
};

export default ThankYou;
