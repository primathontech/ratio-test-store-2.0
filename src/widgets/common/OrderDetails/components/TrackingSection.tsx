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

  // Set gap based on order status: 360px devices = gap-20 (5rem), larger screens = gap-36/gap-56
  const gapClass =
    orderStatus === "Cancelled"
      ? "gap-20 sm:gap-56 ml-0 sm:ml-12"
      : "gap-20 sm:gap-36";

  // Line width: below 638px → 30vw, 638px–920px → 34vw, above 920px → capped by max
  const lineWidthClass =
    orderStatus === "Cancelled"
      ? "w-[clamp(7rem,20vw,17rem)] min-[638px]:w-[clamp(7rem,40vw,17rem)]"
      : "w-[clamp(8rem,20vw,12rem)] min-[638px]:w-[clamp(8rem,28vw,12rem)]";

  return (
    <div data-testid="tracking-section-container" className="mb-6 w-fit">
      <div data-testid="tracking-section-wrapper" className="relative w-fit">
        {/* Dots and labels container */}
        <div
          data-testid="tracking-section-statuses-container"
          className={`flex relative ${gapClass}`}
        >
          {statuses.map((statusItem, index) => {
            const isCompleted = statusItem.isCompleted;
            const isLast = index === statuses.length - 1;
            const nextStatus = !isLast ? statuses[index + 1] : null;
            const nextIsCompleted = nextStatus?.isCompleted ?? false;

            // Determine dot style
            let dotStyle = "";
            // Only show red dot if order status is cancelled AND this is a cancelled status
            if (
              orderStatus === "Cancelled" &&
              statusItem.status === "Cancelled"
            ) {
              dotStyle = "bg-cancel-text -ml-[42px]";
            } else if (isCompleted) {
              dotStyle = "bg-black";
            } else {
              // Pending status - hollow/unfilled dot
              dotStyle = "bg-white border-2 border-gray-300";
            }

            // Determine line color for segment after this dot
            let lineColor = "";
            if (!isLast) {
              // Use red line if order is cancelled and we're connecting to cancelled status
              if (
                orderStatus === "Cancelled" &&
                nextStatus?.status === "Cancelled"
              ) {
                lineColor = "bg-cancel-text";
              } else if (isCompleted && nextIsCompleted) {
                // Both completed - black line
                lineColor = "bg-black";
              } else {
                // At least one pending - gray line
                lineColor = "bg-gray-300";
              }
            }

            return (
              <div
                key={index}
                data-testid={`tracking-section-status-${index}`}
                className="flex flex-col items-center relative z-10"
              >
                {/* Dot */}
                <div
                  data-testid={`tracking-section-status-dot-${index}`}
                  className={`w-4 h-4 rounded-full ${dotStyle} relative z-10`}
                />

                {/* Line segment to next dot */}
                {!isLast && (
                  <div
                    data-testid={`tracking-section-status-line-${index}`}
                    className={`absolute h-[3px] ${lineColor} ${lineWidthClass}`}
                    style={{
                      top: "13%",
                      left: "63%",
                      transform: "translateY(-50%)",
                    }}
                  />
                )}

                {/* Labels */}
                <p
                  data-testid={`tracking-section-status-label-${index}`}
                  className={`text-xs mt-[15px] leading-none ${
                    isCompleted
                      ? "text-[#565959] font-bold"
                      : "font-normal text-gray-400"
                  }`}
                >
                  {statusItem.status}
                </p>
                <p
                  data-testid={`tracking-section-status-date-${index}`}
                  className={`text-xs mt-3 md:mt-2 leading-none ${
                    isCompleted ? "text-[#565959]" : "text-[#565959]"
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
