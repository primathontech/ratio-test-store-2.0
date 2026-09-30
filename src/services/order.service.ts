/**
 * Order service — all order/tracking/EDD endpoints.
 *
 * Owns the `OrderApiResponse`, `EDDResponse`, `OrderListResponse`, and related
 * types so any caller (ThankYou, OrderDetails, Orders history, checkout EDD
 * call) can import a single canonical definition.
 */

import { getCommerceClient } from "@/config/commerce";
import {
  buildAuthHeaders,
  getMerchantId,
  resolveAccessToken,
  resolvePhone,
} from "./_helpers";

// ─── Shared base URLs ──────────────────────────────────────────────────────

function getOrderHistoryBaseUrl(): string {
  return process.env.NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL || "";
}

function getCartBaseUrl(): string {
  return process.env.NEXT_PUBLIC_CUSTOM_API_CART_URL || "";
}

function getOrderTrackingBaseUrl(): string {
  return process.env.NEXT_PUBLIC_CUSTOM_API_ORDER_TRACKING_URL || "";
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface AddressInfo {
  city: string;
  email: string;
  phone: string;
  state: string;
  address: string;
  address1: string;
  address2: string;
  province: string;
  last_name: string;
  first_name: string;
  postal_code: string;
}

export type TrackingStatusValue =
  | "PENDING"
  | "CONFIRMED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RTO";

export interface TrackingHistoryItem {
  edd: string;
  event: string;
  order: number;
  status: TrackingStatusValue | string;
  location: string | null;
  awbNumber: string | null;
  updatedAt: string;
  bufferHours: number;
  courierName: string;
  webhookSource: string | null;
  statusDate: string | null;
}

export interface Tracking {
  orderId: string;
  orderNumber: string;
  pickupPincode: string;
  deliveryPincode: string;
  status: TrackingStatusValue;
  edd: string;
  deliveryPartner: "shiprocket" | string;
  bufferHours: number;
  createdAt: string;
  updatedAt: string;
  history: TrackingHistoryItem[];
}

export interface EDDResponse {
  orderId: string;
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  edd: string;
  deliveryPartner: string;
  statusDate: string;
  history?: TrackingHistoryItem[];
}

export interface OrderApiResponse {
  order: {
    id: string;
    email?: string;
    status: string;
    cancel_reason: null | string;
    cancel_reason_text?: null | string;
    line_items: Array<{
      id: string;
      title: string;
      price: string;
      price_set: {
        shop_money: {
          amount: string;
          currency_code: string;
        };
      };
      product_id: string;
      productHandle: string;
      current_quantity: number;
      quantity: number;
      variant_id: string;
      variant_title?: string;
      image?: string;
      sku?: string;
    }>;
    shipping_address?: AddressInfo;
    billing_address?: AddressInfo;
    currency: string;
    payment_status: string;
    total_price: string;
    subtotal_price: string;
    total_tax: string;
    total_outstanding: string;
    total_discount: string;
    created_at: string;
    updated_at: string;
    name: string;
    external_order_name?: string | null;
    external_order_number?: string | null;
    order_number: string;
    processed_at?: string;
    fulfillment_status: string;
    shipping_lines: Array<{
      code: string;
      price: number;
      title: string;
      is_removed?: boolean;
    }>;
    shipping_total?: string;
    discount_applications: any[];
    other_charges_breakdown?: Array<{
      type: string;
      label: string;
      amount: number;
    }>;
    total_mrp: string;
    customer?: any;
    tracking?: Tracking;
    total_line_items_price: string;
  };
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

export interface CancellableResponse {
  eligible: boolean;
  reason?: string;
  cancellationReasonList?: string[];
  [key: string]: unknown;
}

export interface CancelOrderRequest {
  reason: string;
  cancelReasonText?: string;
}

// ─── Calls ─────────────────────────────────────────────────────────────────

export interface GetOrderByIdParams {
  orderId: string;
  requestId?: string;
  customerId?: string;
  phone?: string;
  accessToken?: string | null;
}

/**
 * Fetch a single order's full details. Used by the thank-you and
 * order-details pages.
 */
export async function getOrderById(
  params: GetOrderByIdParams
): Promise<OrderApiResponse | null> {
  const baseURL = getOrderHistoryBaseUrl();
  if (!params.orderId || !baseURL) {
    return null;
  }

  const headers = buildAuthHeaders({
    accessToken: params.accessToken,
    phone: resolvePhone(params.phone),
    requestId: params.requestId,
    customerId: params.customerId,
  });

  try {
    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url: `${baseURL}/auth/customers/orders/${params.orderId}`,
      method: "GET",
      headers,
    });
    // Upstream sometimes wraps as `{ data: { order: ... } }`; unwrap inline.
    const payload = response.data as any;
    return (payload?.data ?? payload) as OrderApiResponse | null;
  } catch (error) {
    console.error("Order fetch error:", error);
    return null;
  }
}

export interface GetOrdersListParams {
  page?: number;
  limit?: number;
  requestId?: string;
  customerId?: string;
  phone: string;
  accessToken?: string | null;
}

/**
 * Fetch the customer's order history with pagination.
 */
