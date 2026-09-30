import {
  FulfillmentStatus,
  FulfillmentUIStatus,
  OrderStatus,
  PaymentStatus,
  PaymentUIStatus,
  TrackingStatus,
  TrackingUIStatus,
} from "../enums";

export function getPaymentUIStatus(payment_status: string): string {
  switch (payment_status as PaymentStatus) {
    case PaymentStatus.PENDING:
      return PaymentUIStatus.COD;
    case PaymentStatus.AUTHORIZED:
      return PaymentUIStatus.AUTHORIZED;
    case PaymentStatus.DUE:
      return PaymentUIStatus.DUE;
    case PaymentStatus.EXPIRING:
      return PaymentUIStatus.EXPIRING;
    case PaymentStatus.EXPIRED:
      return PaymentUIStatus.EXPIRED;
    case PaymentStatus.PAID:
      return PaymentUIStatus.PREPAID;
    case PaymentStatus.REFUNDED:
      return PaymentUIStatus.REFUNDED;
    case PaymentStatus.PARTIALLY_REFUNDED:
      return PaymentUIStatus.PARTIALLY_REFUNDED;
    case PaymentStatus.PARTIALLY_PAID:
      return PaymentUIStatus.PARTIALLY_PAID;
    case PaymentStatus.VOIDED:
      return PaymentUIStatus.VOIDED;
    case PaymentStatus.UNPAID:
      return PaymentUIStatus.UNPAID;
    default:
      return PaymentUIStatus.PROCESSING;
  }
}

export function getOrderUIStatus(
  status: string,
  fulfillmentStatus: string
): string {
  if (status === OrderStatus.CANCELLED) {
    return FulfillmentUIStatus.CANCELLED;
  }

  switch (fulfillmentStatus as FulfillmentStatus) {
    case FulfillmentStatus.FULFILLED:
      return FulfillmentUIStatus.DELIVERED;
    case FulfillmentStatus.PARTIALLY_FULFILLED:
      return FulfillmentUIStatus.PARTIALLY_SHIPPED;
    case FulfillmentStatus.IN_PROGRESS:
      return FulfillmentUIStatus.PREPARING;
    case FulfillmentStatus.ON_HOLD:
      return FulfillmentUIStatus.ON_HOLD;
    case FulfillmentStatus.SCHEDULED:
      return FulfillmentUIStatus.SCHEDULED;
    case FulfillmentStatus.UNFULFILLED:
      return FulfillmentUIStatus.ORDER_PLACED;
    case FulfillmentStatus.RETURNED:
      return FulfillmentUIStatus.RETURNED;
    default:
      return FulfillmentUIStatus.PROCESSING;
  }
}

export function getTrackingUIStatus(
  trackingStatus: TrackingStatus | string
): string {
  switch (trackingStatus as TrackingStatus) {
    case TrackingStatus.PENDING:
      return TrackingUIStatus.PENDING;
    case TrackingStatus.CONFIRMED:
      return TrackingUIStatus.CONFIRMED;
    case TrackingStatus.SHIPPED:
      return TrackingUIStatus.SHIPPED;
    case TrackingStatus.IN_TRANSIT:
      return TrackingUIStatus.IN_TRANSIT;
    case TrackingStatus.OUT_FOR_DELIVERY:
      return TrackingUIStatus.OUT_FOR_DELIVERY;
    case TrackingStatus.DELIVERED:
      return TrackingUIStatus.DELIVERED;
    case TrackingStatus.CANCELLED:
      return TrackingUIStatus.CANCELLED;
    case TrackingStatus.RTO:
      return TrackingUIStatus.RTO;
    default:
      return trackingStatus;
  }
}

// Re-export enums for backward compatibility
export { TrackingStatus };
