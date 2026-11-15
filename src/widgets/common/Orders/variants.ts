import { OrdersVariant } from "./types";
import { OrdersV1 } from "./V1";

export const OrdersVariants = {
  [OrdersVariant.V1]: OrdersV1,
  default: OrdersV1,
} as const;
