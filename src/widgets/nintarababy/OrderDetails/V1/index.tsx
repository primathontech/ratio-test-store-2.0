"use client";

import React from "react";
import { OrderDetailsView } from "../../Orders/components/OrderDetails";
import { OrderDetailsProps } from "../types";

export const OrderDetailsV1: React.FC<OrderDetailsProps> = () => {
  return <OrderDetailsView />;
};

export default OrderDetailsV1;
