"use client";

import React from "react";
import { OrdersProps } from "./types";
import { OrdersVariants } from "./variants";

export const Orders: React.FC<OrdersProps> = (props) => {
  const { settings = {}, ...restProps } = props;
  const variant = settings.variant || "v1";

  const VariantComponent =
    OrdersVariants[variant as keyof typeof OrdersVariants] ||
    OrdersVariants.default;

  return <VariantComponent {...restProps} settings={settings} />;
};

export default Orders;
