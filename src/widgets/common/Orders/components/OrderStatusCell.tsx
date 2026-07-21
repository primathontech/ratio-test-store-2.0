"use client";

import React from "react";
import { OrderApiResponse } from "../../ThankYou/types";
import { OrderStatus } from "../enums";
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
  // Use tracking status if available, otherwise fallback to order status
  const trackingStatus = order.tracking?.status as TrackingStatus;
  const orderStatus = getTrackingUIStatus(trackingStatus);

  // Step 1: Check if order is already cancelled - if yes, show "Cancelled" only (no API call needed)
  if (order.status === OrderStatus.CANCELLED) {
    return <span className="text-sm text-[#ec002b]">Cancelled</span>;
  }

  // Step 2: For non-cancelled orders, check API response
  // Show loading while checking cancellation eligibility
  if (eligibility?.loading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-600">
        <div className="size-5 border-2 border-[#ccc] border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  // Show loading while cancelling or modal is open
  if (isCancelling || isModalOpen) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-600">
        <div className="size-5 border-2 border-[#ccc] border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  // Step 3: Based on API response - if eligible, show Cancel button
  if (eligibility?.eligible) {
    return (
      <button
        onClick={() => onCancelOrder(order.id)}
        className="transition-colors text-sm bg-black py-1.5 px-4 rounded-full text-white font-medium hover:bg-neutral-800"
      >
        Cancel
      </button>
    );
  }

  // Step 4: If not eligible or API failed, show order status (pending, delivered, shipped, etc.)
  return (
    <div className="flex flex-col items-end md:items-center gap-1">
      <span
        className={`text-xs md:text-base ${
          orderStatus === "Cancelled"
            ? "text-cancel-text md:text-red-600"
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
