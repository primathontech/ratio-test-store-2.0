/**
 * Comprehensive enums for Orders widget
 * Centralizes all status types and constants
 */

// Payment Status Enum
export enum PaymentStatus {
  PENDING = "pending",
  AUTHORIZED = "authorized",
  DUE = "due",
  EXPIRING = "expiring",
  EXPIRED = "expired",
  PAID = "paid",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
  PARTIALLY_PAID = "partially_paid",
  VOIDED = "voided",
  UNPAID = "unpaid",
}

// Payment UI Status Enum (what users see)
export enum PaymentUIStatus {
  COD = "COD",
  AUTHORIZED = "Authorized",
  DUE = "Due",
  EXPIRING = "Expiring",
  EXPIRED = "Expired",
  PREPAID = "Prepaid",
  REFUNDED = "Refunded",
  PARTIALLY_REFUNDED = "Partially refunded",
  PARTIALLY_PAID = "Partially paid",
  VOIDED = "Voided",
  UNPAID = "Unpaid",
  PROCESSING = "Processing",
}

// Order Status Enum
export enum OrderStatus {
  OPEN = "open",
  CLOSED = "closed",
  CANCELLED = "cancelled",
  ARCHIVED = "archived",
}

// Fulfillment Status Enum
export enum FulfillmentStatus {
  FULFILLED = "fulfilled",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  IN_PROGRESS = "in_progress",
  ON_HOLD = "on_hold",
  SCHEDULED = "scheduled",
  UNFULFILLED = "unfulfilled",
  RETURNED = "returned",
}

// Fulfillment UI Status Enum (what users see)
export enum FulfillmentUIStatus {
  DELIVERED = "Delivered",
  PARTIALLY_SHIPPED = "Partially Shipped",
  PREPARING = "Preparing",
  ON_HOLD = "On Hold",
  SCHEDULED = "Scheduled",
  ORDER_PLACED = "Order Placed",
  RETURNED = "Returned",
  CANCELLED = "Cancelled",
  PROCESSING = "Processing",
}

// Tracking Status Enum (consolidated from different sources)
export enum TrackingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  IN_TRANSIT = "IN_TRANSIT",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RTO = "RTO",
}

// Tracking UI Status Enum (what users see)
export enum TrackingUIStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  SHIPPED = "Shipped",
  IN_TRANSIT = "In Transit",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
  RTO = "RTO",
}

// Tracking Event Enum
export enum TrackingEvent {
  INITIAL_EDD_CALCULATED = "INITIAL_EDD_CALCULATED",
  PICKUP_SCHEDULED = "PICKUP_SCHEDULED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  RTO_INITIATED = "RTO_INITIATED",
  CANCELLED = "CANCELLED",
}

// Cancellation Reason Enum
export enum CancellationReason {
  CHANGED_MIND = "Changed my mind",
  FOUND_BETTER_PRICE = "Found better price elsewhere",
  ORDERED_BY_MISTAKE = "Ordered by mistake",
  DELIVERY_TOO_SLOW = "Delivery taking too long",
  PRODUCT_NOT_NEEDED = "Product no longer needed",
  OTHERS = "Others",
}

// Cancellation Reason API Value Enum (value sent/stored on the backend for "Others")
export enum CancellationReasonApiValue {
  OTHER = "Other",
}

// API Response Status Enum
export enum ApiResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
  LOADING = "loading",
}

// Modal Step Enum
export enum ModalStep {
  CONFIRMATION = "confirmation",
  REASON_SELECTION = "reason-selection",
}

// Other Charge Type Enum
export enum OtherChargeType {
  SHIPPING_CHARGES = "shipping_charges",
  CASHON_DELIVERY_FEE = "cashon_delivery_fee",
  PLATFORM_FEE = "platform_charges",
  PREPAID_DISCOUNT = "prepaid_discount",
}
