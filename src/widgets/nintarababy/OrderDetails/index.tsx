"use client";

import React from "react";
import { OrderDetailsProps } from "./types";
import { OrderDetailsVariants } from "./variants";

export const OrderDetails: React.FC<OrderDetailsProps> = (props) => {
  const { settings = {}, ...restProps } = props;
  const variant = settings.variant || "v1";

  const VariantComponent =
    OrderDetailsVariants[variant as keyof typeof OrderDetailsVariants] ||
    OrderDetailsVariants.default;

  return <VariantComponent {...restProps} settings={settings} />;
};

export default OrderDetails;
