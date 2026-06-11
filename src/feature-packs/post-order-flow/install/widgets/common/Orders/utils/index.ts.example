export function getPaymentUIStatus(payment_status: string) {
  switch (payment_status) {
    case "pending":
      return "COD";
    case "authorized":
      return "Authorized";
    case "due":
      return "Due";
    case "expiring":
      return "Expiring";
    case "expired":
      return "Expired";
    case "paid":
      return "Prepaid";
    case "refunded":
      return "Refunded";
    case "partially_refunded":
      return "Partially refunded";
    case "partially_paid":
      return "Partially paid";
    case "voided":
      return "Voided";
    case "unpaid":
      return "Unpaid";
    default:
      return "Processing";
  }
}

export function getOrderUIStatus(status: string, fulfillmentStatus: string) {
  if (status === "cancelled") {
    return "Cancelled";
  }

  switch (fulfillmentStatus) {
    case "fulfilled":
      return "Delivered";
    case "partially_fulfilled":
      return "Partially Shipped";
    case "in_progress":
      return "Preparing";
    case "on_hold":
      return "On Hold";
    case "scheduled":
      return "Scheduled";
    case "unfulfilled":
      return "Order Placed";
    case "returned":
      return "Returned";
    default:
      return "Processing";
  }
}

export enum TrackingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export function getTrackingUIStatus(trackingStatus: TrackingStatus | string) {
  switch (trackingStatus) {
    case TrackingStatus.PENDING:
      return "Pending";
    case TrackingStatus.CONFIRMED:
      return "Confirmed";
    case TrackingStatus.SHIPPED:
      return "Shipped";
    case TrackingStatus.DELIVERED:
      return "Delivered";
    case TrackingStatus.CANCELLED:
      return "Cancelled";
    default:
      return trackingStatus;
  }
}

export const formatPaiseToINR = (amountInPaise: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amountInPaise / 100);

export const FALLBACK_VALUE = "--";

export function formatPaiseToINRSafe(input?: string | number | null): string {
  if (input === null || input === undefined || input === "") {
    return FALLBACK_VALUE;
  }
  const num = typeof input === "number" ? input : parseFloat(String(input));
  if (!Number.isFinite(num)) {
    return FALLBACK_VALUE;
  }
  return `₹${(num / 100).toFixed(2)}`;
}

export function formatRupeesSafe(input?: number | null): string {
  if (input === null || input === undefined || !Number.isFinite(input)) {
    return FALLBACK_VALUE;
  }
  return `₹${input.toFixed(2)}`;
}

export function formatDateSafe(
  input: string | number | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
  locale: string = "en-US"
): string {
  if (input === null || input === undefined || input === "") {
    return FALLBACK_VALUE;
  }
  const date = new Date(input);
  if (!Number.isFinite(date.getTime())) {
    return FALLBACK_VALUE;
  }
  return date.toLocaleDateString(locale, options);
}
