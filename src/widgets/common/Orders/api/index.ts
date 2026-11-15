/**
 * Backwards-compatible thin wrappers over the centralised order service.
 *
 * New code should import directly from `@/services/order.service`.
 */

import {
  getOrderById,
  getOrdersList as getOrdersListService,
  type OrderApiResponse,
  type OrderListResponse,
} from "@/services/order.service";

export type { OrderApiResponse, OrderListResponse };

export interface OrdersListParams {
  page?: number;
  limit?: number;
  requestId?: string;
  customerId?: string;
  phone: string;
  gkAccessToken?: string;
}

export interface OrderDetailsParams {
  orderId: string;
  requestId?: string;
  customerId?: string;
  phone?: string;
  accessToken?: string;
}

export interface OrderListPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getOrdersList = async (
  params: OrdersListParams
): Promise<OrderListResponse | null> => {
  return getOrdersListService({
    page: params.page,
    limit: params.limit,
    requestId: params.requestId,
    customerId: params.customerId,
    phone: params.phone,
    accessToken: params.gkAccessToken,
  });
};

export const getOrderDetails = async (
  params: OrderDetailsParams
): Promise<OrderApiResponse | null> => {
  return getOrderById({
    orderId: params.orderId,
    requestId: params.requestId,
    customerId: params.customerId,
    phone: params.phone,
    accessToken: params.accessToken,
  });
};
