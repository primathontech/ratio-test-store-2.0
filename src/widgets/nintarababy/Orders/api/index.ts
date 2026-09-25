/**
 * API functions for Orders widget
 */

import { OrderApiResponse } from "../types";

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
  gkAccessToken?: string;
}

export interface OrderListPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface OrderListResponse {
  orders: OrderApiResponse[];
  pagination?: OrderListPagination;
}

/**
 * Fetches orders list with pagination
 */
export const getOrdersList = async (
  params: OrdersListParams
): Promise<OrderListResponse | null> => {
  try {
    const searchParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 10).toString(),
      phone: params.phone,
    });

    if (params.requestId) {
      searchParams.append("requestId", params.requestId);
    }
    if (params.customerId) {
      searchParams.append("customerId", params.customerId);
    }
    if (params.gkAccessToken) {
      searchParams.append("gkAccessToken", params.gkAccessToken);
    }

    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(`/api/v1/orders?${searchParams.toString()}`);

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching orders list:", error);
    return null;
  }
};

/**
 * Fetches single order details
 */
export const getOrderDetails = async (
  params: OrderDetailsParams
): Promise<OrderApiResponse | null> => {
  try {
    const searchParams = new URLSearchParams({
      orderId: params.orderId,
    });

    if (params.requestId) {
      searchParams.append("requestId", params.requestId);
    }
    if (params.customerId) {
      searchParams.append("customerId", params.customerId);
    }
    if (params.phone) {
      searchParams.append("phone", params.phone);
    }
    if (params.gkAccessToken) {
      searchParams.append("gkAccessToken", params.gkAccessToken);
    }

    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(`/api/v1/order?${searchParams.toString()}`);

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
};
