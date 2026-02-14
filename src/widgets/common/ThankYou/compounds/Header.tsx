import React from "react";
import { OrderApiResponse } from "../types";

interface HeaderProps {
  order?: OrderApiResponse["order"];
}

export const Header: React.FC<HeaderProps> = ({ order }) => {
  if (!order) return null;

  return (
    <div className="mb-8">
      {/* Order Details Grid */}
      <div className="border rounded-[8px] border-[#d6d6d6]">
        <div className="flex justify-between p-[14px] border-b border-[#d6d6d6]">
          <span className="text-black text-[14px] font-semibold">
            Order Date:
          </span>
          <span className="ml-2 text-black text-[14px]">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between p-[14px] border-b border-[#d6d6d6]">
          <span className="text-black text-[14px] font-semibold flex flex-col">
            Delivery Estimate:
            <span className="text-[12px] text-[#666]">
              Standard delivery time is within 3-5 days
            </span>
          </span>
          <span className="ml-2 text-black text-[14px]">
            {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-US",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </span>
        </div>
        <p className="text-[12px] md:text-[14px] italic bg-[#ededed] text-[#666] p-[14px]">
          ⓘ Please note that once your order is packed, it cannot be cancelled.
          For further queries, reach out to our Customer Support.
        </p>
      </div>

      {/* Status */}
      <div className="mt-[21px] flex items-start bg-white rounded-[8px] p-[21px]">
        <div className="text-[#707070]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] text-black font-medium">Confirmed</span>
          <span className="text-[12px] text-[#707070]">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
