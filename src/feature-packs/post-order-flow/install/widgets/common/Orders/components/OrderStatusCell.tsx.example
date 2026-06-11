"use client";

import React from "react";
import { OrderApiResponse } from "../types";
import { getTrackingUIStatus, TrackingStatus } from "../utils";

interface CancellationEligibility {
  eligible: boolean;
  loading: boolean;
  error: string | null;
}

interface OrderStatusCellProps {
  order: OrderApiResponse["order"];
  eligibility?: CancellationEligibility;
  onCancelOrder: (orderId: string) => void;
  isCancelling?: boolean;
  isModalOpen?: boolean;
}

export const OrderStatusCell: React.FC<OrderStatusCellProps> = ({
  order,
  eligibility,
  onCancelOrder,
  isCancelling = false,
  isModalOpen = false,
}) => {
  const trackingStatus = order.tracking?.status as TrackingStatus;
  const orderStatus = getTrackingUIStatus(trackingStatus);

  if (trackingStatus === TrackingStatus.CANCELLED) {
    return <span className="text-[14px] text-[#ec002b]">{orderStatus}</span>;
  }

  if (eligibility?.loading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-600">
        <div className="size-[20px] border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (isCancelling || isModalOpen) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-600">
        <div className="size-[20px] border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (eligibility?.eligible) {
    return (
      <button
        onClick={() => onCancelOrder(order.id)}
        className="transition-colors text-[14px] bg-black py-[4px] px-[10px] rounded-[5px] text-white font-normal hover:shadow-[0px_0px_10px_#0000007a]"
      >
        Cancel
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end md:items-center gap-1">
      <span
        className={`text-sm md:text-base ${
          orderStatus === "Cancelled"
            ? "text-red-600"
            : orderStatus === "Delivered"
              ? "text-black"
              : "text-gray-700"
        }`}
      >
        {orderStatus}
      </span>
      {eligibility?.error && <div className="text-xs text-red-500">Error</div>}
    </div>
  );
};
