import { WidgetProps } from "@/widgets/types";

// Re-export shared API types from the service so widgets and other callers
// import a single canonical definition.
export type {
  OrderApiResponse,
  AddressInfo,
  EDDResponse,
} from "@/services/order.service";

export interface ThankYouSettings {
  variant?: "v1";
}

export interface ThankYouData {
  orderData?: import("@/services/order.service").OrderApiResponse;
}

export type ThankYouProps = WidgetProps<ThankYouData, ThankYouSettings>;

// TrackingStatus stays an enum (used as values for switch/comparison).
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