export async function getOrdersList(
  params: GetOrdersListParams
): Promise<OrderListResponse | null> {
  const baseURL = getOrderHistoryBaseUrl();
  if (!params.phone || !baseURL) {
    return null;
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const url = `${baseURL}/auth/customers/orders?page=${page}&limit=${limit}&tracking=true`;

  const headers = buildAuthHeaders({
    accessToken: params.accessToken,
    phone: params.phone,
    requestId: params.requestId,
    customerId: params.customerId,
  });

  try {
    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url,
      method: "GET",
      headers,
    });
    // Upstream sometimes wraps as `{ data: { orders, pagination } }`.
    const payload = response.data as any;
    return (payload?.data ?? payload) as OrderListResponse | null;
  } catch (error) {
    console.error("Orders list fetch error:", error);
    return null;
  }
}

/**
 * Fetch tracking / EDD information for an order.
 */
export async function getOrderTracking(
  orderId: string,
  options: { getHistory?: boolean } = {}
): Promise<EDDResponse | null> {
  const baseURL = getOrderTrackingBaseUrl();
  if (!orderId || !baseURL) {
    return null;
  }

  const getHistory = options.getHistory ?? true;
  const url = `${baseURL}/api/v1/order-tracking/${orderId}?getHistory=${getHistory}`;

  try {
    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url,
      method: "GET",
      headers: {
        accept: "application/json",
        "gk-merchant-id": getMerchantId(),
      },
    });
    // Upstream may return either a flat EDD or `{ data: EDD }`; unwrap inline.
    const payload = response.data as any;
    return (payload?.data ?? payload) as EDDResponse | null;
  } catch (error) {
    console.error("Order tracking fetch error:", error);
    return null;
  }
}

export interface CreateEDDParams {
  orderNumber: string;
  deliveryPincode: string;
}

/**
 * Seed the order-tracking record (Estimated Delivery Date) right after a
 * successful checkout. Fire-and-forget at the call site — never throws.
 */
export async function createEDDForOrder(
  params: CreateEDDParams
): Promise<unknown> {
  const baseURL = getOrderTrackingBaseUrl();
  if (!params.orderNumber || !params.deliveryPincode || !baseURL) {
    return null;
  }

  try {
    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url: `${baseURL}/api/v1/order-tracking`,
      method: "POST",
      headers: {
        accept: "application/json",
        "gk-merchant-id": getMerchantId(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderNumber: params.orderNumber,
        deliveryPincode: params.deliveryPincode,
      }),
    });
    return response.data ?? null;
  } catch (error) {
    console.error("EDD creation error:", error);
    return null;
  }
}

/**
 * Check whether a given order is still cancellable.
 *
 * In the browser, this goes through the BFF proxy `/api/v1/orders/:id/cancellable`
 * to sidestep CORS on the upstream cart API. On the server, it calls the
 * upstream directly using the same code path as before.
 */
export async function isOrderCancellable(
  orderId: string,
  accessToken?: string | null
): Promise<CancellableResponse | null> {
  if (!orderId) {
    return null;
  }

  const token = resolveAccessToken(accessToken);
  if (!token) {
    return null;
  }

  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/cancellable`, {
        method: "GET",
        headers: {
          accept: "*/*",
          "gk-access-token": token,
        },
      });
      if (!res.ok) {
        return null;
      }
      return (await res.json()) as CancellableResponse;
    } catch (error) {
      console.error("Cancellable check error:", error);
      return null;
    }
  }

  const baseURL = getCartBaseUrl();
  if (!baseURL) {
    return null;
  }

  try {
    const client = getCommerceClient();
    const response = await client.fetchRequest({
      url: `${baseURL}/api/v1/auth/customers/orders/${orderId}/cancellable`,
      method: "GET",
      headers: {
        accept: "*/*",
        "gk-merchant-id": getMerchantId(),
        "gk-access-token": token,
      },
    });
    return (response.data as CancellableResponse) ?? null;
  } catch (error) {
    console.error("Cancellable check error:", error);
    return null;
  }
}

/**
 * Cancel an order. Throws on failure so the caller can surface the error.
 */
export async function cancelOrder(
  orderId: string,
  request: CancelOrderRequest,
  accessToken?: string | null
): Promise<unknown> {
  if (!orderId) {
    throw new Error("orderId is required");
  }

  const token = resolveAccessToken(accessToken);
  if (!token) {
    throw new Error("Access token is required");
  }

  const requestBody: Record<string, unknown> = {
    status: "cancelled",
    reason: request.reason,
  };
  if (request.reason === "Other" && request.cancelReasonText) {
    requestBody.cancelReasonText = request.cancelReasonText;
  } else if (request.cancelReasonText) {
    requestBody.cancelReasonText = request.cancelReasonText;
  }

  if (typeof window !== "undefined") {
    const res = await fetch(`/api/v1/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "gk-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!res.ok) {
      const errPayload = await res.json().catch(() => ({}));
      throw new Error(
        (errPayload as { error?: string })?.error ||
          `Failed to cancel order (${res.status})`
      );
    }
    return await res.json().catch(() => null);
  }

  const baseURL = getCartBaseUrl();
  if (!baseURL) {
    throw new Error("Cart API base URL is not configured");
  }

  const client = getCommerceClient();
  const response = await client.fetchRequest({
    url: `${baseURL}/api/v1/auth/customers/orders/${orderId}/cancel`,
    method: "POST",
    headers: {
      accept: "*/*",
      "gk-merchant-id": getMerchantId(),
      "gk-access-token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  return response.data ?? null;
}
