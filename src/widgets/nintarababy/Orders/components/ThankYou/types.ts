import { OrderApiResponse } from "../../types";

export interface EDDResponse {
  orderId: string;
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  edd: string;
  deliveryPartner: string;
  statusDate: string;
  history?: TrackingHistoryItem[];
}

interface TrackingHistoryItem {
  edd: string;
  event: string;
  order: number;
  status: string;
  location: string | null;
  awbNumber: string | null;
  updatedAt: string;
  bufferHours: number;
  courierName: string;
  webhookSource: string | null;
  statusDate: string | null;
}

export type { OrderApiResponse };
