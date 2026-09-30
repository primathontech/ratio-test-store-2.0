import Image from "next/image";
import React from "react";
import { OrderApiResponse, OtherChargeType } from "../../types";

interface RightSectionProps {
  order?: OrderApiResponse["order"];
  className?: string;
}

export const RightSection: React.FC<RightSectionProps> = ({
  order,
  className,
}) => {
  if (!order) {
    return null;
  }

  const discount = Number(order?.total_discount) / 100;

  const activeShippingLines = order.shipping_lines?.filter(
    (line) => !line.is_removed
  );

  const shippingCharge =
    activeShippingLines && activeShippingLines.length > 0
      ? {
          amount: activeShippingLines.reduce(
            (sum, line) => sum + line.price,
            0
          ),
          label:
            activeShippingLines.length === 1
              ? activeShippingLines[0].title
              : "Shipping",
        }
      : order.other_charges_breakdown?.find(
          (c) => c.type === OtherChargeType.SHIPPING_CHARGES
        );

  const codCharge = order.other_charges_breakdown?.find(
    (c) => c.type === OtherChargeType.CASHON_DELIVERY_FEE
  );

  const otherCharges = order.other_charges_breakdown?.filter(
    (c) =>
      c.type !== OtherChargeType.SHIPPING_CHARGES &&
      c.type !== OtherChargeType.CASHON_DELIVERY_FEE
  );

  const totalQuantity = order.line_items?.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div
      className={`bg-white rounded-2xl ring-1 ring-black/[0.06] shadow-sm pt-[11px] pb-[21px] px-[21px] lg:p-[21px] flex flex-col gap-[21px] ${className ?? ""}`}
    >
      {/* Product List */}
      {order.line_items && order.line_items.length > 0 && (
        <div>
          {order.line_items
            .filter((item) => item.current_quantity !== 0)
            .map((item) => (
              <div key={item.id} className="flex items-center gap-3.5 mb-4">
                {/* Product Image */}
                <div className="relative p-px rounded-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_-0.5px_2px_0_rgba(0,0,0,0.06),0_3px_6px_0_rgba(0,0,0,0.03)]">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="object-cover aspect-square rounded-lg"
                    />
                  )}

                  {/* Quantity Badge */}
                  <div className="absolute -top-2 -right-2 bg-black text-white font-bold text-xs size-6 flex items-center justify-center rounded-lg">
                    {item.current_quantity}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h4 className="text-sm text-black font-normal">
                    {item.title}
                  </h4>
                  {item.variant_title && (
                    <p className="text-sm text-black font-normal">
                      {item.variant_title}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="text-sm text-black font-normal">
                    ₹
                    {(
                      parseFloat(item.price_set.shop_money.amount) / 100
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Pricing Summary */}
      <div className="pt-4 space-y-2">
        {/* Subtotal */}
        <div className="flex justify-between text-sm text-black">
          <span>
            Subtotal{" "}
            {totalQuantity >= 2 && (
              <span className="md:hidden"> · {totalQuantity} items</span>
            )}
          </span>
          <span>
            ₹{(parseFloat(order.total_line_items_price) / 100).toFixed(2)}
          </span>
        </div>

        {/* Discount */}
        {order.discount_applications &&
          order.discount_applications?.[0]?.code && (
            <div className="flex justify-between text-sm text-black">
              <div className="flex gap-[21px] items-center">
                <span>Discount</span>
                <span className="flex items-center gap-1">
                  <span className="size-3.5">
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
                        <path d="M9.49 4.49h.02v.02h-.02z" />
                      </g>
                      <defs>
                        <clipPath id="discount_svg__a">
                          <path fill="#fff" d="M0 0h14v14H0z" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span>{order.discount_applications?.[0]?.code}</span>
                </span>
              </div>
              <span className="font-semibold">-₹{discount.toFixed(2)}</span>
            </div>
          )}

        {/* Shipping + COD */}
        <div className="flex justify-between text-sm text-black">
          <span>Shipping</span>
          <span>
            {(shippingCharge?.amount ?? 0) + (codCharge?.amount ?? 0) === 0
              ? "Free"
              : `₹${(((shippingCharge?.amount ?? 0) + (codCharge?.amount ?? 0)) / 100).toFixed(2)}`}
          </span>
        </div>

        {/* Other Extra Charges */}
        {otherCharges &&
          otherCharges.length > 0 &&
          otherCharges.map((charge, index) => {
            const chargeLabel = charge.label
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <div
                key={`${charge.type}-${index}`}
                className="flex justify-between text-sm text-black"
              >
                <span>{chargeLabel}</span>
                <span>₹{(charge.amount / 100).toFixed(2)}</span>
              </div>
            );
          })}

        {/* Taxes */}
        {parseFloat(order.total_tax) > 0 && (
          <div className="flex justify-between text-sm text-black">
            <span>Taxes</span>
            <span>{(parseFloat(order.total_tax) / 100).toFixed(2)}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between text-[19px] text-black font-medium pt-2">
          <span className="text-[19px] text-black font-semibold">Total</span>
          <div className="text-right">
            <div className="font-semibold">
              <span className="text-xs text-neutral-500 mr-1">INR</span>₹
              {(parseFloat(order.total_price) / 100).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="text-xs text-neutral-500">
          Including ₹{(parseFloat(order.total_tax || "0") / 100).toFixed(2)} in
          taxes
        </div>
      </div>
    </div>
  );
};
