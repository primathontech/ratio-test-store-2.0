import React from "react";
import Image from "next/image";
import { OrderApiResponse } from "./types";
import {
  FALLBACK_VALUE,
  formatPaiseToINRSafe,
  formatRupeesSafe,
} from "../../utils";

// Backend sends `other_charges_breakdown[].label` as raw snake_case
// (e.g. "cashon_delivery_fee"). Render it as human-readable Title Case,
// with the common "cashon" run-together fixed to "cash on".
const formatChargeLabel = (label: string): string =>
  label
    .replace(/_/g, " ")
    .replace(/\bcashon\b/gi, "cash on")
    .replace(/\b\w/g, (c) => c.toUpperCase());

interface RightSectionProps {
  order?: OrderApiResponse["order"];
  /** variant_id -> variant title (e.g. "Medium / Red") */
  variantTitles?: Record<string, string>;
  /** productHandle -> subtitle (from product metadata.subtitle) */
  productSubtitles?: Record<string, string>;
  className?: string;
}

export const RightSection: React.FC<RightSectionProps> = ({
  order,
  variantTitles,
  productSubtitles,
  className,
}) => {
  if (!order) {
    return null;
  }

  const rawDiscount = Number(order.discount_applications?.[0]?.value);
  const discount = Number.isFinite(rawDiscount) ? rawDiscount / 100 : NaN;

  // Calculate subtotal from line items (price × quantity) to show pre-discount total
  const subtotal =
    order.line_items?.reduce((sum, item) => {
      const price = parseFloat(
        item.price_set?.shop_money?.amount || item.price
      );
      const qty = Number(item.quantity);
      if (!Number.isFinite(price) || !Number.isFinite(qty)) {
        return sum;
      }
      return sum + price * qty;
    }, 0) ?? parseFloat(order.subtotal_price);

  return (
    <div
      className={`bg-white rounded-[8px] p-[21px] flex flex-col gap-[21px] ${className}`}
    >
      {order.line_items && order.line_items.length > 0 && (
        <div>
          {order.line_items.map((item) => {
            const variantLabel =
              variantTitles?.[item.variant_id] || item.variant_title;
            const subtitle = productSubtitles?.[item.productHandle];
            return (
              <div key={item.id} className="flex items-center gap-[14px] mb-4">
                <div className="relative">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="object-cover border rounded-[8px] border-[#d6d6d6]"
                    />
                  ) : (
                    <div className="w-[64px] h-[64px] border rounded-[8px] border-[#d6d6d6] bg-[#f5f5f5] flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#b0b0b0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute -top-[8px] -right-[8px] bg-black text-white font-bold text-[12px] size-[24px] flex items-center justify-center rounded-[8px]">
                    {item.quantity}
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-[14px] text-black font-normal">
                    {item.title}
                  </h4>
                  {subtitle && (
                    <p className="text-[12px] text-[#666] font-normal">
                      {subtitle}
                    </p>
                  )}
                  {variantLabel && variantLabel !== "Default Title" && (
                    <p className="text-[12px] text-[#666] font-normal">
                      {variantLabel}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-[14px] text-black font-normal">
                    {formatPaiseToINRSafe(
                      item.price_set?.shop_money?.amount || item.price
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-4 space-y-2">
        <div className="flex justify-between text-[14px] text-black">
          <span>Subtotal</span>
          <span>{formatPaiseToINRSafe(subtotal)}</span>
        </div>

        {order.discount_applications &&
          order.discount_applications?.[0]?.code && (
            <div className="flex justify-between items-start gap-[14px] text-[14px] text-black">
              <div className="flex gap-[21px] items-start min-w-0 flex-1">
                <span className="shrink-0">Discount</span>
                <span className="flex items-start gap-[4px] min-w-0 flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 14 14"
                    width="14"
                    height="14"
                    focusable="false"
                    aria-hidden="true"
                    className="shrink-0 mt-[3px]"
                  >
                    <g
                      stroke="#6B6B6B"
                      strokeWidth="1"
                      fill="none"
                      strokeLinejoin="round"
                      clipPath="url(#discount_svg__a)"
                    >
                      <path
                        strokeLinecap="round"
                        d="M10.5 1.5H7.93a2.5 2.5 0 0 0-1.8.766L1.52 7.052a1.5 1.5 0 0 0 .02 2.101l3.48 3.48a1.25 1.25 0 0 0 1.75.016l5.116-4.926a2 2 0 0 0 .613-1.441V3.5a2 2 0 0 0-2-2"
                      />
                      <circle
                        cx="9.5"
                        cy="4.5"
                        r="0.563"
                        strokeLinecap="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="discount_svg__a">
                        <path fill="#fff" d="M0 0h14v14H0z" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="min-w-0 break-all">
                    {order.discount_applications[0].code}
                  </span>
                </span>
              </div>
              <span className="font-semibold shrink-0 whitespace-nowrap">
                {Number.isFinite(discount)
                  ? `-${formatRupeesSafe(discount)}`
                  : FALLBACK_VALUE}
              </span>
            </div>
          )}

        <div className="flex justify-between text-[14px] text-black">
          <span>Shipping</span>
          <span>
            {order.shipping_lines && order.shipping_lines[0]?.price === 0
              ? "Free"
              : formatPaiseToINRSafe(order.shipping_lines?.[0]?.price)}
          </span>
        </div>

        {order.other_charges_breakdown?.map((charge, index) => (
          <div
            key={`${charge.type}-${index}`}
            className="flex justify-between items-center gap-[14px] text-[14px] text-black"
          >
            <span className="min-w-0 flex-1 break-words">
              {formatChargeLabel(charge.label)}
            </span>
            <span className="shrink-0 whitespace-nowrap">
              {formatPaiseToINRSafe(charge.amount)}
            </span>
          </div>
        ))}

        <div className="flex justify-between text-[19px] text-black font-medium pt-2">
          <span className="text-[19px] text-black font-semibold">Total</span>
          <div className="text-right">
            <div className="font-semibold">
              {(() => {
                const total = formatPaiseToINRSafe(order.total_price);
                if (total === FALLBACK_VALUE) {
                  return FALLBACK_VALUE;
                }
                return (
                  <>
                    <span className="text-[12px] text-[#707070] mr-1">INR</span>
                    {total}
                  </>
                );
              })()}
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
