"use client";

import React from "react";

interface OrderStatus {
  status: string;
  date: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface TrackingSectionProps {
  statuses: OrderStatus[];
  isCancelled?: boolean;
  orderStatus?: string;
}

export const TrackingSection: React.FC<TrackingSectionProps> = ({
  statuses,
  orderStatus,
}) => {
  if (!statuses || statuses.length === 0) {
    return null;
  }

  const gapClass = orderStatus === "Cancelled" ? "gap-56 ml-12" : "gap-36";
  const lineWidth = orderStatus === "Cancelled" ? "20rem" : "15rem";

  return (
    <div data-testid="tracking-section-container" className="mb-6 w-fit">
      <div data-testid="tracking-section-wrapper" className="relative w-fit">
        <div
          data-testid="tracking-section-statuses-container"
          className={`flex relative ${gapClass}`}
        >
          {statuses.map((statusItem, index) => {
            const isCompleted = statusItem.isCompleted;
            const isLast = index === statuses.length - 1;
            const nextStatus = !isLast ? statuses[index + 1] : null;
            const nextIsCompleted = nextStatus?.isCompleted ?? false;

            let dotStyle = "";
            if (
              orderStatus === "Cancelled" &&
              statusItem.status === "Cancelled"
            ) {
              dotStyle = "bg-red-600";
            } else if (isCompleted) {
              dotStyle = "bg-black";
            } else {
              dotStyle = "bg-white border-2 border-gray-300";
            }

            let lineColor = "";
            if (!isLast) {
              if (
                orderStatus === "Cancelled" &&
                nextStatus?.status === "Cancelled"
              ) {
                lineColor = "bg-red-600";
              } else if (isCompleted && nextIsCompleted) {
                lineColor = "bg-black";
              } else {
                lineColor = "bg-gray-300";
              }
            }

            return (
              <div
                key={index}
                data-testid={`tracking-section-status-${index}`}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  data-testid={`tracking-section-status-dot-${index}`}
                  className={`w-[16px] h-[16px] rounded-full ${dotStyle} relative z-10`}
                />

                {!isLast && (
                  <div
                    data-testid={`tracking-section-status-line-${index}`}
                    className={`absolute h-[3px] ${lineColor}`}
                    style={{
                      top: "14%",
                      left: "50%",
                      transform: "translateY(-50%)",
                      width: lineWidth,
                    }}
                  />
                )}

                <p
                  data-testid={`tracking-section-status-label-${index}`}
                  className={`text-[12px] mt-2 leading-none ${
                    orderStatus === "Cancelled" &&
                    statusItem.status === "Cancelled"
                      ? "font-medium text-red-600"
                      : isCompleted
                        ? "font-medium text-gray-600"
                        : "font-normal text-gray-400"
                  }`}
                >
                  {statusItem.status}
                </p>
                <p
                  data-testid={`tracking-section-status-date-${index}`}
                  className={`text-[11px] mt-1 leading-none ${
                    isCompleted ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {statusItem.date || ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
