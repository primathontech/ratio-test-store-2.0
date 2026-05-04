"use client";

import React from "react";
import { AccountProps, AccountVariant } from "./types";
import { AccountVariants } from "./variants";

export const Account: React.FC<AccountProps> = (props) => {
  const { settings = {}, ...restProps } = props;
  const variant = settings.variant ?? AccountVariant.V1;

  const VariantComponent =
    AccountVariants[variant as keyof typeof AccountVariants] ||
    AccountVariants.default;

  return <VariantComponent {...restProps} settings={settings} />;
};

export default Account;
