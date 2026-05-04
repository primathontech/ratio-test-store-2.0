"use client";

import React from "react";
import { AddressesProps } from "./types";
import { AddressesVariants } from "./variants";

export const Addresses: React.FC<AddressesProps> = (props) => {
  const { settings = {}, ...restProps } = props;
  const variant = settings.variant || "v1";

  const VariantComponent =
    AddressesVariants[variant as keyof typeof AddressesVariants] ||
    AddressesVariants.default;

  return <VariantComponent {...restProps} settings={settings} />;
};

export default Addresses;
