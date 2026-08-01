"use client";

import React, { useState } from "react";
import { OrderApiResponse } from "./types";
import { RightSection } from "./RightSection";
import { formatPaiseToINRSafe } from "../../utils";

interface OrderSummaryAccordionProps {
  order?: OrderApiResponse["order"];
  className?: string;
}

export const OrderSummaryAccordion: React.FC<OrderSummaryAccordionProps> = ({
  order,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!order) {
    return null;
  }

  return (
    <div className={className}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between border-b border-[#d6d6d6] p-[21px]"
      >
        <div className="flex items-center space-x-2">
          <span className="text-[#005bd1] text-[14px] font-normal">
            {isExpanded ? "Hide order summary" : "Show order summary"}
          </span>
          <svg
            className={`size-[10px] text-[#005bd1] transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div className="text-[19px] text-black font-semibold">
          {formatPaiseToINRSafe(order.total_price)}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4">
          <RightSection order={order} className="!bg-transparent" />
        </div>
      </div>
    </div>
  );
};
