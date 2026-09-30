"use client";

import React from "react";
import { OrdersProps, OrdersVariant } from "./types";
import { OrdersVariants } from "./variants";

export const Orders: React.FC<OrdersProps> = (props) => {
  const { settings = {}, ...restProps } = props;
  const variant = settings.variant || OrdersVariant.V1;

  const VariantComponent = OrdersVariants[variant] || OrdersVariants.default;

  return <VariantComponent {...restProps} settings={settings} />;
};

export default Orders;
