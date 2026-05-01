import { WidgetProps } from "@/widgets/types";

export interface ThankYouSettings {
  variant?: "v1";
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

export interface ThankYouData {
  orderData?: OrderApiResponse;
}

export type ThankYouProps = WidgetProps<ThankYouData, ThankYouSettings>;

export enum TrackingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_TRANSIT = "IN_TRANSIT",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RTO = "RTO",
}

export enum OtherChargeType {
  SHIPPING_CHARGES = "shipping_charges",
  CASHON_DELIVERY_FEE = "cashon_delivery_fee",
  PLATFORM_FEE = "platform_charges",
  PREPAID_DISCOUNT = "prepaid_discount",
}

interface TrackingHistoryItem {
  edd: string;
  event: string;
  order: number;
  status: TrackingStatus | string;
  location: string | null;
  awbNumber: string | null;
  updatedAt: string;
  bufferHours: number;
  courierName: string;
  webhookSource: string | null;
  statusDate: string | null;
}

interface Tracking {
  orderId: string;
  orderNumber: string;
  pickupPincode: string;
  deliveryPincode: string;
  status: TrackingStatus;
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
