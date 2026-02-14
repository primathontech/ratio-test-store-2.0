import React from "react";
import { OrderApiResponse } from "../types";
import Image from "next/image";
import { formatPaiseToINR } from "@/utils";

interface RightSectionProps {
  order?: OrderApiResponse["order"];
  className?: string;
}

export const RightSection: React.FC<RightSectionProps> = ({
  order,
  className,
}) => {
  if (!order) return null;

  return (
    <div
      className={`bg-white rounded-[8px] p-[21px] flex flex-col gap-[21px] ${className}`}
    >
      {/* Product List */}
      {order.line_items && order.line_items.length > 0 && (
        <div>
          {order.line_items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-[14px] mb-4">
              {/* Product Image */}
              <div className="relative">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="object-cover border rounded-[8px] border-[#d6d6d6]"
                  />
                )}
                {/* Quantity Badge */}
                <div className="absolute -top-[8px] -right-[8px] bg-black text-white font-bold text-[12px] size-[24px] flex items-center justify-center rounded-[8px]">
                  {item.quantity}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h4 className="text-[14px] text-black font-normal">
                  {item.title}
                </h4>
                {item.variant_title && (
                  <p className="text-[14px] text-black font-normal">
                    {item.variant_title}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-[14px] text-black font-normal">
                  ₹
                  {(parseFloat(item.price_set.shop_money.amount) / 100).toFixed(
                    2,
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Summary */}
      <div className="pt-4 space-y-2">
        {/* Subtotal */}
        <div className="flex justify-between text-[14px] text-black">
          <span className="">Subtotal</span>
          <span className="">
            ₹{(parseFloat(order.subtotal_price) / 100).toFixed(2)}
          </span>
        </div>

        {/* Discount */}
        {order.discount_applications &&
          order.discount_applications?.[0]?.code && (
            <div className="flex justify-between text-[14px] text-black">
              <div className="flex gap-[21px] items-center">
                <span className="">Discount</span>
                <span className="flex items-center gap-[4px]">
                  <span className="size-[14px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 14 14"
                      width="14"
                      height="14"
                      focusable="false"
                      aria-hidden="true"
                    >
                      <g
                        stroke="#6B6B6B"
                        stroke-width="1"
                        fill="none"
                        stroke-linejoin="round"
                        clip-path="url(#discount_svg__a)"
                      >
                        <path
                          stroke-linecap="round"
                          d="M10.5 1.5H7.93a2.5 2.5 0 0 0-1.8.766L1.52 7.052a1.5 1.5 0 0 0 .02 2.101l3.48 3.48a1.25 1.25 0 0 0 1.75.016l5.116-4.926a2 2 0 0 0 .613-1.441V3.5a2 2 0 0 0-2-2"
                        ></path>
                        <circle
                          cx="9.5"
                          cy="4.5"
                          r="0.563"
                          stroke-linecap="round"
                        ></circle>
                        <path d="M9.49 4.49h.02v.02h-.02z"></path>
                      </g>
                      <defs>
                        <clipPath id="discount_svg__a">
                          <path fill="#fff" d="M0 0h14v14H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span>
                    {order.discount_applications &&
                      order.discount_applications?.[0]?.code}
                  </span>
                </span>
              </div>
              <span className="font-semibold">
                -
                {formatPaiseToINR(
                  Number(order.discount_applications?.[0]?.value),
                )}
                .00
              </span>
            </div>
          )}

        {/* Shipping */}
        <div className="flex justify-between text-[14px] text-black">
          <span className="">Shipping</span>
          <span className="">
            {order.shipping_lines && order.shipping_lines[0]?.price === 0
              ? "Free"
              : `₹${order.shipping_lines?.[0]?.price?.toFixed(2) || "0.00"}`}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between text-[19px] text-black font-medium pt-2">
          <span className="text-[19px] text-black font-semibold">Total</span>
          <div className="text-right">
            <div className="font-semibold">
              <span className="text-[12px] text-[#707070] mr-1">INR</span>₹
              {(parseFloat(order.total_price) / 100).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="text-[12px] text-[#707070]">
          Including ₹0.00 in taxes
        </div>
      </div>
    </div>
  );
};
